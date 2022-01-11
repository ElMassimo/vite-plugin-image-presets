import { describe, test, expect } from 'vitest'
import { formatFor, densityPreset, widthPreset } from 'vite-plugin-image-presets'
import sharp from 'sharp'

describe('widthPreset', () => {
  test('attrs and images', () => {
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
    expect(webpArgs).toEqual({ format: 'webp', width: 440, formatOptions: { quality: 70 } })
    expect(webpCondition).toEqual('440w')
    expect(formatFor(generateWebp(sharp(), webpArgs))).toEqual('webp')

    expect(jpegImage.type).toEqual('image/jpeg')
    expect(jpegImage.srcset.length).toEqual(3)
    const { args: jpegArgs, condition: jpegCondition, generate: generateJpeg } = jpegImage.srcset[2]
    expect(jpegArgs).toEqual({ format: 'jpg', width: 1440, formatOptions: { quality: 80 } })
    expect(jpegCondition).toEqual('1440w')
    expect(formatFor(generateJpeg(sharp(), jpegArgs))).toEqual('jpeg')
  })
})

describe('densityPreset', () => {
  test('attrs and images', () => {
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
    expect(webpArgs).toEqual({ format: 'webp', width: 440, formatOptions: { quality: 70 } })
    expect(webpCondition).toEqual('1x')
    expect(formatFor(generateWebp(sharp(), webpArgs))).toEqual('webp')

    expect(jpegImage.type).toEqual('image/jpeg')
    expect(jpegImage.srcset.length).toEqual(3)
    const { args: jpegArgs, condition: jpegCondition, generate: generateJpeg } = jpegImage.srcset[2]
    expect(jpegArgs).toEqual({ format: 'jpg', width: 1440, formatOptions: { quality: 80 } })
    expect(jpegCondition).toEqual('1440w')
    expect(formatFor(generateJpeg(sharp(), jpegArgs))).toEqual('jpeg')
  })
})
