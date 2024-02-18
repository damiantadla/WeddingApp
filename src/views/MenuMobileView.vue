<script setup>
import { useStore } from 'vuex'
import router from '@/router'

import TitleComponent from '@/components/TitleComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
const emit = defineEmits(['clickBack'])
const emitClickBack = () => emit('clickBack')

const store = useStore()

const logout = async () => {
    await store.dispatch('logout')
    router.push('/')
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
        class="h-[1000px] w-screen md:w-[400px] top-0 right-0 flex flex-col justify-center bg-blackGrey pt-4"
    >
        <IconComponent />
        <div class="flex justify-between">
            <TitleComponent
                class="pt-10 pb-5 text-4xl px-10 text-center"
                text="Menu"
            />
            <font-awesome-icon
                @click="emitClickBack"
                :icon="['fas', 'xmark']"
                class="text-white text-6xl pt-8 pr-8"
            />
        </div>

        <ul class="cursor-pointer py-4 text-xl text-white">
            <li class="w-full py-4">
                <router-link
                    class="flex justify-center items-center"
                    :to="{ name: 'GuestListView' }"
                >
                    <p class="w-80 bg-white bg-opacity-10 p-4 rounded-l-xl">
                        Guest List
                    </p>
                    <div class="bg-white bg-opacity-20 p-4 rounded-r-xl">
                        <font-awesome-icon
                            :icon="['fas', 'angle-right']"
                            class=""
                        />
                    </div>
                </router-link>
            </li>
            <li class="w-full py-4">
                <router-link
                    class="flex justify-center items-center"
                    :to="{ name: 'InspirationsView' }"
                >
                    <p class="w-80 bg-white bg-opacity-10 p-4 rounded-l-xl">
                        Inspiration
                    </p>
                    <div class="bg-white bg-opacity-20 p-4 rounded-r-xl">
                        <font-awesome-icon
                            :icon="['fas', 'angle-right']"
                            class=""
                        />
                    </div>
                </router-link>
            </li>
            <li class="w-full py-4">
                <router-link
                    class="flex justify-center items-center"
                    :to="{ name: 'NotesView' }"
                >
                    <p class="w-80 bg-white bg-opacity-10 p-4 rounded-l-xl">
                        Notes
                    </p>
                    <div class="bg-white bg-opacity-20 p-4 rounded-r-xl">
                        <font-awesome-icon
                            :icon="['fas', 'angle-right']"
                            class=""
                        />
                    </div>
                </router-link>
            </li>
            <li class="w-full py-4">
                <router-link
                    class="flex justify-center items-center"
                    :to="{ name: 'PlannerView' }"
                >
                    <p class="w-80 bg-white bg-opacity-10 p-4 rounded-l-xl">
                        Planner
                    </p>
                    <div class="bg-white bg-opacity-20 p-4 rounded-r-xl">
                        <font-awesome-icon
                            :icon="['fas', 'angle-right']"
                            class=""
                        />
                    </div>
                </router-link>
            </li>
            <li class="w-full py-4">
                <router-link
                    class="flex justify-center items-center"
                    :to="{ name: 'SongListView' }"
                >
                    <p class="w-80 bg-white bg-opacity-10 p-4 rounded-l-xl">
                        Song list
                    </p>
                    <div class="bg-white bg-opacity-20 p-4 rounded-r-xl">
                        <font-awesome-icon
                            :icon="['fas', 'angle-right']"
                            class=""
                        />
                    </div>
                </router-link>
            </li>
        </ul>
        <div
            @click="logout"
            class="flex text-white text-3xl ml-auto px-4 py-2 cursor-pointer bg-white bg-opacity-10 rounded-xl mr-10"
        >
            <TitleComponent text="Logout" class="text-2xl" />
            <font-awesome-icon
                class="pl-5 text-3xl"
                :icon="['fas', 'right-from-bracket']"
            />
        </div>
        <div class="flex cursor-pointer ml-10 mt-6 mb-5">
            <router-link
                :to="{ name: 'EditUserView' }"
                class="flex text-white cursor-pointer bg-white bg-opacity-10 rounded-xl px-4 py-2"
            >
                <TitleComponent text="User" />
                <font-awesome-icon
                    :icon="['fas', 'pen-to-square']"
                    class="text-3xl pl-4"
                />
            </router-link>
        </div>
        <div class="px-10">
            <p v-if="name">Name: {{ name }}</p>
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

        <p class="text-center text-base mt-10 mb-4">
            Created by damiantadla@gmail.com
        </p>
    </div>
</template>
