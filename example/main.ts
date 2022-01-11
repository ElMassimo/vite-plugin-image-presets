import { createApp } from 'vue'

import App from './App.vue'
import Image from './Image.vue'

const app = createApp(App)
app.component('Image', Image)

app.mount('#app', true)
