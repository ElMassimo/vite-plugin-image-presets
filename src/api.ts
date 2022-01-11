
import { promises as fs } from 'fs'
import { basename, join, resolve, extname } from 'pathe'
import createDebugger from 'debug'
import type { Config, Image, ImageResult, ImageGenerator, ImageGeneratorArgs } from './types'

import { exists, generateImageID, formatFor, getAssetHash, loadImage } from './utils'

const debug = {
  load: createDebugger('image-presets:load'),
  write: createDebugger('image-presets:write'),
}

export const VIRTUAL_ID = '/@imagepresets/'

export function createImageApi (config: Config) {
  // Used in dev and build to ensure images are loaded only once.
  const requestedImagesById: Record<string, Image> = {}

  // Used in build to optmimize file lookups and prevent duplicate processing.
  const generatedImages: Promise<any>[] = []
  const imageHashesByFile: Record<string, Promise<string>> = {}
  const imageFilenamesById: Record<string, Promise<string>> = {}

  return {
    getImageById (id: string) {
      return requestedImagesById[id]
    },
    async waitForImages () {
      await Promise.all(generatedImages)
    },
    async resolveImage (filename: string, params: Record<string, any>): Promise<ImageResult> {
      const presetName = params[config.urlParam]
      const preset = config.presets[presetName]

      debug.load('%O %s', params, filename)

      if (!preset)
        throw new Error(`vite-image-presets: Unknown image preset '${presetName}'`)

      let lastSrc
      const imageResult: ImageResult = await Promise.all(
        preset.images.map(async ({ srcset, ...source }) => ({
          ...source,
          srcset: (
            await Promise.all(
              srcset.map(async ({ condition, args, generate }) => [
                lastSrc = await getImageSrc(filename, args, generate),
                condition,
              ].filter(x => x).join(' ')),
            )
          ).join(', '),
        })),
      )

      // Set the attrs for the img element.
      const lastImage = imageResult[imageResult.length - 1]
      Object.assign(lastImage, preset.attrs)
      lastImage.src ||= lastSrc

      return imageResult
    },
  }

  async function getImageHash (filename: string) {
    return await (imageHashesByFile[filename] ||= loadImage(filename).toBuffer().then(getAssetHash))
  }

  async function queueImageAndGetFilename (id: string, sourceFilename: string, image: Image) {
    const base = basename(sourceFilename, extname(sourceFilename))
    const hash = getAssetHash(id + await getImageHash(sourceFilename))
    const format = formatFor(image)
    const filename = `${base}.${hash}.${format}`

    generatedImages.push(writeImageFile(filename, image))

    return join(config.assetsDir, filename)
  }

  async function writeImageFile (filename: string, image: Image) {
    const { cacheDir, assetsDir, outDir } = config
    const cachedFilename = join(cacheDir, filename)
    const destFilename = join(outDir, assetsDir, filename)

    if (!await exists(cachedFilename)) {
      debug.write('%s', filename)
      await image.toFile(cachedFilename)
    }

    await fs.copyFile(cachedFilename, destFilename)
  }

  async function getImageSrc (filename: string, args: ImageGeneratorArgs, generate: ImageGenerator) {
    filename = resolve(config.root, filename)
    const id = generateImageID(filename, args)

    const image = requestedImagesById[id] ||= generate(loadImage(filename), args)

    if (config.isBuild) {
      imageFilenamesById[id] ||= queueImageAndGetFilename(id, filename, image)
      return config.base + await imageFilenamesById[id]
    }

    return VIRTUAL_ID + id
  }
}
