<h2 align='center'>
  <a href="https://image-presets.netlify.app/">
    <img src="https://github.com/ElMassimo/vite-plugin-image-presets/blob/main/example/images/logo.svg" width="100px"/>
  </a>
  <br>
  <samp>vite-plugin-image-presets</samp>
</h2>

<p align='center'>Image Presets for Vite.js apps</p>

<p align='center'>
  <a href='https://www.npmjs.com/package/vite-plugin-image-presets'>
    <img src='https://img.shields.io/npm/v/vite-plugin-image-presets?color=222&style=flat-square'>
  </a>
  <a href='https://github.com/ElMassimo/vite-plugin-image-presets/blob/main/LICENSE.txt'>
    <img src='https://img.shields.io/badge/license-MIT-blue.svg'>
  </a>
</p>

<br>

[Vite]: https://vitejs.dev/
[Sharp]: https://sharp.pixelplumbing.com/
[îles]: https://iles-docs.netlify.app/
[example]: https://github.com/ElMassimo/vite-plugin-image-presets/blob/main/example/App.vue#L10
[live]: https://image-presets.netlify.app/

This [Vite] plugin allows you to define presets for image processing using [Sharp],
allowing you to optimize, resize, and process images consistently and with ease.

[__Demo__ 🖼][live]

## Installation 💿

```bash
npm install -D vite-plugin-image-presets # pnpm, yarn
```

## Configuration ⚙️

Add it to your plugins in `vite.config.ts`

```ts
import { defineConfig } from 'vite'
import imagePresets, { widthPreset } from 'vite-plugin-image-presets' 

export default defineConfig({
  plugins: [
    imagePresets({
      thumbnail: widthPreset({
        class: 'img thumb',
        loading: 'lazy',
        widths: [48, 96],
        formats: {
          webp: { quality: 50 },
          jpg: { quality: 70 },
        },
      }),
    }),
  ],
})
```

### Usage 🚀

Use the `preset` query parameter to obtain an array of `source` and `img` attrs:

```js
import thumbnails from '~/images/logo.jpg?preset=thumbnail'

expect(thumbnails).toEqual([
  {
    type: 'image/webp',
    srcset: '/assets/logo.ffc730c4.webp 48w, /assets/logo.1f874174.webp 96w',
  },
  {
    type: 'image/jpeg',
    srcset: '/assets/logo.063759b1.jpeg 48w, /assets/logo.81d93491.jpeg 96w',
    src: '/assets/logo.81d93491.jpeg',
    class: 'img thumb',
    loading: 'lazy',
  },
])
```

You can also use the `src` and `srcset` query parameters for direct usage:

```js
import srcset from '~/images/logo.jpg?preset=thumbnail&srcset'

expect(srcset).toEqual('/assets/logo.063759b1.jpeg 48w, /assets/logo.81d93491.jpeg 96w')


import src from '~/images/logo.jpg?preset=thumbnail&src'

expect(src).toEqual('/assets/logo.81d93491.jpeg')
```

Check the [example] for additional usage information and different preset examples, or [see it live][live].

## Documentation 📖

Additional usage documentation coming soon.

In the meantime, check the [`@islands/images`](https://github.com/ElMassimo/iles/tree/main/packages/images) module for [îles].

## Acknowledgements

- [sharp][sharp]: High performance Node.js image processing
- [vite-imagetools](https://github.com/JonasKruckenberg/imagetools/tree/main/packages/vite): The middleware used in development is based on this nice library.

The `hdPreset` is based on the following article by Jake Archibald:

- [Halve the size of images by optimising for high density displays](https://jakearchibald.com/2021/serving-sharp-images-to-high-density-screens/)

## License

This library is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
