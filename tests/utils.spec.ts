import { describe, test, expect } from 'vitest'
import { extractSrc } from '@plugin/utils'

describe('utils', () => {
  test('extractSrc', async () => {
    const expectSrc = (srcset: string) => expect(extractSrc(srcset))

    expectSrc(undefined).toEqual('')
    expectSrc('').toEqual('')
    expectSrc('/assets/logo.662e9633.png 1x, /assets/logo.462f3932.png 1.5x, /assets/logo.d66e9cbc.png 2x')
      .toEqual('/assets/logo.d66e9cbc.png')
    expectSrc('/assets/panda.7ceb508b.jpeg 440w, /assets/panda.7fd71017.jpeg 700w')
      .toEqual('/assets/panda.7fd71017.jpeg')
    expectSrc('/assets/panda.67af4b79.jpeg 700w')
      .toEqual('/assets/panda.67af4b79.jpeg')
    expectSrc('/assets/vite-ruby.035710d0.png')
      .toEqual('/assets/vite-ruby.035710d0.png')
  })
})
