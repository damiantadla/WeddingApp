<script setup>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useCookies } from 'vue3-cookies'
import { RouterView } from 'vue-router'
import { toast } from 'vue3-toastify'

import IconComponent from '@/components/IconComponent.vue'

const store = useStore()
const { cookies } = useCookies()

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
    <IconComponent class="pt-20" />
    <RouterView />
</template>
