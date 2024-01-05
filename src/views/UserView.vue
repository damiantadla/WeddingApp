<script setup>
import { onBeforeMount, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

import MenuView from '@/views/MenuView.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'

import { toast } from 'vue3-toastify'

import { storage } from '../firebase'
import {
    ref as storageRef,
    getDownloadURL,
    uploadBytes,
} from 'firebase/storage'

const store = useStore()
const router = useRouter()
const { cookies } = useCookies()

let randomQuote
const daysDifference = ref(0)

onBeforeMount(() => {
    if (!cookies.isKey('user')) {
        router.push('/')
    }
})

onBeforeMount(async () => {
    if (store.state.quote) {
        const quotations = store.state.quote
        const randomNumber = Math.floor(
            Math.random() * Object.keys(quotations).length + 1,
        )
        randomQuote = quotations[randomNumber]
    }

    if (store.state.data?.dateWedding) {
        const days =
            new Date(store.state.data.dateWedding).getTime() -
            new Date().getTime()
        daysDifference.value = Math.round(days / (1000 * 60 * 60 * 24))
    }
})

const visibleMenu = ref(false)

const showMenu = () => {
    !visibleMenu.value
        ? (visibleMenu.value = true)
        : (visibleMenu.value = false)
}

const data = reactive({
    partnerWedding: '',
    placeWedding: '',
    dateWedding: '',
    imgURL: '',
})

const imageFile = ref(null)
const loading = ref(false)

const handleFileChange = async (e) => {
    imageFile.value = e.target.files[0]
}
const updateData = async () => {
    if (imageFile.value) {
        loading.value = true
        console.log('rozpoczeto') // Rozpoczęcie ładowania

        // Utwórz referencję do pliku, używając metody child
        const imgRef = storageRef(storage, `${store.state.user.uid}/logo`)

        try {
            await uploadBytes(imgRef, imageFile.value)
            const url = await getDownloadURL(imgRef) // Użyj tej samej referencji

            data.imgURL = url
            console.log('Wykonało się')
            if (
                data.partnerWedding &&
                data.placeWedding &&
                data.dateWedding &&
                data.imgURL
            ) {
                console.log('kiedy sie wykona')
                store.commit('updateData', data)
                store.dispatch('update', data)
                console.log('po sie wykona')
                const days =
                    new Date(store.state.data.dateWedding).getTime() -
                    new Date().getTime()
                daysDifference.value = Math.round(days / (1000 * 60 * 60 * 24))
            } else {
                toast.error('Proszę podać więcej informacji')
            }
        } catch (error) {
            console.error('Błąd podczas przesyłania pliku:', error)
        } finally {
            loading.value = false
            console.log('zakoczono')
        }
    }
}
</script>

<template>
    <LoadingComponent v-if="loading" />

    <MenuView class="absolute z-30" v-if="visibleMenu" @clickBack="showMenu" />
    <font-awesome-icon
        @click="showMenu"
        v-if="!visibleMenu"
        class="fixed top-8 right-8 text-5xl z-50 text-white"
        icon="fa-solid fa-bars"
    />
    <div class="relative z-20">
        <div
            v-if="!store.state.data?.partnerWedding"
            class="w-full pt-20 flex flex-col justify-center items-center"
        >
            <InputComponent
                v-model="data.partnerWedding"
                icon="fa-user-group"
                placeholder="Your partner"
            />
            <InputComponent
                v-model="data.placeWedding"
                icon="fa-location-dot"
                placeholder="Wedding place"
            />
            <TitleComponent text="Wedding date" class="pt-8" />
            <InputComponent
                class="text-red-500 placeholder-red-500"
                v-model="data.dateWedding"
                type="date"
            />
            <TitleComponent text="Your photo" class="pt-8" />
            <input
                class="text-lg relative w-80 rounded-lg p-3"
                type="file"
                @change="handleFileChange"
            />
            <ButtonComponent
                text="Update"
                @click="updateData()"
                class="mt-10"
            />
        </div>
        <div
            v-else
            class="w-full pt-10 flex flex-col justify-center items-center text-white"
        >
            <TitleComponent text="Countdown to Wedding" />
            <p class="font-bold text-xl">
                {{ store.state.data.partnerWedding }}
                <font-awesome-icon class="text-red" :icon="['fas', 'heart']" />
                {{ store.state.data.name }}
            </p>

            <img
                :src="store.state.data.imgURL"
                alt="Description"
                class="object-cover rounded-full w-[300px] h-[300px] mt-8"
            />

            <p class="font-extrabold text-7xl text-red mt-5">
                {{ daysDifference }}
            </p>

            <div class="flex flex-row justify-center items-center mt-4">
                <div class="w-[40px] h-[1.5px] bg-gray-400"></div>
                <TitleComponent class="px-5" text="Days" />
                <div class="w-[40px] h-[1.5px] bg-gray-400"></div>
            </div>
            <p class="text-center mt-4 px-20">{{ randomQuote }}</p>
        </div>
    </div>
</template>
