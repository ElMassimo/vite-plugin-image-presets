import type { ResizeOptions } from 'sharp'
import type { ImageAttrs, ImageFormat, ImageFormats, ImagePreset } from './types'
import { mimeTypeFor } from './utils'

interface WidthPresetOptions extends ImageAttrs, Omit<ResizeOptions, 'width'> {
  widths: number[]
  formats: ImageFormats
}

export { mimeTypeFor }

export function widthPreset ({ widths, formats, ...attrs }: WidthPresetOptions): ImagePreset {
  return {
    attrs,
    images: Object.entries(formats)
      .map(([format, formatOptions]) => ({
        type: mimeTypeFor(format as ImageFormat),
        srcset: widths.map(width => ({
          condition: `${width}w`,
          args: { format, width, formatOptions },
          generate: (image, { format, formatOptions, width }) =>
            image.toFormat(format, formatOptions)
              .resize({ width, withoutEnlargement: true, ...attrs }),
        })),
      })),
  }
}

interface DensityPresetOptions extends ImageAttrs {
  density: number[]
  baseHeight?: number
  baseWidth?: number
  formats: ImageFormats
}

function multiply (quantity: number, n?: number | undefined) {
  return n ? quantity * n : undefined
}

export function densityPreset ({ baseWidth, baseHeight, density, formats, ...attrs }: DensityPresetOptions): ImagePreset {
  return {
    attrs,
    images: Object.entries(formats)
      .map(([format, formatOptions]) => ({
        type: mimeTypeFor(format as ImageFormat),
        srcset: density.map(density => ({
          condition: `${density}x`,
          args: { format, density, baseWidth, baseHeight, formatOptions },
          generate: (image, { format, formatOptions, baseWidth, baseHeight, width }) =>
            image.toFormat(format, formatOptions)
              .resize({
                width: multiply(density, baseWidth),
                height: multiply(density, baseHeight),
                withoutEnlargement: true,
                ...attrs,
              }),
        })),
      })),
  }
}
