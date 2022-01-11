import type { ImageAttrs, ImageFormat, ImageFormats, ImagePreset } from './types'
import { mimeTypeFor } from './utils'

interface WidthPresetOptions extends ImageAttrs {
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
              .resize({ width, withoutEnlargement: true }),
        })),
      })),
  }
}
