import type { ResizeOptions } from 'sharp'
import type { ImageAttrs, ImageGenerator, ImageFormat, ImageFormats, ImagePreset, ImageSource } from './types'
import { mimeTypeFor } from './utils'

type FormatOptions = ImageFormats & { original?: {} }

interface WidthPresetOptions extends ImageAttrs {
  density?: number
  widths: (number | 'original')[]
  formats: FormatOptions
  resizeOptions?: ResizeOptions
  withImage?: ImageGenerator
  media?: string
}

export { mimeTypeFor }

export function formatPreset (options: Omit<WidthPresetOptions, 'widths'>) {
  return widthPreset({ widths: ['original'], ...options })
}

export function hdPreset (options: WidthPresetOptions) {
  const highDensity = widthPreset({ density: 2, media: '(-webkit-min-device-pixel-ratio: 1.5)', ...options })
  const desktopWidth = Math.max(...options.widths as any) || 'original'
  const desktop = widthPreset({ ...options, widths: [desktopWidth] })
  return { attrs: desktop.attrs, images: highDensity.images.concat(desktop.images) }
}

export function widthPreset ({ density, widths, formats, resizeOptions, withImage, ...options }: WidthPresetOptions): ImagePreset {
  const [attrs, sourceAttrs] = extractSourceAttrs(options)
  return {
    attrs,
    images: Object.entries(formats)
      .map(([format, formatOptions]) => ({
        ...sourceAttrs,
        type: mimeTypeFor(format as ImageFormat),
        srcset: widths.map(width => ({
          condition: width === 'original' ? undefined : `${width}w`,
          args: { preset: 'width', format, width, density, formatOptions, resizeOptions },
          generate: async (image, args) => {
            if (format !== 'original')
              image = image.toFormat(format as ImageFormat, formatOptions)

            if (width !== 'original') {
              const hdWidth = density ? width * density : width
              image = image.resize({ width: hdWidth, withoutEnlargement: true, ...resizeOptions })
            }

            return await withImage?.(image, args) || image
          },
        })),
      })),
  }
}

interface DensityPresetOptions extends ImageAttrs {
  density: number[]
  baseHeight?: number
  baseWidth?: number
  formats: FormatOptions
  resizeOptions?: ResizeOptions
  withImage?: ImageGenerator
  media?: string
}

function multiply (quantity: number, n?: number | undefined) {
  return n ? quantity * n : undefined
}

export function densityPreset ({ baseWidth, baseHeight, density, formats, resizeOptions, withImage, ...options }: DensityPresetOptions): ImagePreset {
  const [attrs, sourceAttrs] = extractSourceAttrs(options)
  return {
    attrs,
    images: Object.entries(formats)
      .map(([format, formatOptions]) => ({
        ...sourceAttrs,
        type: mimeTypeFor(format as ImageFormat),
        srcset: density.map(density => ({
          condition: `${density}x`,
          args: { preset: 'density', format, density, baseWidth, baseHeight, formatOptions, resizeOptions },
          generate: async (image, args) => {
            if (format !== 'original')
              image = image.toFormat(format as ImageFormat, formatOptions)

            if (baseWidth || baseHeight) {
              image = image.resize({
                width: multiply(density, baseWidth),
                height: multiply(density, baseHeight),
                withoutEnlargement: true,
                ...resizeOptions,
              })
            }

            return await withImage?.(image, args) || image
          },
        })),
      })),
  }
}

export function extractSourceAttrs ({ media, sizes, ...attrs }: any): [ImageAttrs, Partial<ImageSource>] {
  const sourceAttrs: Partial<ImageSource> = {}
  if (media) sourceAttrs.media = media
  if (sizes) sourceAttrs.sizes = sizes
  return [{ loading: 'lazy', ...attrs }, sourceAttrs]
}
