<script setup lang="ts">
import fullImage from './images/logo.png?preset=full'
import hiresImage from './images/logo.png?preset=hires'
import thumbnailImage from './images/logo.png?preset=thumbnail'
</script>

<template>
  <main>
    <h1>Gallery</h1>
    <h2>Thumbnail</h2>
    <Image :src="thumbnailImage"/>
    <h2>Full</h2>
    <Image :src="fullImage"/>
    <h2>Hi-Res</h2>
    <Image :src="hiresImage"/>
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
