<script setup>
import { ref } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import TitleComponent from '@/components/TitleComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import HeartComponent from '@/components/HeartComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'

const store = useStore()
const router = useRouter()

const goBack = () => router.push('/')

const email = ref('')
const sendEmail = async () => {
    await store.dispatch('recoverPassword', {
        email: email.value,
    })
    goBack()
}
</script>
<template>
    <div
        class="max-w-sm flex flex-col justify-center items-center mx-auto my-auto"
    >
        <div class="pt-10 h-2/3 flex flex-col justify-center items-start">
            <IconComponent class="mx-auto mb-10" />
            <TitleComponent text="Recover password" />
            <InputComponent
                v-model="email"
                @keyup.enter="sendEmail"
                class="mt-15"
                placeholder="Email"
                icon="fa-envelope"
            />
            <HeartComponent />
            <ButtonComponent
                @click="sendEmail"
                class="w-80"
                text="Send email"
            />
        </div>

        <GoBackComponent @click="goBack" />
    </div>
</template>
