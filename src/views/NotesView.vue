<template>
    <div>
        <TitleComponent
            v-if="!visibleEditor"
            text="Notes"
            class="text-center mt-10"
        />
        <font-awesome-icon
            @click="goToBack"
            class="fixed bottom-10 pl-8 text-white text-6xl cursor-pointer"
            :icon="['fas', 'circle-left']"
        />
        <font-awesome-icon
            @click="showTextEditor"
            class="fixed bottom-10 right-10 text-red text-7xl cursor-pointer"
            :icon="['fas', 'circle-plus']"
        />
    </div>
    <div class="absolute top-0">
        <div v-if="visibleEditor" class="bg-blackGrey">
            <div class="flex pt-8 pl-8"><IconComponent /></div>

            <EditorComponent class="" />
            <font-awesome-icon
                @click="showTextEditor"
                class="fixed bottom-10 pl-8 text-white text-6xl cursor-pointer"
                :icon="['fas', 'circle-left']"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import EditorComponent from '@/components/EditorComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const visibleEditor = ref(false)

const goToBack = () => {
    router.replace('/user')
}

const showTextEditor = () => {
    visibleEditor.value = !visibleEditor.value
    console.log(visibleEditor.value)
}
</script>
