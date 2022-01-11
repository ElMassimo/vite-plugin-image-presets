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
}

export function getAssetHash (content: string | Buffer) {
  return createHash('sha256').update(content).digest('hex').slice(0, 8)
}

export async function exists (path: string) {
  return await fs.access(path, fsConstants.F_OK).then(() => true, () => false)
}

export function formatFor (image: Image): ImageFormat {
  const format = (image as any).options?.formatOut
  if (!format) {
    console.error('Could not infer image format for', image)
    throw new Error('Could not infer image format')
  }
  return format
}

export function mimeTypeFor (format: ImageFormat) {
  if (format === 'jpg') format = 'jpeg'
  return `image/${format}`
}

export function groupBy<T> (items: T[], key: keyof T): Record<string, T[]> {
  const result: Record<string, T[]> = {}
  items.forEach(item => (result[item[key] as any] ||= []).push(item))
  return result
}