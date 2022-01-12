import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imagePresets, { formatPreset, widthPreset, densityPreset } from 'vite-plugin-image-presets'

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    imagePresets({
      full: formatPreset({
        class: 'img full-width',
        loading: 'lazy',
        formats: {
          avif: { quality: 80 },
          png: { quality: 70 },
        },
      }),
      thumbnail: widthPreset({
        class: 'img thumbnail',
        loading: 'lazy',
        widths: [48, 96],
        formats: {
          avif: { quality: 50 },
          original: {},
        },
      }),
      density: densityPreset({
        class: 'img density',
        loading: 'lazy',
        baseWidth: 100,
        density: [1, 1.5, 2],
        formats: {
          webp: { lossless: true },
          original: {},
        },
      }),
    }),
  ],
})
