<script setup>
import { reactive, ref } from 'vue'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import InputComponent from '@/components/InputComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import MenuView from '@/views/MenuView.vue'

import { toast } from 'vue3-toastify'

const router = useRouter()
const store = useStore()

const userData = reactive({
    ...store.getters.getData,
})

const partner = ref(null)
const place = ref(null)
const dateWedding = ref(null)
const imgURL = ref(null)

const imgFile = ref(null)

const handleFileChange = (e) => {
    if (e.target.files[0]) {
        imgFile.value = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (e) => {
            imgURL.value = e.target.result
        }

        reader.readAsDataURL(e.target.files[0])
    }
}
const loading = ref(false)

const updateData = async () => {
    try {
        loading.value = true

        await store.dispatch('uploadFileAndGetURLFile', {
            imageFile: imgFile.value,
            data: {
                imgURL: imgURL.value || userData.imgURL,
                partnerWedding: partner.value || userData.partnerWedding,
                placeWedding: place.value || userData.placeWedding,
                dateWedding: dateWedding.value || userData.dateWedding,
            },
        })
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
</script>
<template>
    <LoadingComponent v-if="loading" />
    <MenuView />
    <div
        class="max-w-sm flex flex-col justify-center items-start mx-auto my-auto"
    >
        <div
            class="h-2/3 flex flex-col justify-center items-center mx-auto my-auto mt-4"
        >
            <IconComponent class="xl:hidden mt-10" />
            <div class="flex flex-col justify-center items-center mt-6">
                <TitleComponent text="Update your data" class="text-4xl my-5" />
            </div>
            <div class="flex flex-col justify-center items-center mt-4">
                <InputComponent
                    v-model="partner"
                    icon="fa-user-group"
                    :placeholder="userData.partnerWedding"
                />
                <InputComponent
                    v-model="place"
                    icon="fa-location-dot"
                    :placeholder="userData.placeWedding"
                />
                <TitleComponent text="Wedding date" class="pt-4" />
                <InputComponent
                    class="text-red-500 placeholder-red-500"
                    v-model="userData.dateWedding"
                    type="date"
                />
                <TitleComponent text="Your photo" class="pt-8" />
            </div>
            <div v-if="userData.imgURL" class="flex flex-col items-center my-4">
                <img
                    :src="userData.imgURL"
                    alt="Your img"
                    class="w-[100px] h-[100px] object-cover rounded-full"
                />
                <input
                    class="text-lg relative w-80 rounded-lg p-3"
                    type="file"
                    accept="image/*"
                    @change="handleFileChange"
                />
            </div>

            <div class="flex flex-row justify-center">
                <ButtonComponent
                    @click="updateData"
                    text="Update"
                    class="w-80 flex justify-center mt-4 font-bold"
                />
            </div>
        </div>

        <font-awesome-icon
            @click="router.back()"
            :icon="['far', 'circle-left']"
            class="xl:hidden text-6xl text-glacier ml-4 mt-8"
        />
    </div>
</template>
