import { promises as fs } from 'fs'
import type { Plugin } from 'vite'
import { join, resolve } from 'pathe'
import serialize from '@nuxt/devalue'

import type { Config, Options, ImageApi, ImagePresets } from './types'
import { formatFor } from './utils'
import { createImageApi, VIRTUAL_ID } from './api'

export * from './types'
export * from './presets'
export { formatFor } from './utils'

// Public: Vite Plugin to optimize, resize, and process images consistently and with ease.
export default function ImagePresetsPlugin (presets?: ImagePresets, options?: Options): Plugin & { api: ImageApi } {
  let api: ImageApi
  let config: Config

  return {
    name: 'image-presets',
    enforce: 'pre',
    get api () { return api },
    async configResolved ({ base, command, root, build: { outDir, assetsDir } }) {
      config = {
        presets: presets!,
        urlParam: 'preset',
        base,
        root,
        outDir: resolve(root, outDir),
        assetsDir,
        cacheDir: join(root, 'node_modules', '.images'),
        isBuild: command === 'build',
        ...options,
      }
      api = createImageApi(config)

      if (config.isBuild)
        await fs.mkdir(config.cacheDir, { recursive: true })
    },
    async load (id) {
      if (!id.includes(config.urlParam)) return

      const { path, query } = parseId(id)
      if (!query.preset) return

      const images = await api.resolveImage(path, query)
      return `export default ${serialize(images)}`
    },
    configureServer (server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith(VIRTUAL_ID)) {
          const [, id] = req.url.split(VIRTUAL_ID)

          const image = await api.getImageById(id)

          if (!image)
            throw new Error(`vite-image-presets cannot find image with id "${id}" this is likely an internal error`)

          res.setHeader('Content-Type', `image/${await formatFor(image)}`)
          res.setHeader('Cache-Control', 'max-age=360000')
          return image.clone()
            .on('error', err => console.error(err))
            .pipe(res)
        }

        next()
      })
    },
    async generateBundle (_, output) {
      const images = await api.waitForImages()
      images.forEach(asset => { output[asset.fileName] = asset })
    },
  }
}

function parseId (id: string) {
  const index = id.indexOf('?')
  if (index < 0) return { path: id, query: {} }

  // @ts-ignore
  const query = Object.fromEntries(new URLSearchParams(id.slice(index)))
  return { path: id.slice(0, index), query }
}
