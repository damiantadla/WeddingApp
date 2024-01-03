<template>
    <div
        class="max-w-sm flex flex-col justify-center items-start mx-auto my-auto"
    >
        <div
            class="pt-10 h-2/3 flex flex-col justify-center items-start mx-auto my-auto"
        >
            <TitleComponent text="Recover password" />
            <InputComponent
                v-model="email"
                @keyup.enter="sendEmail"
                class="mt-15"
                placeholder="Email"
                icon="fa-envelope"
            />
            <ButtonComponent
                @click="sendEmail"
                class="w-80 mt-5"
                text="Send email"
            />
        </div>
        <font-awesome-icon
            @click="emitClickBack"
            class="mt-20 pl-8 text-white text-6xl"
            :icon="['fas', 'circle-left']"
        />
    </div>
</template>

<script setup>
import { useStore } from 'vuex'

import { ref } from 'vue'
import TitleComponent from '@/components/TitleComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

const store = useStore()
const emit = defineEmits()

const email = ref('')

const emitClickBack = () => emit('clickBack')

const sendEmail = async () => {
    await store.dispatch('recoverPassword', {
        email: email.value,
    })
    emitClickBack()
}
</script>
