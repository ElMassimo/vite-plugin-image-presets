import { createApp } from 'vue'

import App from './App.vue'
import Image from './Image.vue'
import ExternalLink from './ExternalLink.vue'
import Caption from './Caption.vue'

const app = createApp(App)
app.component('Image', Image)
app.component('ExternalLink', ExternalLink)
app.component('Caption', Caption)

app.mount('#app', true)
