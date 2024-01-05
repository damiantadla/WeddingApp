<script setup>
import { onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import { useCookies } from 'vue3-cookies'
import { RouterView } from 'vue-router'
import { toast } from 'vue3-toastify'

import IconComponent from '@/components/IconComponent.vue'
import { storage } from './firebase'
import {
    ref as storageRef,
    getDownloadURL,
    uploadBytes,
} from 'firebase/storage'

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

const handleClick = () => {
    if (img !== null) {
        const imgRef = ref(imageDb, `files/${v4()}`)
        uploadBytes(imgRef, img).then((value) => {
            console.log(value)
            getDownloadURL(value.ref).then((url) => {
                setImgUrl((data) => [...data, url])
            })
        })
    }
}

const foo = async () => {
    // console.log(selectedFile.value.size)
    await store.dispatch('uploadFile', {
        file: selectedFile.value,
    })
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        selectedFile.value = file
    }
}

const showInfo = () => {
    console.log(store.state)
}
</script>

<template>
    <IconComponent class="pt-20" />
    <RouterView />
</template>
