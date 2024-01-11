<script setup>
import { reactive, ref } from 'vue'

import { useRouter } from 'vue-router'

import TitleComponent from '@/components/TitleComponent.vue'

const router = useRouter()

const isVisible = ref(false)

const data = reactive({
    categories: [
        {
            name: 'Wedding Venue',
            visible: false,
            items: ['Inspiration1', 'Inspiration2', 'Insporation3'],
        },
        { name: 'Ceremony Venue', visible: false, items: ['Item 1', 'Item 2'] },
        { name: 'Wedding Dress', visible: false, items: ['Item 1', 'Item 2'] },
        { name: 'Decorations', visible: false, items: ['Item 1', 'Item 2'] },
        { name: 'Guest Gifts', visible: false, items: ['Item 1', 'Item 2'] },
        { name: 'Other', visible: false, items: ['Item 1', 'Item 2'] },
    ],
})
</script>
<template>
    <div class="flex flex-col p-8 justify-center items-center">
        <TitleComponent text="Inspirations" class="text-3xl mb-4" />
        <div
            class="my-4 w-full text-white"
            v-for="(category, index) in data.categories"
            :key="index"
        >
            <h3
                class="flex justify-between items-center w-full h-10 px-4 text-xl font-bold bg-glacier rounded-lg"
                @click="data.categories[index].visible = !data.categories[index].visible"
            >
                {{ category.name }}
                <font-awesome-icon
                    :icon="!category.visible ? ['fas', 'caret-down'] : ['fas', 'caret-up']"
                />
            </h3>

            <ul v-if="category.visible">
                <li v-for="(item, itemIndex) in category.items" :key="itemIndex">{{ item }}</li>
            </ul>
        </div>
    </div>
    <div>
        <font-awesome-icon
            @click="router.back"
            class="fixed bottom-0 left-0 p-4 text-white text-6xl cursor-pointer"
            :icon="['fas', 'circle-left']"
        />
        <font-awesome-icon
            @click="isVisible = !isVisible"
            class="fixed bottom-0 right-0 p-4 text-red text-6xl cursor-pointer"
            :icon="['fas', 'circle-plus']"
        />
    </div>
    <div class="h-[40px]"></div>
    <transition name="slide-fade">
        <div v-if="isVisible" class="fixed bottom-0 flex flex-col p-5 h-[200px] w-full bg-glacier">
            <div class="flex justify-between">
                <TitleComponent text="Select category" />
                <font-awesome-icon
                    @click="isVisible = !isVisible"
                    :icon="['fas', 'circle-xmark']"
                    class="text-4xl text-white"
                />
            </div>
            <TitleComponent text="Select category" class="text-lg" />
            <select name="pets" id="pet-select" class="max-w-[150px] text-black rounded-lg">
                <option v-for="category in data.categories" value="dog" selected>
                    {{ category.name }}
                </option>
            </select>
            <TitleComponent text="Select image" class="text-lg" />
            <input type="file" accept="image/*" />
        </div>
    </transition>
</template>
<style scoped>
input[type='file']::file-selector-button {
    background-color: #fff;
    border: none;
    border-radius: 0.5rem;
}
</style>
