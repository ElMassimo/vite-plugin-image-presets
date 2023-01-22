import { resolve } from 'path'
import { describe, expect, test } from 'vitest'
import ImagePresetsPlugin, { formatPreset } from 'vite-plugin-image-presets'

async function getResolvedImage (dimensions: boolean | undefined, attrs: {}) {
  const preset = formatPreset({
    dimensions,
    ...attrs,
    formats: {
      webp: { quality: 70 },
      original: {},
    },
  })

  const plugin = ImagePresetsPlugin({ default: preset })
  await plugin.configResolved({
    base: '',
    command: 'serve',
    root: '',
    build: { assetsDir: '' } as any,
  } as any)

  return plugin.api.resolveImage(resolve(__dirname, 'assets/white.png'), { preset: 'default' })
}

describe('dimensions', () => {
  test('width and height', async () => {
    const resolved = await getResolvedImage(true, {})
    expect(resolved[1]).toHaveProperty('width', 5)
    expect(resolved[1]).toHaveProperty('height', 3)
  })

  test('overriden by attrs', async () => {
    const resolved = await getResolvedImage(true, { height: 20 })
    expect(resolved[1]).toHaveProperty('width', 5)
    expect(resolved[1]).toHaveProperty('height', 20)
  })

  test('dimensions = false', async () => {
    const resolved = await getResolvedImage(false, {})
    expect(resolved[1]).not.toHaveProperty('width')
    expect(resolved[1]).not.toHaveProperty('height')
  })

  test('dimensions undefined', async () => {
    const resolved = await getResolvedImage(undefined, {})
    expect(resolved[1]).not.toHaveProperty('width')
    expect(resolved[1]).not.toHaveProperty('height')
  })
})
