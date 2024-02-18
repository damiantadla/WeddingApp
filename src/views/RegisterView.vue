<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

import TitleComponent from '@/components/TitleComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import HeartComponent from '@/components/HeartComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'

const store = useStore()
const router = useRouter()

const registerData = reactive({
    email: null,
    password: null,
    name: null,
    surname: null,
})

const loading = ref(false)

const registerFunction = async () => {
    if (
        registerData.email &&
        registerData.password &&
        registerData.name &&
        registerData.surname
    ) {
        try {
            loading.value = true
            await store.dispatch('signup', {
                ...registerData,
            })
            setTimeout(() => router.push('/'), 2000)
            for (const item in registerData) {
                registerData[item] = ''
            }
        } catch (error) {
            console.log(error)
        } finally {
            loading.value = false
        }
    } else {
        toast.error('Please provide more information')
    }
}
</script>
<template>
    <div>
        <LoadingComponent v-if="loading" />
        <div class="flex flex-col justify-center items-center mx-auto my-auto">
            <div
                class="h-2/3 flex flex-col justify-center items-start mx-auto my-auto"
            >
                <div
                    class="w-full flex flex-col justify-center items-center mt-10"
                >
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

                    <HeartComponent />
                </div>

                <div class="flex flex-row justify-center">
                    <ButtonComponent
                        @click="registerFunction"
                        text="Register"
                        class="w-80 flex justify-center font-bold"
                    />
                </div>
                <p class="w-80 text-center mt-5">
                    By signing in or creating an account you agree with our
                    <u>Terms and Conditions</u> and <u>Privacy Statement</u>
                </p>
            </div>
            <GoBackComponent @click="router.push('/')" class="md:hidden" />
        </div>
    </div>
</template>
