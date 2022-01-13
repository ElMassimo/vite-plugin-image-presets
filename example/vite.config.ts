import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import imagePresets, { hdPreset, formatPreset, widthPreset, densityPreset } from 'vite-plugin-image-presets'
import type { Image } from 'vite-plugin-image-presets'

const rectFor = (width: number, height: number = width) => new Buffer(
  `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${width / 4}" ry="${height / 4}"/></svg>`
)

const withRoundBorders = (image: Image) => {
  const { width, height } = image.options
  return image
    .resize({ width, height: width, fit: 'cover' })
    .composite([{ input: rectFor(width), blend: 'dest-in' }])
}

export default defineConfig({
  plugins: [
    vue({ reactivityTransform: true }),
    imagePresets({
      hd: hdPreset({
        class: 'img hd',
        widths: [440, 700],
        sizes: '(min-width: 700px) 700px, 100vw',
        formats: {
          avif: { quality: 44 },
          webp: { quality: 44 },
          jpg: { quality: 50 },
        },
      }),
      full: formatPreset({
        class: 'img full-width',
        formats: {
          avif: { quality: 80 },
          webp: { quality: 80 },
          original: {},
        },
      }),
      thumbnail: hdPreset({
        class: 'img thumbnail',
        height: 48, // avoid layout shift
        widths: [48],
        formats: {
          png: { quality: 44 },
        },
      }),
      round: densityPreset({
        class: 'img density',
        height: 150, // avoid layout shift
        baseWidth: 150,
        density: [1, 1.5, 2],
        resizeOptions: {
          fit: 'cover',
        },
        withImage: withRoundBorders,
        formats: {
          webp: { quality: 40 },
          png: { quality: 40 },
        },
      }),
    },
    {
      // The node modules Netlify will cache are in the top dir.
      cacheDir: resolve(__dirname, '../node_modules/.images'),
    }),
  ],
})
