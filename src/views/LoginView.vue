<script setup>
import { ref, reactive, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useCookies } from 'vue3-cookies'

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
    if (store.state.user.uid) router.replace('/user')
}

const loginWithGoogle = async () => {
    await store.dispatch('loginWithGoogle')
    router.replace({ name: 'UserView' })
}

const loginWithFacebook = async () => {
    await store.dispatch('loginWithFacebook')
    router.replace({ name: 'UserView' })
}

const loginWithGitHub = async () => {
    await store.dispatch('loginWithGitHub')
    router.replace({ name: 'UserView' })
}

const componentsVisible = reactive({
    login: true,
    recovery: false,
    register: false,
})

const showComponents = (component) => {
    for (const key in componentsVisible) {
        key === component
            ? (componentsVisible[key] = true)
            : (componentsVisible[key] = false)
    }
}
</script>

<template>
    <RegisterView
        v-if="componentsVisible.register"
        @clickBack="showComponents('login')"
    />
    <RecoverPasswordView
        v-if="componentsVisible.recovery"
        @clickBack="showComponents('login')"
    />
    <div
        v-if="componentsVisible.login"
        class="max-w-sm flex flex-col justify-center items-center mx-auto my-auto"
    >
        <div class="max-w-sm flex flex-col justify-center pt-8">
            <div class="flex flex-col justify-center items-center mt-10">
                <TitleComponent text="Hello!" />
                <TitleComponent text="Welcome Back" />
            </div>
            <div class="flex flex-col justify-center items-center mt-4">
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
            <ParafComponent
                @click="showComponents('recovery')"
                class="flex justify-end mt-3 mr-8 cursor-pointer"
                text="Recover Password?"
            />
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

            <div class="w-full flex flex-col justify-center items-center mt-8">
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
                <ParafComponent
                    @click="showComponents('register')"
                    class="mt-8 cursor-pointer"
                    text="Don't have an account?"
                    text-bold="Create Account!"
                />
            </div>
        </div>
    </div>
</template>
