<template>
  <div class="neurotone-container">
    <div class="header">
      <h1>NEUROTONE</h1>
    </div>

    <img src="../assets/woman-meditating.png" alt="Neurotone Banner" class="woman">

    <div class="content">
      <p class="hope-text"><span class="emphasized">Hope</span> starts<br>
        with <span class="emphasized">Early Detection</span></p>
      <p class="subtitle">Simple Assessments for Potential Early Signs</p>
    </div>

    <button class="analyze-button" @click="$router.push('/home')">
      Analyze Now <span class="arrow">→</span>
    </button>
  </div>
</template>

<script setup>
// No props or complex logic needed for this static screen
</script>

<style scoped>
.neurotone-container {
  background-image: url('../assets/start-bg.png');
  background-size: cover;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  text-align: center;
  font-family: Poppins;
}

.header {
  width: 100%;
  margin-bottom: 42%;
}

h1 {
  color: #eb4899;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 1px;
}


.woman {
  width: auto;
  height: 48%;
}

.content {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.hope-text {
  font-size: 1.5rem;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  color: #5C4231;
}

.emphasized {
  font-weight: 800;
  color: #eb4899;
}

.subtitle {
  font-size: 0.9rem;
  color: #5C4231;
  margin-top: 0.5rem;
}

.analyze-button {
  background-color: #eb4899;
  color: white;
  border: none;
  border-radius: 0.7rem;
  padding: 1.3rem 2rem;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  width: 100%;
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow {
  margin-left: 0.5rem;
  font-size: 1.2rem;
}
</style>