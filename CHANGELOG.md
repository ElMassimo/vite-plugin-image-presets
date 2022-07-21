## [0.3.2](https://github.com/ElMassimo/vite-plugin-image-presets/compare/v0.3.1...v0.3.2) (2022-07-21)


### Bug Fixes

* escape srcset ([#8](https://github.com/ElMassimo/vite-plugin-image-presets/issues/8)) ([3b2ac77](https://github.com/ElMassimo/vite-plugin-image-presets/commit/3b2ac773ba4a23ced47d7d07757b932b9bdb738f))


### Features

* loosen deps to allow more recent versions of dependencies ([3e3e94a](https://github.com/ElMassimo/vite-plugin-image-presets/commit/3e3e94a58c9b1b06c2ba14806f028d12f518269f))



## [0.3.1](https://github.com/ElMassimo/vite-plugin-image-presets/compare/v0.3.0...v0.3.1) (2022-01-16)


### Bug Fixes

* ensure src is deterministic, always take the last ([6579611](https://github.com/ElMassimo/vite-plugin-image-presets/commit/65796117cd67f82241f7741343f8d21894fcb29b))
* pass additional parameters as args to the generate fn ([053da5d](https://github.com/ElMassimo/vite-plugin-image-presets/commit/053da5dffbbaaf585adda954140a8466f9b23638))



# [0.3.0](https://github.com/ElMassimo/vite-plugin-image-presets/compare/v0.2.0...v0.3.0) (2022-01-14)


### Bug Fixes

* handle unexpected errors without crashing the vite server ([e174936](https://github.com/ElMassimo/vite-plugin-image-presets/commit/e1749363dbb4b5a984e48815f35ee5043f582f30))
* remove undefined and null attrs ([e3cf8e7](https://github.com/ElMassimo/vite-plugin-image-presets/commit/e3cf8e71fbd431e84e6dc008f8e6bb8ca293b888))


### Features

* add `src` query param support and allow `srcset` to specify an index ([53396c6](https://github.com/ElMassimo/vite-plugin-image-presets/commit/53396c611dccdfe94e686da7b35c229fbec15022))
* add `srcset` param for direct usage (close [#2](https://github.com/ElMassimo/vite-plugin-image-presets/issues/2)) ([7660af4](https://github.com/ElMassimo/vite-plugin-image-presets/commit/7660af402596e96b0679996b8831c7087a1a4106))



# [0.2.0](https://github.com/ElMassimo/vite-plugin-image-presets/compare/v0.1.1...v0.2.0) (2022-01-12)


### Bug Fixes

* use the .avif file extension ([5c35a2e](https://github.com/ElMassimo/vite-plugin-image-presets/commit/5c35a2ec219f3f80efa2c542a89434f37a81fc43))


### Features

* add `hdPreset` based on the Jake Archibald article ([a02129a](https://github.com/ElMassimo/vite-plugin-image-presets/commit/a02129a0ac9de6a674b7d9258ae3593d1e1ac7f5))
* add densityPreset that uses density condition descriptors ([9aa98a1](https://github.com/ElMassimo/vite-plugin-image-presets/commit/9aa98a17a66cc67153092ea739725c5cfcf80525))
* add loading="lazy" by default to all presets ([24bf381](https://github.com/ElMassimo/vite-plugin-image-presets/commit/24bf3817907bd7753880038b5b06ed4bbd4413eb))
* allow async `generate` functions to support reading metadata ([ad48252](https://github.com/ElMassimo/vite-plugin-image-presets/commit/ad482526e777c290d3c3a36b765a7fb95a02d68c))
* **api:** add `writeImages` and `purgeCache` ([1c831d3](https://github.com/ElMassimo/vite-plugin-image-presets/commit/1c831d366a297dbbb411215e4036918cda161f57))
* clean cached images that are no longer used ([d0879b3](https://github.com/ElMassimo/vite-plugin-image-presets/commit/d0879b300f7f8daab561d1cf6edf2262a0816862))
* strongly typed options for format options ([7db1e03](https://github.com/ElMassimo/vite-plugin-image-presets/commit/7db1e03703dd20cf45583718ff80e5f84e7842a5))
* support 'original' format and widths in presets ([822ffb1](https://github.com/ElMassimo/vite-plugin-image-presets/commit/822ffb1a8ae30b8a9f072c21119e6d6c3d807bdf))



## [0.1.1](https://github.com/ElMassimo/vite-plugin-image-presets/compare/v0.1.0...v0.1.1) (2022-01-11)



# 0.1.0

Initial Version, with `widthPreset`.
