<h2 align='center'><samp>vite-plugin-image-presets</samp></h2>

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

[vite_rails]: https://github.com/ElMassimo/vite_ruby/tree/main/vite_rails
[vite_ruby]: https://github.com/ElMassimo/vite_ruby/tree/main/vite_ruby
[globEager]: https://vitejs.dev/guide/features.html#glob-import
[jumpstart]: https://github.com/ElMassimo/jumpstart-vite
[stimulus handbook]: https://stimulus.hotwire.dev/handbook/installing
[stimulus]: https://github.com/hotwired/stimulus
[vite_rails]: https://vite-rails.netlify.app
[vite]: http://vitejs.dev/
[idempotent]: https://turbo.hotwire.dev/handbook/building#making-transformations-idempotent
[HMR]: https://vitejs.dev/guide/features.html#hot-module-replacement

This plugin for [Vite.js][vite] provides [HMR] for [Stimulus] controllers,
allowing you to tweak your code without having to wait for the page to refresh.

## Demo 🎥

Changes to Stimulus controllers don't require a full page refresh.

<a href="https://user-images.githubusercontent.com/1158253/107971586-6deb2480-6f91-11eb-8919-100ca36f3683.mp4" rel="noreferrer" target="_blank">
  <img width="836" alt="Screen Shot 2021-02-15 at 13 27 22" src="https://user-images.githubusercontent.com/1158253/107971695-8e1ae380-6f91-11eb-9ef7-9fed47d4d3be.png">
</a>

The modified controller will be re-registered, so existing instances of it will `disconnect`, and new instances will be created and `connect`ed with the updated code.

## Installation 💿

HMR comes installed by default in [Jumpstart Rails with Vite.js][jumpstart],
a starter template that you can use to start your next Rails app.

If installing manually:

```bash
npx ni vite-plugin-image-presets
```

## Usage 🚀

Add it to your plugins in `vite.config.js`

```ts
// vite.config.js
import StimulusHMR from 'vite-plugin-image-presets' 

export default {
  plugins: [
    StimulusHMR(),
  ],
};
```

You should now enjoy HMR for your Stimulus controllers! 🚀

## How does it work? 🤔

In order to simplify integration, the plugin will try to automatically detect when you define your Stimulus app, as in:

```js
const app = Application.start()
```

It will then detect any controller files using the Stimulus conventions, and inject an HMR `accept` call that re-registers the updated controller.

Just as when you use Turbolinks, it's important that your controllers are [idempotent].

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
