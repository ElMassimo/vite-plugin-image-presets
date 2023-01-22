import { resolve } from 'path'
import { describe, expect, test } from 'vitest'
import type { ImagePreset } from 'vite-plugin-image-presets'
import ImagePresetsPlugin, { formatPreset, widthPreset } from 'vite-plugin-image-presets'

async function getResolvedImage (preset: ImagePreset) {
  const plugin = ImagePresetsPlugin({ default: preset })
  await plugin.configResolved({
    base: '',
    command: 'serve',
    root: resolve(__dirname, 'assets'),
    build: { assetsDir: '' } as any,
  } as any)

  return plugin.api.resolveImage('white.png', { preset: 'default' })
}

describe('dimensions', () => {
  test('original width and height', async () => {
    const resolved = await getResolvedImage(formatPreset({
      dimensions: true,
      formats: {
        webp: { quality: 70 },
        original: {},
      },
    }))
    expect(resolved[1]).toHaveProperty('width', 5)
    expect(resolved[1]).toHaveProperty('height', 3)
  })

  test('scaled width and height', async () => {
    const resolved = await getResolvedImage(widthPreset({
      dimensions: true,
      widths: [4, 2],
      formats: {
        webp: { quality: 70 },
      },
    }))
    expect(resolved[0]).toHaveProperty('width', 2)
    expect(resolved[0]).toHaveProperty('height', 1)
  })

  test('overriden by attrs', async () => {
    const resolved = await getResolvedImage(formatPreset({
      dimensions: true,
      height: 20,
      formats: {
        original: {},
      },
    }))
    expect(resolved[0]).toHaveProperty('width', 5)
    expect(resolved[0]).toHaveProperty('height', 20)
  })

  test('dimensions = false', async () => {
    const resolved = await getResolvedImage(formatPreset({
      dimensions: false,
      formats: {
        original: {},
      },
    }))
    expect(resolved[0]).not.toHaveProperty('width')
    expect(resolved[0]).not.toHaveProperty('height')
  })

  test('dimensions undefined', async () => {
    const resolved = await getResolvedImage(formatPreset({
      formats: {
        original: {},
      },
    }))
    expect(resolved[0]).not.toHaveProperty('width')
    expect(resolved[0]).not.toHaveProperty('height')
  })
})
