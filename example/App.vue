<script setup lang="ts">
import roundImage from '@images/iles.svg?preset=round'
import pandaImage from '@images/panda.png?preset=hd'
import fullImage from '@images/vite-ruby.png?preset=full'
</script>

<template>
  <main>
    <h1>
      <ExternalLink href="https://github.com/ElMassimo/vite-plugin-image-presets">
        <img srcset="@images/logo.svg?preset=thumbnail&srcset" height="48"/>
        <p style="margin-top: 0"><code>vite-plugin-image-presets</code></p>
      </ExternalLink>
    </h1>
    <ExternalLink href="https://vite-ruby.netlify.app">
      <img srcset="@images/vite-rails.png?preset=thumbnail&srcset" height="48"/>
      <Caption>Optimized based on screen density and size, single-format</Caption>
    </ExternalLink>
    <ExternalLink href="https://iles-docs.netlify.app">
      <Image :src="roundImage"/>
      <Caption>A custom transform squares the image and rounds its borders</Caption>
    </ExternalLink>
    <ExternalLink href="https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/">
      <Image :src="pandaImage"/>
      <Caption>Optimized based on screen density and size, multi-format</Caption>
    </ExternalLink>
    <ExternalLink href="https://vite-ruby.netlify.app">
      <Image :src="fullImage"/>
      <Caption>No resizing, multi-format</Caption>
    </ExternalLink>
  </main>
  <article>
    <p><b>Recommended Articles</b></p>
    <ul>
      <li>
        <ExternalLink href="https://jakearchibald.com/2015/anatomy-of-responsive-images/">
          The anatomy of responsive images
        </ExternalLink>
      </li>
      <li>
        <ExternalLink href="https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/">
          Halve the size of images by optimising for high density displays
        </ExternalLink>
      </li>
    </ul>
  </article>
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
  margin: 30px 0;
}

main {
  text-align: center;
}

article {
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 700px;
}

main a {
  color: inherit !important;
  text-decoration: none;
}

@media (max-width: 440px) {
  h1 {
    font-size: 1.2rem;
  }
}

.img {
  margin-top: 1.5rem;
  max-height: 100vh;
  max-width: min(700px, 100%);
}

h2 {
  margin-top: 3rem;
}
</style>
