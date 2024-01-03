<script setup>
import { onBeforeMount, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

import MenuView from '@/views/MenuView.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'
import { toast } from 'vue3-toastify'

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
})

const updateData = () => {
    if (data.partnerWedding && data.placeWedding && data.dateWedding) {
        store.commit('updateData', data)
        store.dispatch('update', data)
        const days =
            new Date(store.state.data.dateWedding).getTime() -
            new Date().getTime()
        daysDifference.value = Math.round(days / (1000 * 60 * 60 * 24))
    } else {
        toast.error('Proszę podać więcej informacji')
    }
}
</script>

<template>
    <MenuView v-if="visibleMenu" @clickBack="showMenu" />
    <font-awesome-icon
        @click="showMenu"
        v-if="!visibleMenu"
        class="fixed top-8 right-8 text-5xl z-50 text-white"
        icon="fa-solid fa-bars"
    />
    <div v-if="!visibleMenu">
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
                src="../assets/img.jpg"
                alt="Description"
                class="object-cover rounded-full mt-8"
                style="width: 300px; height: 300px"
            />
            <p class="font-extrabold text-7xl text-red mt-2">
                {{ daysDifference }}
            </p>
            <TitleComponent text="Days" />
            <p class="text-center mt-2 px-20">{{ randomQuote }}</p>
        </div>
    </div>
</template>
