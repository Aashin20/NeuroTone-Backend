<template>
  <div class="tremor-detection">
    <header class="app-header">
      <h1>TREMOR DETECTION</h1>
    </header>

    <main class="content">
      <div class="result-circle" :class="{ pulseCircle: hasStarted == 'started', noPulse: hasStarted != 'started' }"
        @click="startTest">
        <div class="result-text" v-if="hasStarted == 'completed'">
          <h2>{{ tremorSeverity }} Severity</h2>
          <p><strong>{{ tremorCount }}</strong> TREMORS RECORDED</p>
          <small>Result saved to profile</small>
        </div>
        <h1 v-if="hasStarted == 'waiting'" style="font-size: 3.5rem; font-weight: 600;">Go!</h1>
        <h1 v-if="hasStarted == 'started'" style="font-size: 2.5rem; font-weight: 600;">{{ analyse }}</h1>
      </div>

      <div class="instructions" :class="{ pulseWithdrawal: hasStarted == 'started' }">
        <div class="back-section">
          <span style="display: flex; align-items: center; margin-bottom: 0.6rem;">
            <button class="back-button" @click="$router.push('/home')">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="#795548" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 19L5 12L12 5" stroke="#795548" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </button>
            <p class="breathing-reminder">Remember to breathe evenly</p>
          </span>
          <p class="time-remaining"><strong>{{ timeLeft }} seconds remaining</strong></p>
        </div>

        <div class="phone-placement-instructions">
          <p>Place the phone in the user's hand. Make sure it is held comfortably, but firmly and as horizontally as
            possible then press "Go".</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

// Reactive data
const tremorSeverity = ref('LOW');
const tremorCount = ref(12);
const timer = ref(null);
const hasStarted = ref("waiting")
const analyse = ref("Analysing...")

const isRunning = ref(false)
const testComplete = ref(false)
const timeLeft = ref(15)
const lastReading = ref({ x: 0, y: 0, z: 0 })
const TREMOR_THRESHOLD = 1.5 // Adjust as required


const getAccess = async () => {
  try {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      const permission = await DeviceMotionEvent.requestPermission()
      if (permission === 'granted') {
        return true
      }
    } else {
      return true
    }
  } catch (err) {
    console.error('Error:', err)
    return false
  }
  return false
}

const detectTremor = (event) => {
  const current = event.accelerationIncludingGravity

  // Calculate the magnitude of change in acceleration
  const deltaX = Math.abs(current.x - lastReading.value.x)
  const deltaY = Math.abs(current.y - lastReading.value.y)
  const deltaZ = Math.abs(current.z - lastReading.value.z)

  // If change is above threshold, count it as a tremor
  if (deltaX > TREMOR_THRESHOLD ||
    deltaY > TREMOR_THRESHOLD ||
    deltaZ > TREMOR_THRESHOLD) {
    tremorCount.value++
  }

  // Update last reading
  lastReading.value = {
    x: current.x,
    y: current.y,
    z: current.z
  }
}

const calculateSeverity = () => {
  if (tremorCount.value > 40) {
    tremorSeverity.value = 'High'
  } else if (tremorCount.value > 20) {
    tremorSeverity.value = 'Medium'
  } else {
    tremorSeverity.value = 'Low'
  }
}

const endTest = () => {
  clearInterval(timer.value)
  window.removeEventListener('devicemotion', detectTremor)
  isRunning.value = false
  testComplete.value = true
  hasStarted.value = "completed"
  calculateSeverity()
}

const startTest = async () => {
  if (await getAccess()) {
    isRunning.value = true
    testComplete.value = false
    tremorCount.value = 0
    timeLeft.value = 15
    hasStarted.value = "started"
    window.addEventListener('devicemotion', detectTremor)
    timer.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
        if (analyse.value.length == 9) {
          analyse.value = "Analysing."
        }
        else if (analyse.value.length == 10) {
          analyse.value = "Analysing.."
        }
        else if (analyse.value.length == 11) {
          analyse.value = "Analysing..."
        }
        else {
          analyse.value = "Analysing"
        }
      }
      if (timeLeft.value <= 0) {
        endTest()
      }
    }, 1000)
  }
}

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
  window.removeEventListener('devicemotion', detectTremor)
})

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value);
  }
});
</script>

<style scoped>
.tremor-detection {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #FAF3F5;
  font-family: Poppins;
  color: #5C4231;
}

.app-header {
  padding: 2rem;
  text-align: center;
}

.app-header h1 {
  color: #E83E8C;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
}

.result-circle {
  min-width: 21rem;
  min-height: 21rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background-color: #E83E8C;
}

.result-text h2 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 10px 0;
}

.result-text p {
  font-weight: 500;
  font-size: 1.2rem;
  margin: 0.5rem 0;
  margin-bottom: 1.2rem;
}

.result-text small {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 400;
}

.instructions {
  width: 100%;
}

.back-section {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
}

.breathing-reminder {
  color: #795548;
  margin: 0;
  font-size: 0.85rem;
}

.time-remaining {
  font-size: 1.5rem;
  font-weight: 700;
  color: #795548;
}

.phone-placement-instructions {
  color: #795548;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}

.pulseCircle {
  background-color: #E83E8C;
  border-radius: 50%;
  position: absolute;
  margin-top: -48%;
}

.pulseCircle::before,
.pulseCircle::after {
  content: '';
  position: absolute;
  border: 2px solid #E83E8C;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: pulse 2s linear infinite;
}

.pulseCircle::after {
  animation-delay: 1s;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.noPulse {
  margin-top: 3%;
  margin-bottom: 5rem;
}

.pulseWithdrawal {
  margin-top: 110%;
}
</style>