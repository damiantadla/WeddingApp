<script setup>
import { ref, onMounted, onBeforeMount, reactive } from 'vue'
import EditorComponent from '@/components/EditorComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import InputComponent from '@/components/InputComponent.vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const visibleEditor = ref(false)
const searchTitle = ref('')

const goToBack = () => {
    router.replace('/user')
}

const showTextEditor = () => {
    visibleEditor.value = !visibleEditor.value
    console.log(visibleEditor.value)
}

const data = ref([])
const matchingItems = ref([])

const addDataFromEditor = (value) => {
    data.value.unshift(value)
}

onBeforeMount(async () => {
    const res = await store.dispatch('getDocs', {
        path: `users/${store.getters.id}/notes`,
    })
    matchingItems.value = res.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        }
    })
    data.value = matchingItems.value
})

let saveEvent
const search = (event) => {
    let checkArray = []
    if (saveEvent !== event.target.value) {
        checkArray = []
    }
    data.value.forEach((element) => {
        if (element.title.toLowerCase().includes(event.target.value.toLowerCase()))
            checkArray.push(element)
    })
    matchingItems.value = checkArray
    saveEvent = event.target.value
}
</script>
<template>
    <TitleComponent v-if="!visibleEditor" text="Notes" class="text-center mt-10" />
    <InputComponent
        placeholder="Search by title"
        class="m-auto"
        @input="search"
        v-model="searchTitle"
    />

    <ul class="p-8 text-xl flex flex-col items-center justify-center">
        <li
            v-for="item in matchingItems"
            :key="item.id"
            class="border-[2px] w-80 p-4 my-4 rounded-xl overflow-hidden whitespace-normal break-all"
        >
            <p>Title: {{ item.title }}</p>
            <span v-html="item.text"></span>
        </li>
    </ul>
    <div>
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

            <EditorComponent @sendData="addDataFromEditor" class="" />
            <font-awesome-icon
                @click="showTextEditor"
                class="fixed bottom-10 pl-8 text-white text-6xl cursor-pointer"
                :icon="['fas', 'circle-left']"
            />
        </div>
    </div>
</template>
