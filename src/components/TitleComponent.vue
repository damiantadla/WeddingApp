<template>
    <h1 class="font-extrabold text-2xl text-white">{{ text }}</h1>
</template>

<script setup>
import { defineProps } from 'vue'

const { text } = defineProps(['text'])
</script>
