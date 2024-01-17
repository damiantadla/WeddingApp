<script setup>
import { useRouter } from 'vue-router'

import HeartComponent from '@/components/HeartComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'

const router = useRouter()
</script>
<template>
    <TitleComponent text="Page 404" class="text-center mt-10 text-6xl" />
    <img src="../assets/404.svg" alt="Image404" class="mt-8" />
    <TitleComponent text="Not Found" class="text-center mt" />
    <HeartComponent />
    <GoBackComponent @click="router.back()" />
</template>
