import type { ResizeOptions } from 'sharp'
import type { ImageAttrs, ImageFormat, ImageFormats, ImagePreset } from './types'
import { mimeTypeFor } from './utils'

type FormatOptions = ImageFormats & { original?: {} }

interface WidthPresetOptions extends ImageAttrs {
  widths: (number | 'original')[]
  formats: FormatOptions
  resizeOptions?: ResizeOptions
}

export { mimeTypeFor }

export function formatPreset (options: Omit<WidthPresetOptions, 'widths'>) {
  return widthPreset({ widths: ['original'], ...options })
}

export function widthPreset ({ widths, formats, resizeOptions, ...attrs }: WidthPresetOptions): ImagePreset {
  return {
    attrs,
    images: Object.entries(formats)
      .map(([format, formatOptions]) => ({
        type: mimeTypeFor(format as ImageFormat),
        srcset: widths.map(width => ({
          condition: width === 'original' ? undefined : `${width}w`,
          args: { format, width, formatOptions, resizeOptions },
          generate: (image) => {
            if (format !== 'original')
              image = image.toFormat(format as ImageFormat, formatOptions)

            if (width !== 'original')
              image = image.resize({ width, withoutEnlargement: true, ...resizeOptions })

            return image
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
}

function multiply (quantity: number, n?: number | undefined) {
  return n ? quantity * n : undefined
}

export function densityPreset ({ baseWidth, baseHeight, density, formats, resizeOptions, ...attrs }: DensityPresetOptions): ImagePreset {
  return {
    attrs,
    images: Object.entries(formats)
      .map(([format, formatOptions]) => ({
        type: mimeTypeFor(format as ImageFormat),
        srcset: density.map(density => ({
          condition: `${density}x`,
          args: { format, density, baseWidth, baseHeight, formatOptions, resizeOptions },
          generate: (image) => {
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

            return image
          },
        })),
      })),
  }
}
