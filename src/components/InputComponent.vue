<template>
    <div class="relative w-80 my-2">
        <input
            class="placeholder-gray-400 text-black text-lg relative w-full rounded-lg p-3"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            @input="handleInput"
        />
        <font-awesome-icon
            v-if="icon"
            class="text-gray-400 text-lg absolute top-1/2 right-3 transform -translate-y-1/2"
            :icon="icon"
        />
    </div>
</template>
<script setup>
const props = defineProps(['icon', 'type', 'placeholder', 'modelValue'])
const emits = defineEmits(['update:modelValue'])

const handleInput = (event) => {
    emits('update:modelValue', event.target.value)
}
</script>
