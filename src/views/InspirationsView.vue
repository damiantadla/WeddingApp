<script setup>
import { reactive, ref, onMounted } from 'vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { toast } from 'vue3-toastify'

import TitleComponent from '@/components/TitleComponent.vue'
import IconComponent from '@/components/IconComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'

const router = useRouter()
const store = useStore()

const isVisible = ref(false)

const isVisibleImage = ref(false)
const imgFile = ref(null)
const category = ref('Other')
const loading = ref(false)

const data = reactive({
    categories: [
        {
            name: 'Wedding Venue',
            visible: false,
            items: [],
        },
        {
            name: 'Ceremony Venue',
            visible: false,
            items: [],
        },
        {
            name: 'Wedding Dress',
            visible: false,
            items: [],
        },
        {
            name: 'Decorations',
            visible: false,
            items: [],
        },
        {
            name: 'Guest Gifts',
            visible: false,
            items: [],
        },
        {
            name: 'Other',
            visible: false,
            items: [],
        },
    ],
})

onMounted(() => {
    getData()
})

const matchingItems = ref([])
const getData = async () => {
    try {
        loading.value = true
        const res = await store.dispatch('getDocs', {
            path: `users/${store.getters.id}/inspirations`,
        })

        matchingItems.value = res.docs.map((doc) => {
            return {
                ...doc.data(),
            }
        })

        for (const category of matchingItems.value) {
            const matchingCategory = data.categories.find(
                (item) => item.name === category.name,
            )
            if (matchingCategory) {
                matchingCategory.items.push({
                    id: category.id,
                    url: category.url,
                })
            }
        }
    } catch (error) {
        toast.error(error.message)
    } finally {
        loading.value = false
    }
}

const sendImage = async () => {
    try {
        loading.value = true
        const dataReturn = await store.dispatch('uploadFileAndGetURL', {
            imageFile: imgFile.value,
        })
        await store.dispatch('createDoc', {
            data: {
                url: dataReturn.url,
                name: category.value,
                id: dataReturn.randomId,
            },
            path: `users/${store.getters.id}/inspirations`,
            id: dataReturn.randomId,
        })
        const selectedCategory = data.categories.find(
            (item) => item.name === category.value,
        )

        console.log(data.categories)
        console.log(selectedCategory)
        if (selectedCategory) {
            console.log(data.categories)
            selectedCategory.items.push({
                url: dataReturn.url,
                id: dataReturn.randomId,
            })
        }
        isVisible.value = false
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

const setIdFullScreenImage = ref('')
const showFullScreenImage = (id, url) => {
    isVisibleImage.value = url
    setIdFullScreenImage.value = id
}

const removeItemInspiration = async () => {
    console.log(setIdFullScreenImage.value)
    try {
        loading.value = true
        await store.dispatch('deleteFile', {
            path: `${store.getters.id}/inspirations/${setIdFullScreenImage.value}`,
        })
        await store.dispatch('deleteDoc', {
            path: `users/${store.getters.id}/inspirations`,
            id: setIdFullScreenImage.value,
        })
        console.log(data.categories)
        for (const item of data.categories) {
            item.items = item.items.filter(
                (itemElement) => itemElement.id !== setIdFullScreenImage.value,
            )
        }
        setIdFullScreenImage.value = ''
        closeFullScreenImage()
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}
const closeFullScreenImage = () => {
    isVisibleImage.value = !isVisibleImage.value
    setIdFullScreenImage.value = ''
}
const addFileToVariable = (event) => {
    if (event.target.files[0]) imgFile.value = event.target.files[0]
}
</script>
<template>
    <LoadingComponent v-if="loading" />
    <IconComponent class="mt-8" />
    <div class="flex flex-col p-8 justify-center items-center">
        <TitleComponent text="Inspirations" class="text-3xl mb-4" />
        <div
            class="my-4 w-full text-white"
            v-for="(category, index) in data.categories"
            :key="index"
        >
            <h3
                class="flex justify-between items-center w-full h-10 px-4 text-xl font-bold bg-glacier bg-opacity-70 rounded-lg"
                @click="
                    data.categories[index].visible =
                        !data.categories[index].visible
                "
            >
                {{ category.name }}
                <font-awesome-icon
                    :icon="
                        !category.visible
                            ? ['fas', 'caret-down']
                            : ['fas', 'caret-up']
                    "
                />
            </h3>
            <transition name="slide">
                <ul v-if="category.visible">
                    <li v-for="item in category.items" :key="item.id">
                        <img
                            :src="item.url"
                            alt="Wedding Image"
                            @click="showFullScreenImage(item.id, item.url)"
                            class="my-3 pt-4 px-4"
                        />
                    </li>
                    <div
                        v-if="category.items.length === 0"
                        @click="console.log(category.items.length)"
                        class="p-4"
                    >
                        <h1>Lack of inspiration</h1>
                    </div>
                </ul>
            </transition>
        </div>
        <transition name="slide-fade">
            <div
                v-if="isVisibleImage"
                class="fixed z-20 top-0 h-screen w-screen"
            >
                <div
                    class="fixed z-30 top-0 h-screen w-screen flex justify-center items-center bg-black bg-opacity-90"
                    @click="closeFullScreenImage"
                ></div>
                <div
                    class="fixed z-40 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <div class="relative w-screen p-6">
                        <img
                            :src="isVisibleImage"
                            alt="Image inspiration"
                            class="w-full"
                        />
                    </div>
                    <div class="absolute -top-2 right-4 bg-cream py-1 px-2">
                        <font-awesome-icon
                            @click="removeItemInspiration"
                            :icon="['fas', 'trash']"
                            class="text-4xl text-hippiePink px-2"
                        />
                        <font-awesome-icon
                            @click="closeFullScreenImage"
                            :icon="['fas', 'circle-arrow-right']"
                            class="text-4xl text-tropicalRainForest px-2"
                        />
                    </div>
                </div>
            </div>
        </transition>
    </div>
    <div>
        <GoBackComponent @click="router.back" />
        <font-awesome-icon
            @click="isVisible = !isVisible"
            class="fixed bottom-0 right-0 p-4 text-white text-6xl cursor-pointer"
            :icon="['fas', 'circle-plus']"
        />
    </div>
    <div class="h-[40px]"></div>
    <transition name="slide-fade">
        <div
            v-if="isVisible"
            class="fixed bottom-0 flex flex-col p-5 h-[220px] w-full bg-glacier"
        >
            <div class="flex justify-between">
                <TitleComponent text="Add inspiration" />
                <font-awesome-icon
                    @click="isVisible = !isVisible"
                    :icon="['fas', 'circle-xmark']"
                    class="text-5xl text-white"
                />
            </div>
            <div class="p-2">
                <TitleComponent text="Select category" class="text-lg" />
                <select
                    v-model="category"
                    name="category"
                    id="category-select"
                    class="max-w-[150px] text-black rounded-lg"
                >
                    <option
                        v-for="category in data.categories"
                        :value="category.name"
                        selected
                    >
                        {{ category.name }}
                    </option>
                </select>
            </div>
            <div class="flex justify-between pt-2 pl-2">
                <div>
                    <TitleComponent text="Select image" class="text-lg" />
                    <input
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="text-black"
                        @change="addFileToVariable"
                    />
                </div>

                <button @click="sendImage" class="border-4 p-2 rounded-lg">
                    <font-awesome-icon
                        :icon="['far', 'paper-plane']"
                        class="text-white text-4xl"
                    />
                </button>
            </div>
        </div>
    </transition>
</template>
<style scoped>
input[type='file']::file-selector-button {
    background-color: #fff;
    border: none;
    border-radius: 0.5rem;
}

.slide-enter-active {
    transition: all 0.3s ease-out;
}

.slide-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
    transform: translateY(-20px);
    opacity: 0;
}
</style>
