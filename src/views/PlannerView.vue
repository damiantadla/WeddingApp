<script setup>
import { ref, reactive, onBeforeMount } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { toast } from 'vue3-toastify'

import IconComponent from '@/components/IconComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

const router = useRouter()
const store = useStore()
const date = ref(new Date())
const formattedDate = ref(new Date())
const title = ref()
const isLoading = ref(false)
const data = ref([])

const getEvents = async () => {
    try {
        const res = await store.dispatch('getDocs', {
            path: `users/${store.getters.id}/planner`,
        })

        data.value = res.docs.map((item) => {
            const firestoreTimestamp = item.data().dates

            const date = new Date(
                firestoreTimestamp.seconds * 1000 +
                    (firestoreTimestamp.nanoseconds || 0) / 1e6,
            )
            const formattedDate = date.toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            })

            return {
                id: item.id,
                title: item.data().title,
                dates: formattedDate,
                dot: 'blue',
            }
        })
    } catch (error) {
        console.error(error)
    }
    data.value.sort((a, b) => {
        const dateA = new Date(a.dates)
        const dateB = new Date(b.dates)
        return dateA - dateB
    })
}
onBeforeMount(getEvents)
const addNewEvent = async () => {
    try {
        isLoading.value = true

        if (title.value && date.value) {
            const formD = formattedDate.value.toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            })
            const res = await store.dispatch('setDocAndGetId', {
                data: {
                    title: title.value,
                    dates: formattedDate.value,
                    dot: 'blue',
                },
                path: `/users/${store.getters.id}/planner`,
            })
            console.log(formattedDate.value)
            data.value.push({
                id: res,
                title: title.value,
                dates: formD,
                dot: 'blue',
            })
            data.value.sort((a, b) => {
                const dateA = new Date(a.dates)
                const dateB = new Date(b.dates)
                return dateA - dateB
            })
            title.value = ''
        }
    } catch (error) {
        console.error(error)
    } finally {
        isLoading.value = false
    }
}
const removeEvent = async (id) => {
    try {
        isLoading.value = true
        await store.dispatch('deleteDoc', {
            path: `users/${store.getters.id}/planner`,
            id,
        })
        data.value = data.value.filter((item) => item.id !== id)
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false
    }
}

const showInfo = (e) => {
    const inputDate = new Date(e.target.ariaLabel)
    const getShortMonthName = (date) => {
        return date.toLocaleString('en-GB', { month: 'short' })
    }

    const day = inputDate.getDate()
    const shortMonth = getShortMonthName(inputDate)
    const year = inputDate.getFullYear()
    const formattedDate = `${day} ${shortMonth} ${year}`

    const isDateIncluded = []
    for (const item of data.value) {
        const newString = item.dates.split(',')
        if (formattedDate === newString[0]) isDateIncluded.push(item)
    }
    if (isDateIncluded.length) {
        for (const item of isDateIncluded) {
            console.log(item)
            const newString = item.dates.split(',')
            toast.info(`${newString[1]} - ${item.title}`, { autoClose: 6000 })
        }
    }
}

const timezone = ref('UTC')
</script>
<template>
    <div class="flex flex-col items-center xl:flex-row">
        <LoadingComponent v-if="isLoading" />
        <IconComponent class="mt-8 xl:hidden" />
        <p class="text-center text-white font-bold text-4xl mt-10 xl:mb-5">
            Calendar
        </p>

        <div class="flex flex-col items-center xl:items-start xl:flex-row">
            <div class="flex flex-col items-center mt-10 xl:mt-0">
                <VDatePicker
                    v-model="formattedDate"
                    mode="dateTime"
                    :attributes="data"
                    :timezone="timezone"
                    is24hr
                    class="mt-8"
                    locale="en"
                    @click="(e) => showInfo(e)"
                />
                <div class="flex w-[250px]">
                    <InputComponent
                        v-model="title"
                        placeholder="Title"
                        @keyup.enter="addNewEvent"
                        class="w-[280px]"
                    />
                    <button
                        @click="addNewEvent"
                        class="border-2 ml-2 mt-3 w-16 h-12 rounded-full"
                    >
                        <font-awesome-icon :icon="['fas', 'plus']" class="text-white"/>
                    </button>
                </div>
            </div>

            <perfect-scrollbar>
                <ul class="xl:h-[700px] w-[380px] mt-2">
                    <li v-for="(item, index) in data" :key="index">
                        <div
                            class="h-[90px] flex items-center justify-between bg-white text-black mx-8 my-6 rounded-xl p-4 text-xl"
                        >
                            <div>
                                <p class="">{{ item.dates }}</p>
                                <p class="text-blue-600">
                                    {{ item.title }}
                                </p>
                            </div>
                            <button
                                class="flex items-center justify-center mr-2 border-2 rounded-full border-blue-600 w-8 h-8 p-4 text-blue-600"
                            >
                                <font-awesome-icon
                                    :icon="['fas', 'xmark']"
                                    @click="removeEvent(item.id)"
                                />
                            </button>
                        </div>
                    </li>
                </ul>
            </perfect-scrollbar>
        </div>

        <GoBackComponent
            @click="router.push('/user')"
            class="text-blue-600 xl:hidden"
        />
    </div>
</template>
