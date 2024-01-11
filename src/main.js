import './assets/main.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */

import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */

library.add(fas) // Solid
library.add(far) // Regular
library.add(fab) // Brands

import { createApp } from 'vue'

// add plugins
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

//add router and store
import App from './App.vue'
import router from './router'
import store from './stores/index.js'
import { QuillEditor } from '@vueup/vue-quill'
import VueCookies from 'vue3-cookies'

//add Vuetify

import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import * as components from 'vuetify/components'

import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

const vuetify = createVuetify({
    components,
    directives,
})
const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store)
app.use(VueCookies)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-center',
})
app.use(vuetify)
app.use(PerfectScrollbar)

app.mount('#app')
