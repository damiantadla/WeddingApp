<script setup>
import { useStore } from 'vuex'
import router from '@/router'

import TitleComponent from '@/components/TitleComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'

const emit = defineEmits(['clickBack'])
const emitClickBack = () => emit('clickBack')

const store = useStore()

const logout = async () => {
    await store.dispatch('logout')
    router.replace('/')
}

const {
    name,
    number,
    email,
    surname,
    placeWedding,
    partnerWedding,
    dateWedding,
} = store.state.data
</script>

<template>
    <div
        class="overflow-y-auto absolute top-0 flex flex-col bg-blackGrey w-screen h-screen"
    >
        <div class="flex justify-between">
            <IconComponent class="pt-6 pl-6" />
            <font-awesome-icon
                @click="emitClickBack"
                :icon="['fas', 'xmark']"
                class="text-white text-6xl pt-8 pr-8"
            />
        </div>
        <TitleComponent class="pt-10 pb-5 text-4xl px-10" text="Menu" />
        <ul
            class="flex flex-col justify-center items-start px-10 cursor-pointer"
        >
            <li
                class="flex justify-between items-center w-full py-4 text-2xl text-white"
            >
                <p>Notes</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
            <li
                class="flex justify-between items-center w-full py-4 text-2xl text-white"
            >
                <p>ToDo list</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
            <li
                class="flex justify-between items-center w-full py-4 text-2xl text-white"
            >
                <p>Song list</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
            <li
                class="flex justify-between items-center w-full py-4 text-2xl text-white"
            >
                <p>Guest list</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
        </ul>
        <div
            class="flex justify-between items-center w-full pt-8 pb-5 text-2xl px-10"
        >
            <TitleComponent class="" text="User" />
            <div class="flex flex-col text-white cursor-pointer">
                <font-awesome-icon class="px-2" :icon="['fas', 'user-pen']" />
                <p>Edit</p>
            </div>
        </div>
        <div class="px-10">
            <p v-if="name">Name: {{ name }} {{ surname }}</p>
            <p v-if="surname">E-mail: {{ email }}</p>
            <p v-if="number">Number: {{ number }}</p>
            <p v-if="dateWedding">
                Wedding date:
                {{
                    new Date(dateWedding).toLocaleDateString('pl-PL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                }}
            </p>
            <p v-if="placeWedding">Weeding place: {{ placeWedding }}</p>
            <p v-if="partnerWedding">Partner: {{ partnerWedding }}</p>
        </div>
        <div
            @click="logout"
            class="flex text-white text-3xl ml-auto pr-10 pt-5 ` cursor-pointer"
        >
            <TitleComponent text="Logout" class="text-3xl" />
            <font-awesome-icon
                class="pl-5 top-1/2 text-4xl"
                :icon="['fas', 'right-from-bracket']"
            />
        </div>
        <ParafComponent
            class="mt-8 text-center"
            text="Created by damiantadla@gmail.com"
        />
    </div>
</template>
