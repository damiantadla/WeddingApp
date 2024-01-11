<script setup>
import { ref, onMounted, onBeforeMount, reactive, computed } from 'vue'
import TitleComponent from '@/components/TitleComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

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
const loading = ref(true)

onBeforeMount(async () => {
    try {
        loading.value = true
        const res = await store.dispatch('getDocs', {
            path: `users/${store.getters.id}/notes`,
        })
        matchingItems.value = res.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            }
        })
    } finally {
        loading.value = false
    }
    data.value = matchingItems.value
})

const computedList = computed(() => {
    return data.value.filter((item) =>
        item.title.toLowerCase().includes(searchTitle.value.toLowerCase()),
    )
})

const isVisible = ref(false)

const toggleEdit = (itemID) => {
    isVisible.value = isVisible.value === itemID ? null : itemID
}

const deleteDoc = async (itemID) => {
    try {
        await store.dispatch('deleteDoc', {
            path: `users/${store.getters.id}/notes`,
            id: itemID,
        })
    } catch (error) {
        console.log(error.message)
    }
    data.value = data.value.filter((obj) => obj.id !== itemID)
}

const goToEditor = () => {
    router.push('notes/edit')
}
</script>
<template>
    <LoadingComponent v-if="loading" />
    <TitleComponent v-if="!visibleEditor" text="Notes" class="text-center text-4xl mt-10" />
    <InputComponent placeholder="Search by title" class="m-auto" v-model="searchTitle" />

    <ul class="p-8 text-white flex flex-col items-center justify-center">
        <li v-for="item in computedList" :key="item.id" class="border-2 w-80 my-4 rounded-lg">
            <div>
                <div class="relative flex flex-col h-[250px] border-b-2">
                    <div class="flex justify-between p-4">
                        <p class="text-2xl">{{ item.title }}</p>

                        <font-awesome-icon
                            @click="toggleEdit(item.id)"
                            :icon="['fas', 'pen-to-square']"
                            class="text-3xl"
                        />
                    </div>

                    <perfect-scrollbar class="px-4">
                        <p class="whitespace-normal" v-html="item.text"></p>
                    </perfect-scrollbar>

                    <div class="absolute w-full bottom-0 w-100 bg-red bg-opacity-90">
                        <transition name="slide-fade">
                            <div
                                v-if="isVisible === item.id"
                                class="flex justify-end items-center p-2 pr-4 text-right"
                            >
                                <p class="pr-2 item-center text-base">Created on {{ item.date }}</p>
                                <font-awesome-icon
                                    @click="deleteDoc(item.id)"
                                    :icon="['fas', 'circle-xmark']"
                                    class="text-4xl"
                                />
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </li>
    </ul>

    <div>
        <font-awesome-icon
            @click="goToBack"
            class="fixed bottom-0 left-0 p-4 text-white text-6xl cursor-pointer"
            :icon="['fas', 'circle-left']"
        />
        <font-awesome-icon
            @click="goToEditor"
            class="fixed bottom-0 right-0 p-4 text-red text-6xl cursor-pointer"
            :icon="['fas', 'circle-plus']"
        />
    </div>
    <div class="h-[40px]"></div>
</template>
<style>
.slide-fade-enter-active {
    transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
}
</style>
