<script setup>
import { reactive, ref } from 'vue'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import InputComponent from '@/components/InputComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

import { toast } from 'vue3-toastify'

const router = useRouter()
const store = useStore()

const data = reactive({
    ...store.getters.getData,
})

const imgFile = ref(null)

const checkObjects = (obj1, obj2) => {
    const obj1Values = Object.values(obj1)
    const obj2Values = Object.values(obj2)

    for (const [index, value] of obj1Values.entries()) {
        if (value !== obj2Values[index]) return true
    }

    return false
}

const goToBack = () => {
    router.replace('/user')
}

const handleFileChange = (e) => {
    if (e.target.files[0]) {
        imgFile.value = e.target.files[0]
        const reader = new FileReader()

        reader.onload = (e) => (data.imgURL = e.target.result)

        reader.readAsDataURL(e.target.files[0])
    }
}
const loading = ref(false)

const updateData = async () => {
    if (checkObjects(data, store.getters.getData)) {
        try {
            loading.value = true
            await store.dispatch('upoladFileAndGetURLFile', {
                imageFile: imgFile.value,
                data,
            })
        } finally {
            loading.value = false
        }
        goToBack()
    } else {
        toast.error('Please provide more information')
    }
}
</script>
<template>
    <LoadingComponent v-if="loading" />
    <div
        class="max-w-sm flex flex-col justify-center items-start mx-auto my-auto"
    >
        <div
            class="h-2/3 flex flex-col justify-center items-start mx-auto my-auto"
        >
            <div class="flex flex-col justify-center items-center mt-10">
                <TitleComponent text="Update your data" />
            </div>
            <div class="flex flex-col justify-center items-center mt-4">
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
            </div>
            <div v-if="data.imgURL" class="flex flex-col items-center my-8">
                <img
                    :src="data.imgURL"
                    alt="Your img"
                    class="w-[100px] h-[100px] object-cover rounded-full"
                />
                <input
                    class="text-lg relative w-80 rounded-lg p-3"
                    type="file"
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
            @click="goToBack"
            class="my-10 pl-8 text-white text-6xl"
            :icon="['fas', 'circle-left']"
        />
    </div>
</template>
