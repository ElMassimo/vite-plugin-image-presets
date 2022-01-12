import { resolve } from 'pathe'
import { describe, test, expect } from 'vitest'
import { formatFor, formatPreset, densityPreset, widthPreset } from 'vite-plugin-image-presets'
import sharp from 'sharp'

const imagePath = resolve(__dirname, '../example/images/logo.png')

describe('formatPreset', () => {
  test('attrs and images', async () => {
    const preset = formatPreset({
      formats: {
        avif: { quality: 70 },
        original: {},
      },
    })

    expect(preset.attrs).toEqual({})
    expect(preset.images.length).toEqual(2)

    const [avifImage, originalImage] = preset.images

    expect(avifImage.type).toEqual('image/avif')
    expect(avifImage.srcset.length).toEqual(1)
    const { args: avifArgs, condition: avifCondition, generate: generateAvif } = avifImage.srcset[0]
    expect(avifCondition).toEqual(undefined)
    expect(await formatFor(generateAvif(sharp(), avifArgs))).toEqual('avif')

    expect(originalImage.type).toEqual(undefined)
    expect(originalImage.srcset.length).toEqual(1)
    const { args: originalArgs, condition: originalCondition, generate: generateOriginal } = originalImage.srcset[0]
    expect(originalCondition).toEqual(undefined)
    expect(await formatFor(generateOriginal(sharp(imagePath), originalArgs))).toEqual('png')
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
    })

    expect(preset.attrs).toEqual({ class: 'img', loading: 'lazy' })
    expect(preset.images.length).toEqual(2)

    const [webpImage, jpegImage] = preset.images

    expect(webpImage.type).toEqual('image/webp')
    expect(webpImage.srcset.length).toEqual(3)
    const { args: webpArgs, condition: webpCondition, generate: generateWebp } = webpImage.srcset[0]
    expect(webpArgs).toEqual({ format: 'webp', width: 440, formatOptions: { quality: 70 }, resizeOptions: undefined })
    expect(webpCondition).toEqual('440w')
    expect(await formatFor(generateWebp(sharp(), webpArgs))).toEqual('webp')

    expect(jpegImage.type).toEqual('image/jpeg')
    expect(jpegImage.srcset.length).toEqual(3)
    const { args: jpegArgs, condition: jpegCondition, generate: generateJpeg } = jpegImage.srcset[2]
    expect(jpegArgs).toEqual({ format: 'jpg', width: 1440, formatOptions: { quality: 80 }, resizeOptions: undefined })
    expect(jpegCondition).toEqual('1440w')
    expect(await formatFor(generateJpeg(sharp(), jpegArgs))).toEqual('jpeg')
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
        jpg: { quality: 80 },
      },
    })

    expect(preset.attrs).toEqual({ loading: 'lazy' })
    expect(preset.images.length).toEqual(2)

    const [webpImage, jpegImage] = preset.images

    expect(webpImage.type).toEqual('image/webp')
    expect(webpImage.srcset.length).toEqual(3)
    const { args: webpArgs, condition: webpCondition, generate: generateWebp } = webpImage.srcset[0]
    expect(webpArgs).toEqual({ format: 'webp', density: 1, baseWidth: 100, formatOptions: { quality: 70 }, resizeOptions: undefined, baseHeight: undefined })
    expect(webpCondition).toEqual('1x')
    expect(await formatFor(generateWebp(sharp(), webpArgs))).toEqual('webp')

    expect(jpegImage.type).toEqual('image/jpeg')
    expect(jpegImage.srcset.length).toEqual(3)
    const { args: jpegArgs, condition: jpegCondition, generate: generateJpeg } = jpegImage.srcset[2]
    expect(jpegArgs).toEqual({ format: 'jpg', density: 2, baseWidth: 100, formatOptions: { quality: 80 }, resizeOptions: undefined, baseHeight: undefined })
    expect(jpegCondition).toEqual('2x')
    expect(await formatFor(generateJpeg(sharp(), jpegArgs))).toEqual('jpeg')
  })
})
