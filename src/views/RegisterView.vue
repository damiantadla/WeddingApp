<script setup>
import { reactive, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

import TitleComponent from '@/components/TitleComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

const emit = defineEmits(['clickBack'])

const emitClickBack = () => emit('clickBack')

const store = useStore()

const registerData = reactive({
    email: '',
    password: '',
    name: '',
    surname: '',
    number: '',
})

const registerFunction = async () => {
    await store.dispatch('signup', {
        email: registerData.email,
        password: registerData.password,
        name: registerData.name,
        surname: registerData.surname,
        number: registerData.number,
    })
    if (
        registerData.email &&
        registerData.password &&
        registerData.name &&
        registerData.surname
    )
        emitClickBack()
}
</script>
<template>
    <div
        class="max-w-sm flex flex-col justify-center items-start mx-auto my-auto"
    >
        <div
            class="h-2/3 flex flex-col justify-center items-start mx-auto my-auto"
        >
            <div class="flex flex-col justify-center items-center mt-10">
                <TitleComponent text="Register" />
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
            </div>

            <div class="flex flex-row justify-center">
                <ButtonComponent
                    @click="registerFunction"
                    text="Register"
                    class="w-80 flex justify-center mt-12 font-bold"
                />
            </div>
        </div>
        <font-awesome-icon
            @click="emitClickBack"
            class="mt-20 pl-8 text-white text-6xl"
            :icon="['fas', 'circle-left']"
        />
    </div>
</template>
