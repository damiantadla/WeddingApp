<script setup>
import { reactive, ref, onBeforeMount, computed } from 'vue'

import IconComponent from '@/components/IconComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import MenuView from '@/views/MenuView.vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { jsPDF } from 'jspdf'

const router = useRouter()
const store = useStore()

const link = ref('')

const state = reactive({
    musicID: '',
    title: '',
})

const data = ref([])
const isLoading = ref(false)
const searchTitle = ref('')
const getMusic = async () => {
    try {
        isLoading.value = true
        const musicData = await store.dispatch('getDocs', {
            path: `users/${store.getters.id}/music`,
        })
        data.value = musicData.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            }
        })
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false
    }
}

const deleteMusic = async (itemID) => {
    console.log(itemID)
    try {
        await store.dispatch('deleteDoc', {
            path: `users/${store.getters.id}/music`,
            id: itemID,
        })
        data.value = data.value.filter((obj) => obj.id !== itemID)
    } catch (error) {
        console.log(error)
    }
}
const addMusic = async () => {
    const splitLink = link.value.split('=')
    const keyAPI = 'AIzaSyDXK4SeoBf8DriytQIMbRV1mG1U9msWI9o'
    try {
        isLoading.value = true
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${splitLink[1]}&t&part=snippet&key=${keyAPI}`,
        )
        const res = await response.json()
        const id = await store.dispatch('setDocAndGetId', {
            data: {
                musicID: res.items[0].id,
                title: res.items[0].snippet.title,
            },
            path: `users/${store.getters.id}/music`,
        })
        data.value.push({
            id,
            musicID: res.items[0].id,
            title: res.items[0].snippet.title,
        })
        link.value = ''
    } catch (error) {
        console.log(error)
    } finally {
        isLoading.value = false
    }
}
const computedData = computed(() => {
    return data.value.filter((item) =>
        item.title.toLowerCase().includes(searchTitle.value.toLowerCase()),
    )
})
onBeforeMount(getMusic)

const generatePDF = () => {
    const fileName = `Wedding-Music-List-${store.getters.getData.name}-${store.getters.getData.partnerWedding}`

    const columns = [{ title: 'Music title', dataKey: 'title' }]

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
    })

    doc.setFontSize(16).text('Wedding Music List', 0.5, 1.0)

    doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1)


    doc.autoTable({
        columns,
        body: computedData.value,
        margin: { left: 0.5, top: 1.25 },
    })



    doc.setFontSize(10)
    doc.text(
        'WeddingApp. Created by Damian Tadla. Contact: damiantadla@gmail.com',
        0.5,
        doc.internal.pageSize.height - 0.5,
    ).save(`${fileName}.pdf`)
}
</script>

<template>
    <LoadingComponent v-if="isLoading" />
    <MenuView />
    <div class="w-full mx-auto">
        <IconComponent class="mt-8 xl:hidden" />
        <TitleComponent text="Song list" class="mt-20 mb-10 text-center text-5xl" />
        <div class=" flex flex-col xl:flex-row items-center justify-center">
            <div class="flex w-[320px]">
                <InputComponent
                    placeholder="Link"
                    icon="fa-brands fa-youtube"
                    v-model="link"
                    @keyup.enter="addMusic"
                    class="w-[260px]"
                />
                <button
                    class="border-2 w-[52px] h-[52px] ml-[8px] rounded-full mt-2"
                    @click="addMusic"
                >
                    <font-awesome-icon :icon="['fas', 'plus']" class="text-2xl text-white" />
                </button>
            </div>
            <div>
                <ButtonComponent
                    @click="generatePDF"
                    text="Generate the song list"
                    class="text-center w-[320px] mx-6 my-4"
                />
            </div>
            <InputComponent
                placeholder="Search by title"
                class="w-[320px]"
            :icon="['fas', 'magnifying-glass']"
            v-model="searchTitle"
            />
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div
            v-if="data"
            class="max-w-[1600px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
            <div
                class="flex flex-col items-center my-4"
                v-for="(item, index) in computedData"
                :key="index"
            >
                <div class="">
                    <iframe
                        width="350"
                        height="250"
                        :src="'https://www.youtube.com/embed/' + item.musicID"
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                    ></iframe>
                    <div
                        class="flex justify-between items-center text-black h-[50px] w-[350px] bg-white px-4"
                    >
                        <p>
                            {{
                                item.title.length > 38
                                    ? item.title.slice(0, 32) + '...'
                                    : item.title
                            }}
                        </p>
                        <font-awesome-icon
                            @click="deleteMusic(item.id)"
                            :icon="['fas', 'circle-xmark']"
                            class="text-red text-3xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <GoBackComponent @click="router.push('/user')" />
</template>
