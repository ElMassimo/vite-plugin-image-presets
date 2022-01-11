import type { Sharp, FormatEnum } from 'sharp'
import { createImageApi } from './api'

export type ImageApi = ReturnType<typeof createImageApi>

export type Image = Sharp
export type ImageFormat = keyof FormatEnum
export type ImageFormats = { [k in ImageFormat]?: any }

export type ImageAttrs = Partial<HTMLImageElement> & { class?: string }
export type ImageResult = ImageAttrs[] & { src?: string }

export type ImageGeneratorArgs = Record<string, any>
export type ImageGenerator = (image: Sharp, args: ImageGeneratorArgs) => Sharp
export interface ImageSpec {
  /**
   * A condition descriptor that specifies when the image should be used.
   * Can be a width descriptor or a density descriptor.
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset
   */
  condition?: string
  /**
   * A function to generate the image.
   */
  generate: ImageGenerator
  /**
   * The parameters for the image generation function.
   */
  args: ImageGeneratorArgs
}
export interface ImageSource {
  type?: string
  media?: string
  sizes?: string
  srcset: ImageSpec[]
}

export interface ImagePreset {
  attrs?: ImageAttrs
  images: ImageSource[]
}
export type ImagePresets = Record<string, ImagePreset>

export interface Options {
  /**
   * The directory in which to place processed images, relative to Vite's `outDir`.
   * @default 'assets/images'
   */
  assetsDir?: string
  /**
   * The directory to use for caching images between builds.
   * @default 'node_modules/.images'
   */
  cacheDir?: string
  /**
   * Definitions of image presets to apply.
   */
  presets?: ImagePresets
  /**
   * URL parameter that specifies the image preset.
   * @default 'preset'
   */
  urlParam?: string
}

export interface Config extends Required<Options> {
  isBuild: boolean
  outDir: string
  base: string
  root: string
}
