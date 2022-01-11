import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import imagePresets, { widthPreset } from 'vite-plugin-image-presets'

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    imagePresets({
      full: widthPreset({
        class: 'img full-width',
        loading: 'lazy',
        widths: [768, 1440],
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
          webp: { quality: 50 },
          jpg: { quality: 70 },
        },
      }),
    }),
  ],
})
