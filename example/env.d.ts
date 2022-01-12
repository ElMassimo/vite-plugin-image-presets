/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />

// images
declare module '*?preset=hd' {
  const src: import('vite-plugin-image-presets').ImageSource[]
  export default src
}

declare module '*?preset=full' {
  const src: import('vite-plugin-image-presets').ImageSource[]
  export default src
}

declare module '*?preset=round' {
  const src: import('vite-plugin-image-presets').ImageSource[]
  export default src
}

declare module '*?preset=thumbnail' {
  const src: import('vite-plugin-image-presets').ImageSource[]
  export default src
}
