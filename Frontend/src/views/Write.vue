<template>
    <div class="writing-test-container">
        <div class="title-box">
            <h1 class="title">WRITING TEST</h1>
        </div>
        <div style="padding: 0rem 1.5rem;">


            <div class="upload-options">
                <button class="upload-option" @click="takePhoto">
                    <img src="../assets/camera.png" alt="Camera Icon" class="camera-icon"> <span>Take Photo</span>
                </button>

                <div class="divider"></div>

                <button class="upload-option" @click="chooseFromGallery">
                    <img src="../assets/photos.png" alt="Photos Icon" class="photos-icon"> <span>Choose From
                        Gallery</span>
                </button>
            </div>

            <div class="upload-header">
                <button class="back-button" @click="$router.push('/home')">
                    <span class="arrow">&larr;</span>
                </button>
                <h2 class="upload-title">Upload Photo</h2>
            </div>

            <div class="instructions">
                <p class="instruction-detail">
                    <span style="font-weight: 600;">Draw the shown scribble </span>as neat as you can in a single continuous stroke. Remember to use a plain
                    sheet of paper and a ball-point pen for best results.
                </p>
            </div>

            <div class="flex-wrapper">
                <span
                    style="display: flex; width: 100%; justify-content: center; margin-bottom: 3rem; margin-top: 3rem;">
                    <img src="../assets/scribble.png" alt="Reference image" style="height: 10rem; width: auto;"/>
                </span>
                <div class="vertical-divider"></div>
                <div class="image-preview" :class="{ 'has-image': hasImage }">
                    <img v-if="imagePreview" :src="imagePreview" alt="Uploaded image" />
                    <div v-if="!imagePreview" class="not-found">
                        <img src="../assets/notfound.png" alt="Image Not Found!" style="height: 2.5rem; width: 2.5rem; margin-bottom: 0.5rem;">
                        <h5 style="font-size: 0.7rem; line-height: 1rem;">Upload an image to get started</h5>
                    </div>
                </div>
            </div>

            <input type="file" ref="fileInput" accept="image/*" style="display: none;" @change="handleFileChange" />
            <div class="submit-btn" :class="{ 'disabled': !hasImage, 'loading': isLoading }" @click="uploadImage">{{ isLoading ? 'Uploading...' : 'Upload Now' }}
            </div>
            <div class="result" style="border: 1px #6d4c41 solid; padding: 1rem; width: 100%; border-radius: 0.8rem; height: 5rem; margin-top: 0.4rem;"></div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive state
const fileInput = ref(null);
const imagePreview = ref('');
const hasImage = ref(false);
const isLoading = ref(false);
const apiResponse = ref(null);
// Methods
const takePhoto = () => {
    // On mobile this would trigger the device camera
    // For this example, we'll just trigger the file input
    fileInput.value.click();
};

const chooseFromGallery = () => {
    fileInput.value.click();
};

const goBack = () => {
    // Navigate back or reset the form
    imagePreview.value = '';
    hasImage.value = false;
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;
            hasImage.value = true;
        };
        reader.readAsDataURL(file);
    }
};

const uploadImage = async () => {
    if (!hasImage.value || isLoading.value) return;
    
    // Get the file from the input element
    const file = fileInput.value.files[0];
    if (!file) return;
    
    try {
        isLoading.value = true;
        
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('file', file);
        
        // Make the API request
        const response = await fetch('https://neurotone-docker.onrender.com/scribble', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        // Parse and store the JSON response
        const data = await response.json();
        apiResponse.value = data;
        console.log(apiResponse.value)
        
    } catch (error) {
        console.error('Error uploading image:', error);
        apiResponse.value = { error: error.message };
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.writing-test-container {
    max-width: 100%;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    padding-top: 0rem;
    font-family: Poppins;
    color: #6d4c41;
}

.not-found {
    display: flex; flex-direction: column; justify-content: center; text-align: center; align-items: center; padding: 0.5rem;
}

.title {
    text-align: center;
    color: #e91e63;
    font-size: 1.5rem;
    font-weight: 800;
}

.flex-wrapper {
    display: flex; align-items: center; justify-content: space-around; border: 1px solid #6d4c41; border-radius: 0.8rem; height: 15rem; padding: 1rem;
}

.title-box {
    background-color: #ffeef5;
    padding-top: 2.4rem;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.upload-options {
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 0.8rem;
    border: #6d4c41 1px solid;
    margin-bottom: 2.5rem;
}

.upload-option {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.8rem;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    color: #6d4c41;
    font-weight: 500;
}


.camera-icon {
    height: 1.3rem;
    width: auto;
    margin-right: 0.4rem;
}

.submit-btn.disabled {
    background-color: #7A6B5F;
    cursor: not-allowed;
}

.submit-btn.loading {
    background-color: #7A6B5F;
    cursor: wait;
}

.photos-icon {
    height: 1.3rem;
    width: auto;
    margin-right: 0.4rem;
}

.divider {
    height: 1px;
    background-color: #e0e0e0;
    width: 90%;
    margin: 0 auto;
}

.upload-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.vertical-divider {
    height: 12rem; width: 0.2rem; background-color: #6d4c41; margin-left: 0.5rem; margin-right: 0.5rem;
}

.back-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 24px;
    color: #6d4c41;
    padding: 0;
    margin-right: 10px;
}

.arrow {
    font-size: 24px;
}

.upload-title {
    font-size: 20px;
    font-weight: bold;
    margin: 0;
}

.instructions {
    margin-bottom: 20px;
    line-height: 1.5rem;
}

.instruction-detail {
    margin-top: 0;
    color: #6d4c41;
    font-size: 14px;
}

.submit-btn {
    margin-top: 0.4rem;
    border-radius: 0.6rem;
    padding: 1rem 1rem;
    background-color: #6d4c41;
    font-weight: 600;
    color: #FFF;
    width: 45%;
    text-align: center;
}

.image-preview {
    width: 100%;
    height: 12rem;
    background-color: #e0e0e0;
    border-radius: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.image-preview.has-image {
    background-color: transparent;
}

.image-preview img {
    max-width: 100%;
    max-height: 100%;
}
</style>