<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

async function logout() {
    await store.dispatch('logout')
    router.push('/')
}
</script>
<template>
    <button @click="logout" class="">
        <font-awesome-icon
            class="text-3xl"
            :icon="['fas', 'right-from-bracket']"
        />
    </button>
</template>