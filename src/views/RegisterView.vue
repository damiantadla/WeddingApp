<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { toast } from 'vue3-toastify'

import TitleComponent from '@/components/TitleComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'

const emit = defineEmits(['clickBack'])

const emitClickBack = () => emit('clickBack')

const store = useStore()

const registerData = reactive({
    email: null,
    password: null,
    name: null,
    surname: null,
    number: null,
})

const loading = ref(false)

const registerFunction = async () => {
    if (
        registerData.email &&
        registerData.password &&
        registerData.name &&
        registerData.surname &&
        registerData.number
    ) {
        try {
            loading.value = true
            await store.dispatch('signup', {
                ...registerData,
            })
            emitClickBack()
        } catch (error) {
            toast.error(error)
        } finally {
            loading.value = false
        }
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
                <TitleComponent text="Sign up for free" />
            </div>
            <div class="flex flex-col justify-center items-center mt-4">
                <InputComponent
                    v-model="registerData.email"
                    @keyup.enter="registerFunction"
                    type="text"
                    icon="fa-envelope"
                    placeholder="Email"
                />
                <InputComponent
                    v-model="registerData.password"
                    @keyup.enter="registerFunction"
                    icon="fa-lock"
                    type="password"
                    placeholder="Password"
                />
                <InputComponent
                    v-model="registerData.name"
                    @keyup.enter="registerFunction"
                    icon="fa-person"
                    type="text"
                    placeholder="Name"
                />
                <InputComponent
                    v-model="registerData.surname"
                    @keyup.enter="registerFunction"
                    icon="fa-signature"
                    type="text"
                    placeholder="Surname"
                />
                <InputComponent
                    v-model="registerData.number"
                    @keyup.enter="registerFunction"
                    icon="fa-phone"
                    type="number"
                    placeholder="Phone Number"
                />
                <div class="flex flex-row justify-center items-center mt-4">
                    <div class="w-[80px] h-[1.5px] bg-gray-400"></div>
                    <font-awesome-icon
                        class="text-red text-2xl px-5"
                        :icon="['fas', 'heart']"
                    />
                    <div class="w-[80px] h-[1.5px] bg-gray-400"></div>
                </div>
            </div>

            <div class="flex flex-row justify-center">
                <ButtonComponent
                    @click="registerFunction"
                    text="Register"
                    class="w-80 flex justify-center mt-5 font-bold"
                />
            </div>
            <p class="w-80 text-center mt-5">
                By signing in or creating an account you agree with our
                <u>Terms and Conditions</u> and <u>Privacy Statement</u>
            </p>
        </div>
        <font-awesome-icon
            @click="emitClickBack"
            class="pl-8 py-8 text-white text-6xl"
            :icon="['fas', 'circle-left']"
        />
    </div>
</template>
