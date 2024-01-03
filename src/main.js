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

import VueCookies from 'vue3-cookies'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(store)
app.use(VueCookies)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-center',
})

app.mount('#app')
