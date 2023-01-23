import { resolve } from 'pathe'
import { describe, expect, test } from 'vitest'
import { densityPreset, formatFor, formatPreset, widthPreset } from 'vite-plugin-image-presets'
import sharp from 'sharp'

export const imagePath = resolve(__dirname, '../example/images/logo.png')

describe('formatPreset', () => {
  test('attrs and images', async () => {
    const preset = formatPreset({
      loading: undefined,
      formats: {
        avif: { quality: 70 },
        original: {},
      },
    })

    expect(preset.attrs).toEqual({})
    expect(preset.images.length).toEqual(2)
    expect(preset.inferDimensions).toBeUndefined()

    const [avifImage, originalImage] = preset.images

    expect(avifImage.type).toEqual('image/avif')
    expect(avifImage.srcset.length).toEqual(1)
    const { condition: avifCondition } = avifImage.srcset[0]
    expect(avifCondition).toEqual(undefined)

    expect(originalImage.type).toEqual(undefined)
    expect(originalImage.srcset.length).toEqual(1)
    const { condition: originalCondition } = originalImage.srcset[0]
    expect(originalCondition).toEqual(undefined)
  })
})

describe('widthPreset', () => {
  test('attrs and images', async () => {
    const preset = widthPreset({
      class: 'img',
      loading: 'lazy',
      widths: [440, 720, 1440],
      formats: {
        webp: { quality: 70 },
        jpg: { quality: 80 },
      },
      inferDimensions: true,
    })

    expect(preset.attrs).toEqual({ class: 'img', loading: 'lazy' })
    expect(preset.images.length).toEqual(2)
    expect(preset.inferDimensions).toEqual(true)

    const [webpImage, jpegImage] = preset.images

    expect(webpImage.type).toEqual('image/webp')
    expect(webpImage.srcset.length).toEqual(3)
    const { args: webpArgs, condition: webpCondition, generate: generateWebp } = webpImage.srcset[0]
    expect(webpArgs).toEqual({ preset: 'width', format: 'webp', width: 440, formatOptions: { quality: 70 } })
    expect(webpCondition).toEqual('440w')
    expect(await formatFor(await generateWebp(sharp(), webpArgs))).toEqual('webp')

    expect(jpegImage.type).toEqual('image/jpeg')
    expect(jpegImage.srcset.length).toEqual(3)
    const { args: jpegArgs, condition: jpegCondition, generate: generateJpeg } = jpegImage.srcset[2]
    expect(jpegArgs).toEqual({ preset: 'width', format: 'jpg', width: 1440, formatOptions: { quality: 80 } })
    expect(jpegCondition).toEqual('1440w')
    expect(await formatFor(await generateJpeg(sharp(), jpegArgs))).toEqual('jpeg')
  })
})

describe('densityPreset', () => {
  test('attrs and images', async () => {
    const preset = densityPreset({
      loading: 'lazy',
      baseWidth: 100,
      density: [1, 1.5, 2],
      formats: {
        webp: { quality: 70 },
        avif: { quality: 80 },
      },
      inferDimensions: false,
    })

    expect(preset.attrs).toEqual({ loading: 'lazy' })
    expect(preset.images.length).toEqual(2)
    expect(preset.inferDimensions).toEqual(false)

    const [webpImage, avifImage] = preset.images

    expect(webpImage.type).toEqual('image/webp')
    expect(webpImage.srcset.length).toEqual(3)
    const { args: webpArgs, condition: webpCondition, generate: generateWebp } = webpImage.srcset[0]
    expect(webpArgs).toEqual({ preset: 'density', format: 'webp', density: 1, baseWidth: 100, formatOptions: { quality: 70 } })
    expect(webpCondition).toEqual('1x')
    expect(await formatFor(await generateWebp(sharp(), webpArgs))).toEqual('webp')

    expect(avifImage.type).toEqual('image/avif')
    expect(avifImage.srcset.length).toEqual(3)
    const { args: avifArgs, condition: avifCondition, generate: generateAvif } = avifImage.srcset[2]
    expect(avifArgs).toEqual({ preset: 'density', format: 'avif', density: 2, baseWidth: 100, formatOptions: { quality: 80 } })
    expect(avifCondition).toEqual('2x')
    expect(await formatFor(await generateAvif(sharp(), avifArgs))).toEqual('avif')
  })
})
