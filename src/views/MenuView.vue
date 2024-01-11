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

const { name, number, email, surname, placeWedding, partnerWedding, dateWedding } = store.state.data
</script>

<template>
    <div class="top-0 right-0 flex flex-col bg-blackGrey min-h-screen w-screen md:w-80">
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
            class="flex flex-col justify-center items-start px-10 cursor-pointer py-4 text-3xl text-white"
        >
            <li class="w-full py-4">
                <router-link class="flex justify-between items-center" :to="{ name: 'NotesView' }"
                    >Notes
                    <font-awesome-icon :icon="['fas', 'angle-right']" />
                </router-link>
            </li>
            <li class="w-full py-4">
                <router-link
                    class="flex justify-between items-center"
                    :to="{ name: 'InspirationsView' }"
                    >Inspiration
                    <font-awesome-icon :icon="['fas', 'angle-right']" />
                </router-link>
            </li>
            <li class="flex justify-between items-center w-full py-4">
                <p>ToDo list</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
            <li class="flex justify-between items-center w-full py-4">
                <p>Song list</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
            <li class="flex justify-between items-center w-full py-4">
                <p>Guest list</p>
                <font-awesome-icon :icon="['fas', 'angle-right']" />
            </li>
        </ul>
        <div class="flex justify-between items-center w-full pt-8 pb-5 text-2xl px-10">
            <TitleComponent class="" text="User" />
            <router-link
                :to="{ name: 'EditUserView' }"
                class="flex flex-col text-white cursor-pointer"
            >
                <font-awesome-icon class="px-2" :icon="['fas', 'user-pen']" />
                <p>Edit</p>
            </router-link>
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
        <div @click="logout" class="flex text-white text-3xl ml-auto pr-10 pt-5 ` cursor-pointer">
            <TitleComponent text="Logout" class="text-3xl" />
            <font-awesome-icon
                class="pl-5 top-1/2 text-4xl"
                :icon="['fas', 'right-from-bracket']"
            />
        </div>
        <ParafComponent text="Created by damiantadla@gmail.com" class="text-center mt-20" />
    </div>
</template>
