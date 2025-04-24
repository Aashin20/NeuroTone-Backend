<template>
    <div class="voice-analysis">
        <div class="header">
            <h1>VOICE ANALYSIS</h1>
        </div>

        <div class="prompt-box">
            <p>
                <span v-for="(word, index) in promptWords" :key="index"
                    :class="{ 'spoken-word': spokenWordIndices.includes(index) }">
                    {{ word }}{{ index < promptWords.length - 1 ? ' ' : '' }} </span>
            </p>
        </div>

        <div class="controls">
            <img src="../assets/backarrow.png" @click="$router.push('/home')" class="back-btn">

            <button class="record-button" @click="toggleRecording">
                {{ isRecording ? 'Recording...' : 'Tap to start recording..' }}
            </button>
        </div>

        <div class="instructions">
            <p>
                <span style="font-weight: 600;">Repeat the words</span> shown on the screen in
                your usual speed, taking pauses where necessary. Tap the button to start analysing.
            </p>
        </div>

        <Transition name="slide-up">
            <div class="next-btn" v-if="hasRecorded" @click="goToNextPrompt">
                CONTINUE
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State
const isRecording = ref(false);
const hasRecorded = ref(false);
const transcript = ref('');
const recognition = ref(null);
let promptText = "IT IS QUITE A PLEASANT AFTERNOON FOR A PROMENADE IN THE PARK";
const promptWords = ref(promptText.split(' '))
const spokenWordIndices = ref([]);
let promptIndex = 0

const promptContent = ref(["IT IS QUITE A PLEASANT AFTERNOON FOR A PROMENADE IN THE PARK", "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG", "{SCREAM WITHOUT MOVING YOUR LIPS}"])

const mediaRecorder = ref(null);
const audioContext = ref(null);
const audioStream = ref(null);
const audioBlob = ref(null);
const processorNode = ref(null);
const recordedSamples = ref([]);


function goToNextPrompt() {
    if (promptIndex < 2){
        promptIndex++;
        promptText = promptContent.value[promptIndex]

        transcript.value = ""
        recognition.value = null;
        spokenWordIndices.value = [];
        isRecording.value = false;
        hasRecorded.value = false;
        mediaRecorder.value = null
        audioBlob.value = null;
        audioContext.value = null;
        audioStream.value = null;
        processorNode.value = null;
        promptWords.value = promptText.split(' ')
    }
    else {
        submitRecording()
    }
}

const setupSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.value = new SpeechRecognition();
        recognition.value.continuous = true;
        recognition.value.interimResults = true;

        recognition.value.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript.value += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const fullTranscript = (transcript.value + interimTranscript).toUpperCase();

            promptWords.value.forEach((word, index) => {
                if (fullTranscript.includes(word) && !spokenWordIndices.value.includes(index)) {
                    spokenWordIndices.value.push(index);
                }
            });

            if (spokenWordIndices.value.length === promptWords.value.length) {
                stopRecording();
            }
        };

        recognition.value.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };
    } else {
        alert('Your browser does not support speech recognition. Please try a different browser.');
    }
};

function encodeWAV(samples, sampleRate = 44100) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write the PCM samples
    floatTo16BitPCM(view, 44, samples);

    return view.buffer;
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

const setupAudioRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStream.value = stream;

        audioContext.value = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 44100 // Standard sample rate for good compatibility
        });

        const source = audioContext.value.createMediaStreamSource(stream);

        const bufferSize = 4096;
        const recorder = audioContext.value.createScriptProcessor(bufferSize, 1, 1);

        recorder.onaudioprocess = (e) => {
            const input = e.inputBuffer.getChannelData(0);

            const buffer = new Float32Array(input);

            recordedSamples.value.push(buffer);
        };

        source.connect(recorder);
        recorder.connect(audioContext.value.destination);

        // Store references
        processorNode.value = recorder;
        mediaRecorder.value = {
            isRecording: true
        };

        console.log('Audio recording setup complete with standard WAV parameters');
        return true;
    } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Unable to access your microphone. Please check permissions and try again.');
        return false;
    }
};

const toggleRecording = async () => {
    if (!isRecording.value) {
        if (!recognition.value) {
            setupSpeechRecognition();
        }
        const audioSetupSuccess = await setupAudioRecording();
        if (!audioSetupSuccess) return;

        startRecording();
    } else {
        stopRecording();
    }
};

const startRecording = () => {
    isRecording.value = true;
    recordedSamples.value = [];

    if (recognition.value) {
        transcript.value = '';
        spokenWordIndices.value = [];
        recognition.value.start();
    }

    console.log('Started recording audio and speech recognition');
};

const stopRecording = () => {
    isRecording.value = false;
    hasRecorded.value = true;

    if (recognition.value) {
        recognition.value.stop();
    }
    if (processorNode.value) {
        processorNode.value.disconnect();

        let sampleLength = 0;
        for (const buffer of recordedSamples.value) {
            sampleLength += buffer.length;
        }

        const mergedSamples = new Float32Array(sampleLength);
        let offset = 0;

        for (const buffer of recordedSamples.value) {
            mergedSamples.set(buffer, offset);
            offset += buffer.length;
        }

        const wavBuffer = encodeWAV(mergedSamples, audioContext.value.sampleRate);

        audioBlob.value = new Blob([wavBuffer], { type: 'audio/wav' });

        console.log('Stopped recording, created WAV file with size:', audioBlob.value.size, 'bytes');

        if (audioStream.value) {
            audioStream.value.getTracks().forEach(track => track.stop());
        }
    }
};

const submitRecording = async () => {
    if (!audioBlob.value) {
        console.error('No audio recording available');
        return;
    }

    try {
        console.log('Sending WAV file of size:', audioBlob.value.size, 'bytes');

        const formData = new FormData();
        formData.append('file', audioBlob.value, 'recording.wav');
        formData.append('transcript', transcript.value);

        const response = await fetch('https://neurotone-docker.onrender.com/analyze', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'analysis.pdf';
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the URL object
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            const errorText = await response.text();
            console.error('Failed to submit recording:', errorText);
            alert('Failed to submit recording: ' + errorText);
        }
    } catch (error) {
        console.error('Error submitting recording:', error);
        alert('Error submitting recording. Please check your connection and try again.');
    }
};
</script>

<style scoped>
.voice-analysis {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    font-family: Poppins;
}

.header {
    padding: 1rem 0;
    padding-top: 2.4rem;
    background-color: #ffecf2;
    text-align: center;
    margin-bottom: 1rem;
}

h1 {
    color: #eb4899;
    font-weight: 800;
    font-size: 1.5rem;
    margin: 0;
}

.prompt-box {
    background-color: #5C4231;
    color: rgba(193, 154, 107, 0.5);
    font-size: 1.7rem;
    font-weight: bold;
    text-align: center;
    margin: 0.8rem 1rem;
    padding: 4rem 1rem;
    border-radius: 0.9rem;
    line-height: 2.5rem;
}

.spoken-word {
    color: #FFE5C6;
    transition: color 0.3s ease;
}

.controls {
    display: flex;
    align-items: center;
    padding: 1.8rem;
    padding-left: 0.8rem;
}

.record-button {
    flex: 1;
    border: 1px solid #5C4231;
    border-radius: 6px;
    background-color: white;
    padding: 1rem;
    font-size: 16px;
    color: #5C4231;
    cursor: pointer;
    text-align: center;
    width: 80vw;
}

.instructions {
    padding: 0 1.2rem;
    color: #5C4231;
    font-size: 14px;
    line-height: 1.8rem;
}

.back-btn {
    width: 2rem;
    margin-right: 1rem;
}

.next-btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    height: 4rem;
    background-color: #eb4899;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFF;
    font-weight: 600;
    font-size: 1.1rem;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(200%);
}

.slide-up-enter-to,
.slide-up-leave-from {
    transform: translateY(0);
}
</style>