<template>
    <p class="text-gray-400 text-base">
        {{ text }} <span class="font-extrabold text-white">{{ textBold }}</span>
    </p>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps(['text', 'textBold'])
</script>
