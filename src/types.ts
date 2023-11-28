import type {
  AvifOptions,
  GifOptions,
  HeifOptions,
  JpegOptions,
  PngOptions,
  Sharp,
  TiffOptions,
  WebpOptions,
} from 'sharp'
import type { createImageApi } from './api'

export type ImageApi = ReturnType<typeof createImageApi>

export type Image = Sharp
export interface ImageFormatOptions {
  avif: AvifOptions
  gif: GifOptions
  heif: HeifOptions
  jpeg: JpegOptions
  jpg: JpegOptions
  png: PngOptions
  tiff: TiffOptions
  tif: TiffOptions
  webp: WebpOptions
}
export type ImageFormats = Partial<ImageFormatOptions>
export type ImageFormat = keyof ImageFormatOptions

export interface ImageAttrsAddons {
  class?: string
  placeholder?: string
}

export type ImageAttrs = Partial<HTMLImageElement> & ImageAttrsAddons

export type ImageGeneratorArgs = Record<string, any>
export type ImageGenerator = (image: Image, args: ImageGeneratorArgs) => Image | Promise<Image>
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
  generateBlurryPlaceholder?: boolean
  inferDimensions?: boolean
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
  /**
   * Whether to remove cached files that are no longer used.
   * @default true
   */
  purgeCache?: boolean
  /**
   * Whether to write generated images in the bundle.
   * @default true
   */
  writeToBundle?: boolean
}

export interface Config extends Required<Options> {
  isBuild: boolean
  base: string
  root: string
}
