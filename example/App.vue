<script setup lang="ts">
import fullImage from './images/logo.png?preset=full'
import densityImage from './images/logo.png?preset=density'
import thumbnailImage from './images/logo.png?preset=thumbnail'
</script>

<template>
  <main>
    <h1>Gallery</h1>
    <h2>Thumb</h2>
    <Image :src="thumbnailImage"/>
    <h2>Density</h2>
    <Image :src="densityImage"/>
    <h2>Full</h2>
    <Image :src="fullImage"/>
  </main>
</template>

<style>
* {
  transition: all 0.3s ease;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
}

main {
  margin: 0 auto;
  text-align: center;
}

.full-width {
  width: max-content;
}

.thumbnail {
  width: 48px;
}

h2 {
  margin-top: 3rem;
}
</style>
