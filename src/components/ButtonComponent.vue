<template>
    <button class="bg-white text-black text-lg rounded-lg p-3">
        {{ text }}
        <font-awesome-icon v-if="icon" :icon="`fa-brands ${icon}`" />
    </button>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps(['text', 'icon'])
</script>
