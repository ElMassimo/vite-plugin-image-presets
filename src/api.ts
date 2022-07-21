import { promises as fs } from 'fs'
import type { OutputAsset } from 'rollup'

import { basename, extname, join, resolve } from 'pathe'
import createDebugger from 'debug'
import type { Config, Image, ImageAttrs, ImageGenerator, ImageGeneratorArgs } from './types'

import { exists, extractSrc, formatFor, generateImageID, getAssetHash, last, loadImage } from './utils'

const debug = {
  load: createDebugger('image-presets:load'),
  write: createDebugger('image-presets:write'),
  total: createDebugger('image-presets:total'),
  cache: createDebugger('image-presets:cache'),
}

export const VIRTUAL_ID = '/@imagepresets/'

export function createImageApi (config: Config) {
  // Used in dev and build to ensure images are loaded only once.
  const requestedImagesById: Record<string, Image | Promise<Image>> = {}

  // Used in build to optmimize file lookups and prevent duplicate processing.
  const generatedImages: Promise<OutputAsset>[] = []
  const imageHashesByFile: Record<string, Promise<string>> = {}
  const imageFilenamesById: Record<string, Promise<string>> = {}

  return {
    get config () {
      return config
    },
    async getImageById (id: string) {
      return await requestedImagesById[id]
    },
    async waitForImages () {
      debug.total('%i image(s)', generatedImages.length)
      return await Promise.all(generatedImages)
    },
    async writeImages (outDir: string) {
      debug.total('%i image(s)', generatedImages.length)
      const images = await Promise.all(generatedImages.map(async (imagePromise) => {
        const image = await imagePromise
        fs.writeFile(join(outDir, image.fileName), image.source)
        return image
      }))
      this.purgeCache(images)
    },
    async purgeCache (assets: OutputAsset[]) {
      if (!config.purgeCache)
        return

      const usedFiles = new Set(assets.map(asset => asset.name!))
      const cachedFiles = await fs.readdir(config.cacheDir)
      const unusedFiles = cachedFiles.filter(file => !usedFiles.has(file))
      debug.cache('%i unused files', unusedFiles.length)
      unusedFiles.forEach((file) => {
        fs.rm(resolve(config.cacheDir, file), { force: true })
      })
    },
    async resolveImage (filename: string, params: Record<string, any>): Promise<undefined | string | ImageAttrs[]> {
      const { [config.urlParam]: presetName, src, srcset, ...otherParams } = params
      const preset = config.presets[presetName]

      debug.load('%O %s', params, filename)

      if (!preset)
        throw new Error(`vite-image-presets: Unknown image preset '${presetName}'`)

      const imagesAttrs: ImageAttrs[] = await Promise.all(
        preset.images.map(async ({ srcset, ...source }) => ({
          ...source,
          srcset: (
            await Promise.all(
              srcset.map(async ({ condition, args, generate }) => [
                encodeURI(await getImageSrc(filename, { ...args, ...otherParams }, generate)),
                condition,
              ].filter(x => x).join(' ')),
            )
          ).join(', '),
        })),
      )

      // Allow direct usage in `img` and `source` src and srcset
      const lastImage = last(imagesAttrs)
      const lastSrc = extractSrc(lastImage.srcset)
      if (src !== undefined)
        return lastSrc

      if (srcset !== undefined) {
        const attrs = imagesAttrs[srcset === '' ? imagesAttrs.length - 1 : Number(srcset)]
        if (!attrs)
          throw new Error(`The '${presetName}' image preset did not provide any source matching the provided index: ${srcset}.\nURL: ${filename}?${new URLSearchParams(params)}`)
        return attrs.srcset
      }

      // Set the attrs for the img element.
      Object.assign(lastImage, preset.attrs)
      lastImage.src ||= lastSrc

      return imagesAttrs
    },
  }

  async function getImageHash (filename: string) {
    return await (imageHashesByFile[filename] ||= loadImage(filename).toBuffer().then(getAssetHash))
  }

  async function queueImageAndGetFilename (id: string, sourceFilename: string, image: Image) {
    const base = basename(sourceFilename, extname(sourceFilename))
    const hash = getAssetHash(id + await getImageHash(sourceFilename))
    const format = await formatFor(image)
    const filename = `${base}.${hash}.${format}`

    generatedImages.push(writeImageFile(filename, image))

    return join(config.assetsDir, filename)
  }

  async function writeImageFile (filename: string, image: Image): Promise<OutputAsset> {
    const { cacheDir, assetsDir } = config
    const cachedFilename = join(cacheDir, filename)

    if (!await exists(cachedFilename)) {
      debug.write('%s', cachedFilename)
      await image.toFile(cachedFilename)
    }

    return {
      fileName: join(assetsDir, filename),
      name: filename,
      source: await fs.readFile(cachedFilename) as any,
      isAsset: true,
      type: 'asset',
    }
  }

  async function getImageSrc (filename: string, args: ImageGeneratorArgs, generate: ImageGenerator) {
    filename = resolve(config.root, filename)
    const id = generateImageID(filename, args)

    requestedImagesById[id] ||= generate(loadImage(filename), args)

    if (config.isBuild) {
      const image = await requestedImagesById[id]
      imageFilenamesById[id] ||= queueImageAndGetFilename(id, filename, image)
      return config.base + await imageFilenamesById[id]
    }

    return VIRTUAL_ID + id
  }
}
