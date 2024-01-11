<script setup>
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { useCookies } from 'vue3-cookies'
import { RouterView } from 'vue-router'
import { toast } from 'vue3-toastify'

import IconComponent from '@/components/IconComponent.vue'
import { storage } from './firebase'
import { ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage'

const store = useStore()
const { cookies } = useCookies()
const selectedFile = ref(null)

onBeforeMount(() => {
    if (!cookies.isKey('appInitailized')) {
        toast.info('This website uses cookies', {
            position: toast.POSITION.BOTTOM_CENTER,
            hideProgressBar: true,
            autoClose: 5000,
            theme: 'dark',
        })
        cookies.set('appInitailized', 'true')
    }
})
</script>

<template>
    <RouterView />
</template>
