<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

import IconComponent from '@/components/IconComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import RecoverPasswordView from './RecoverPasswordView.vue'
import RegisterView from './RegisterView.vue'

const email = ref('')
const password = ref('')

const store = useStore()
const router = useRouter()
const { cookies } = useCookies()

onBeforeMount(() => {
    if (cookies.isKey('user')) router.replace('/user')
})

const loginFunction = async () => {
    try {
        await store.dispatch('login', {
            email: email.value,
            password: password.value,
        })
    } catch (error) {
        console.log(error)
    }
    if (store.getters.id) router.push('/user')
}

const loginWithGoogle = async () => {
    await store.dispatch('loginWithGoogle')
    router.push({ name: 'UserView' })
}

const loginWithFacebook = async () => {
    await store.dispatch('loginWithFacebook')
    router.push({ name: 'UserView' })
}

const loginWithGitHub = async () => {
    await store.dispatch('loginWithGitHub')
    router.push({ name: 'UserView' })
}

const showComponents = (component) => {
    for (const key in componentsVisible) {
        key === component
            ? (componentsVisible[key] = true)
            : (componentsVisible[key] = false)
    }
}
</script>

<template>
    <IconComponent class="mt-10" />
    <div class="flex justify-center items-center">
        <div class="w-[400px] flex flex-col justify-center items-center">
            <div class="max-w-sm flex flex-col justify-center">
                <div class="flex flex-col justify-center items-center mt-14">
                    <TitleComponent text="Hello!" />
                    <TitleComponent text="Welcome Back" />
                </div>
                <div class="flex flex-col justify-center items-center mt-6">
                    <InputComponent
                        v-model="email"
                        @keyup.enter="loginFunction"
                        icon="fa-envelope"
                        placeholder="Email"
                    />
                    <InputComponent
                        v-model="password"
                        @keyup.enter="loginFunction"
                        icon="fa-lock"
                        type="password"
                        placeholder="Password"
                    />
                </div>
                <router-link :to="{ name: 'RecoverPasswordView' }">
                    <ParafComponent
                        class="flex justify-end mt-3 mr-8 cursor-pointer"
                        text="Recover Password?"
                    />
                </router-link>
                <div class="flex flex-row justify-center">
                    <ButtonComponent
                        @click="loginFunction"
                        text="Sign In"
                        class="w-80 flex justify-center mt-12 font-bold"
                    />
                </div>
                <div class="flex flex-row justify-center items-center mt-8">
                    <div class="w-1/4 h-[1.5px] bg-gray-400"></div>
                    <ParafComponent class="mx-2" text="Or continue with" />
                    <div class="w-1/4 h-[1.5px] bg-gray-400"></div>
                </div>

                <div
                    class="w-full flex flex-col justify-center items-center mt-8"
                >
                    <div class="w-80 flex">
                        <ButtonComponent
                            @click="loginWithGoogle"
                            icon="fa-google"
                            class="flex-1 mx-2 py-3 rounded-md text-google"
                        />
                        <ButtonComponent
                            @click="loginWithFacebook"
                            icon="fa-facebook"
                            class="flex-1 mx-2 py-3 rounded-md text-facebook"
                        />
                        <ButtonComponent
                            @click="loginWithGitHub"
                            icon="fa-github"
                            class="flex-1 mx-2 py-3 rounded-md text-github"
                        />
                    </div>
                    <router-link :to="{ name: 'RegisterView' }">
                        <ParafComponent
                            class="mt-8 cursor-pointer md:hidden"
                            text="Don't have an account?"
                            text-bold="Create Account!"
                        />
                    </router-link>
                </div>
            </div>
        </div>
        <div
            class="hidden md:block border-[1px] h-[580px] opacity-50 mt-10"
        ></div>
        <RegisterView class="hidden md:block md:ml-10" />
    </div>
</template>
