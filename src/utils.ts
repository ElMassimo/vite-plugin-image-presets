import { createHash } from 'crypto'
import { promises as fs, constants as fsConstants } from 'fs'
import sharp from 'sharp'
import type { Image, ImageFormat } from './types'

export function loadImage (url: string) {
  return sharp(decodeURIComponent(parseURL(url).pathname))
}

function parseURL (rawURL: string) {
  return new URL(rawURL.replace(/#/g, '%23'), 'file://')
}

export function generateImageID (url: string, args: any) {
  return createHash('sha256').update(url).update(JSON.stringify(args)).digest('hex').slice(0, 8)
    + (args.format && args.format !== 'original' ? `.${args.format}` : '')
}

export function getAssetHash (content: string | Buffer) {
  return createHash('sha256').update(content).digest('hex').slice(0, 8)
}

export async function exists (path: string) {
  return await fs.access(path, fsConstants.F_OK).then(() => true, () => false)
}

export async function formatFor (image: Image): Promise<ImageFormat> {
  let format = (image as any).options?.formatOut
  if (format === 'input')
    format = (await image.metadata()).format

  if (!format) {
    console.error('Could not infer image format for', image)
    throw new Error('Could not infer image format')
  }
  if (format === 'heif') return 'avif'
  return format
}

export function mimeTypeFor (format: ImageFormat | 'original') {
  if (format === 'original') return undefined
  if (format === 'jpg') format = 'jpeg'
  return `image/${format}`
}

// Internal: Removes any keys with undefined or null values from the object.
export function cleanObject<T extends Record<string, any>> (object: T): T {
  Object.keys(object).forEach((key) => {
    const value = object[key]
    if (value === undefined || value === null) delete object[key]
    else if (isObject(value)) cleanObject(value)
  })
  return object
}

// Internal: Returns true if the specified value is a plain JS object
export function isObject (value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function last <T> (arr: T[]) {
  return arr[arr.length - 1]
}

// Internal: Returns the last URL in a srcset.
export function extractSrc (srcset: undefined | string) {
  return srcset ? last(srcset.split(', ')).split(' ')[0] : ''
}
