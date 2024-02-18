<script setup>
import { onBeforeMount, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

import MenuMobileView from '@/views/MenuMobileView.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'
import MenuView from '@/views/MenuView.vue'
import HeartComponent from '@/components/HeartComponent.vue'
import PlannerView from '@/views/PlannerView.vue'
import LineComponent from '@/components/LineComponent.vue'

import { toast } from 'vue3-toastify'

const store = useStore()
const router = useRouter()
const { cookies } = useCookies()

let randomQuote
const daysDifference = ref(null)

const changeDate = (date) => {
    const milliseconds = new Date(date).getTime() - new Date().getTime()
    const days = Math.round(milliseconds / (1000 * 60 * 60 * 24))
    if (days <= 0) return 'Congratulations'
    else return days
}

onBeforeMount(async () => {
    if (!cookies.isKey('user')) {
        router.push('/')
    }
    if (store.state.quote) {
        const quotations = store.state.quote
        const randomNumber = Math.floor(
            Math.random() * Object.keys(quotations).length + 1,
        )
        randomQuote = quotations[randomNumber]
    }

    if (store.getters.getData?.dateWedding) {
        daysDifference.value = changeDate(store.state.data.dateWedding)
    }
})

const visibleMenu = ref(false)
const loading = ref(false)
const imageFile = ref(null)
const data = reactive({
    partnerWedding: '',
    placeWedding: '',
    dateWedding: '',
    imgURL: '',
})
const showMenu = () => {
    visibleMenu.value = !visibleMenu.value
}
const handleFileChange = async (e) => {
    if (e.target.files[0]) {
        imageFile.value = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (e) => {
            data.imgURL = e.target.result
        }
        reader.readAsDataURL(e.target.files[0])
    }
}
const updateData = async () => {
    if (imageFile.value) {
        loading.value = true

        try {
            if (
                data.partnerWedding &&
                data.placeWedding &&
                data.dateWedding &&
                data.imgURL
            ) {
                await store.dispatch('uploadFileAndGetURLFile', {
                    imageFile: imageFile.value,
                    data,
                })
                daysDifference.value = changeDate(
                    store.getters.getData.dateWedding,
                )
            } else {
                toast.error('Please provide more information')
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        } finally {
            loading.value = false
        }
    }
}
</script>

<template>
    <MenuView class="mb-10" />

    <LoadingComponent v-if="loading" />

    <MenuMobileView
        class="absolute z-30 xl:hidden"
        v-show="visibleMenu"
        @clickBack="showMenu"
    />
    <div class="flex justify-between text-5xl text-white xl:hidden">
        <IconComponent class="mt-2 ml-2" />
        <font-awesome-icon
            @click="showMenu"
            v-if="!visibleMenu"
            icon="fa-solid fa-bars"
            class="mt-5 mr-4"
        />
    </div>
    <div class="flex items-start justify-center">
        <div class="relative z-20">
            <div
                v-if="!store.getters.getData?.partnerWedding"
                class="w-full pt-10 flex flex-col justify-center items-center"
            >
                <TitleComponent
                    text="Add your details"
                    class="text-4xl mb-10"
                />
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
                <TitleComponent text="Your photo" class="mt-8 mb-8" />
                <img
                    v-if="data.imgURL"
                    :src="data.imgURL"
                    alt="Your img"
                    class="w-[100px] h-[100px] object-cover rounded-full"
                />
                <input
                    class="text-lg relative w-80 rounded-lg pt-8"
                    type="file"
                    accept="image/*"
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
                class="w-[450x] pt-10 flex flex-col justify-center items-center text-white"
            >
                <TitleComponent text="Countdown to Wedding" />
                <div class="flex flex-row justify-center items-center mt-4">
                    <div class="w-[80px] h-[1.5px] bg-gray-400"></div>
                    <font-awesome-icon
                        class="text-red text-2xl px-5"
                        :icon="['fas', 'heart']"
                    />
                    <div class="w-[80px] h-[1.5px] bg-gray-400"></div>
                </div>

                <img
                    :src="store.state.data.imgURL"
                    alt="Description"
                    class="object-cover rounded-full w-[300px] h-[300px] mt-8"
                />

                <p class="font-bold text-xl mt-4">
                    {{ store.state.data.partnerWedding }}
                    <font-awesome-icon
                        :icon="['fas', 'heart']"
                        class="text-2xl text-red mt-2"
                    />
                    {{ store.state.data.name }}
                </p>
                <div v-if="typeof daysDifference === 'string' ? true : false">
                    <p class="font-extrabold text-4xl text-red mt-5">
                        {{ daysDifference }}
                    </p>
                    <div
                        class="flex flex-row justify-center m-auto items-center mt-4"
                    >
                        <div class="w-[80px] h-[1.5px] bg-gray-400"></div>
                        <font-awesome-icon
                            class="text-red text-2xl px-5"
                            :icon="['fas', 'heart']"
                        />
                        <div class="w-[80px] h-[1.5px] bg-gray-400"></div>
                    </div>
                </div>
                <div v-else>
                    <p
                        class="font-extrabold text-7xl text-red mt-5 text-center"
                    >
                        {{ daysDifference }}
                    </p>
                    <div class="flex flex-row justify-center items-center mt-4">
                        <div class="w-[40px] h-[1.5px] bg-gray-400"></div>
                        <TitleComponent class="px-5" text="Days" />
                        <div class="w-[40px] h-[1.5px] bg-gray-400"></div>
                    </div>
                </div>
                <ParafComponent
                    :text="randomQuote"
                    class="text-center my-4 px-20 text-white"
                />
            </div>
        </div>
        <LineComponent
            v-if="store.getters.getData?.partnerWedding"
            class="hidden xl:block"
        />
        <PlannerView
            v-if="store.getters.getData?.partnerWedding"
            class="hidden xl:block"
        />
    </div>
</template>
