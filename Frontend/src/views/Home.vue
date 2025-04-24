<template>
    <div class="app-container">

        <div class="main-content">
            <div class="title-section">
                <h1>NEUROTONE</h1>
            </div>

            <Carousel v-bind="config" style="margin-bottom: 2rem; height: 13.4rem; border-radius: 0.8rem;">
            <Slide v-for="image in images" :key="image.id" @click="$router.push(image.route)" style="padding: 0rem 1rem; height: 13.4rem; border-radius: 0.8rem;">
                <div class="autoscroll-container" 
                    :style='`background-image: url(${image.url}); background-size: cover; height: 100%; width: 100%; border-radius: 0.8rem;`'>
                </div>
            </Slide>
        </Carousel>

            <section class="all-tests-section">
                <h2>ALL TESTS</h2>
                <div class="test-boxes">
                    <div class="test-box" @touchstart="isTouched = 'voice'" :class="{ active: isTouched == 'voice' }"
                        @click="$router.push('/voice')">
                        <img src="../assets/rotatedarrow.png" class="rotated-arrow" v-show="isTouched == 'voice'">
                        <img src="../assets/voice.png" class="art">
                        <h4 class="art-text">Voice Analysis</h4>
                    </div>
                    <div class="test-box" @touchstart="isTouched = 'posture'" @click="$router.push('/write')"
                        :class="{ active: isTouched == 'posture' }">
                        <img src="../assets/rotatedarrow.png" class="rotated-arrow" v-show="isTouched == 'posture'">
                        <img src="../assets/posture.png" class="art">
                        <h4 class="art-text">Scribble Test</h4>
                    </div>
                    <div class="test-box" @touchstart="isTouched = 'hand'" :class="{ active: isTouched == 'hand' }"
                        @click="$router.push('/tremor')">
                        <img src="../assets/rotatedarrow.png" class="rotated-arrow" v-show="isTouched == 'hand'">
                        <img src="../assets/hand.png" class="art">
                        <h4 class="art-text">Tremor Detection</h4>
                    </div>
                </div>
            </section>

            <section class="recent-analysis-section">
                <h2>RECENT ANALYSIS</h2>
                <div class="report-card">
                    <div class="report-date">04 FEB 2025</div>
                    <div class="report-title">COMPLETE TEST REPORT</div>
                    <button class="download-button" @click="getRecentReport">
                        Download Now
                        <span class="down-arrow">↓</span>
                    </button>
                    <div class="mail-option">Or Mail it Instead</div>
                </div>
            </section>
            <div class="app-footer">
                <div class="nav-items">
                    <div class="nav-item">
                        <img src="../assets/user.png" alt="Profile Icon" class="icon">
                        <div class="nav-text">Profile</div>
                    </div>
                    <div class="nav-item">
                        <img src="../assets/web.png" alt="Resources Icon" class="icon">
                        <div class="nav-text">Resources</div>
                    </div>
                    <div class="nav-item">
                        <img src="../assets/bug.png" alt="Report Icon" class="icon">

                        <div class="nav-text">Report</div>
                    </div>
                    <div class="nav-item">
                        <img src="../assets/language.png" alt="Language Icon" class="icon">
                        <div class="nav-text">Language</div>
                    </div>
                </div>
                <div class="footer-credit">
                    Made with ☕ & 💖 by <span style="font-weight: 800;">Team Meltdown</span> | 2025
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue';
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';

import cardImage1 from "../assets/banner.png"
import cardImage2 from "../assets/banner2.png"
import cardImage3 from "../assets/banner3.png"

const isTouched = ref('voice')

const images = [{ "id": 1, "url": cardImage2, "route": "/tremor" }, { "id": 2, "url": cardImage3, "route": "/write" }, { "id": 3, "url": cardImage1, "route": "/voice" }]

async function getRecentReport(){
    try {
        const response = await fetch('https://6124-122-187-117-178.ngrok-free.app/report', {
            method: 'GET',
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
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            const errorText = await response.text();
            console.error('Failed to submit recording:', errorText);
        }
    } catch (error) {
        console.error('Error fetching PDF:', error);
    }
}

const config = {
    height: 196,
    itemsToShow: 1,
    gap: 5,
    autoplay: 3000,
    wrapAround: true,
    pauseAutoplayOnHover: true,
};

</script>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 100%;
    width: 100%;
    margin: 0 auto;
    font-family: Poppins;
}

.main-content {
    flex: 1;
    padding: 0;
    overflow-y: auto;
}

.title-section {
    margin-bottom: 1rem;
    padding: 1rem 0;
    padding-top: 2.4rem;
    padding-bottom: 1.5rem;
    text-align: center;
    background-color: #FFF0F5;
}

h1 {
    color: #eb4899;
    font-weight: 800;
    font-size: 1.5rem;
}

.brown-box {
    height: 13.5rem;
    background-image: url('../assets/banner.png');
    background-size: cover;
    margin: 0 1.2rem 2.2rem 1.2rem;
    border-radius: 0.9rem;
}

.all-tests-section {
    padding: 0 1.2rem;
}

h2 {
    color: #5C4231;
    font-size: 1.2rem;
    font-weight: 800;
    margin-bottom: 1rem;
}

.test-boxes {
    display: flex;
    gap: 15px;
    margin-bottom: 2.2rem;
    overflow-x: scroll;
}

.test-box {
    width: 12rem;
    min-width: 12rem;
    height: 12rem;
    border-radius: 10px;
    background-color: #FDECCD;
    display: flex;
    justify-content: end;
    align-items: center;
    flex-direction: column;
    padding: 1.8rem;
    padding-top: 0rem;
}

.art {
    height: 3.5rem;
    width: auto;
}

.art-text {
    font-size: 0.9rem;
    font-weight: 500;
    color: #5C4231;
    margin-top: 0.8rem;
}

.active {
    background-color: #FFD384 !important;
}

.rotated-arrow {
    padding-bottom: 2rem;
    padding-left: 8.6rem;
}

.recent-analysis-section {
    padding: 0 1.2rem;
}

.report-card {
    background-color: #3d2200;
    padding: 2.2rem 1.2rem;
    border-radius: 10px;
    color: #e9c59a;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 2rem;
}

.report-date {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.report-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1.4rem;
}

.download-button {
    background-color: #e9c59a;
    color: #5C4231;
    border: none;
    padding: 0.5rem 1.2rem;
    border-radius: 0.8rem;
    cursor: pointer;
    font-size: 0.9rem;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
}

.down-arrow {
    margin-left: 0.7rem;
}

.mail-option {
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
}

.app-footer {
    background-color: #FFF0F5;
    padding: 1rem 1rem;
}

.nav-items {
    display: flex;
    justify-content: space-around;
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #5C4231;
    font-size: 12px;
}

.nav-icon {
    width: 25px;
    height: 25px;
    margin-bottom: 5px;
}

.footer-credit {
    text-align: center;
    font-size: 12px;
    color: #5C4231;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
}

.icon {
    height: 2rem;
    width: auto;
    max-width: 2rem;
    max-height: 2rem;
    margin-bottom: 0.6rem;
}
</style>