<script setup>
import { onBeforeMount, reactive, ref, computed, watch } from 'vue'

import IconComponent from '@/components/IconComponent.vue'
import GoBackComponent from '@/components/GoBackComponent.vue'
import AddButtonComponent from '@/components/AddButtonComponent.vue'
import InputComponent from '@/components/InputComponent.vue'
import TitleComponent from '@/components/TitleComponent.vue'
import SendComponent from '@/components/SendComponent.vue'
import HeartComponent from '@/components/HeartComponent.vue'
import ParafComponent from '@/components/ParafComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'

import { toast } from 'vue3-toastify'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const state = reactive({
    guestName: '',
    partner: '',
    children: '',
    overnightStays: '',
    phoneNumber: '',
    address: '',
    isInvited: false,
    confirmedGuest: false,
    whoseGuests: 'groom',
})

const updateState = reactive({
    children: '',
    overnightStays: '',
    phoneNumber: '',
    address: '',
    isInvited: '',
    confirmedGuest: '',
})

const statsHisGuests = () => {}

const calculateGuests = (guestList, item) => {
    const data = guestList.reduce(
        (total, element) => total + Number(element[item]),
        0,
    )
    return data
}

const checkGuestPartners = (guestList) => {
    return guestList.filter((guest) => guest.partner !== '').length
}

const stats = reactive({
    totalGuests: computed(function () {
        return stats.herGuests + stats.hisGuests + stats.totalChildren
    }),
    hisGuests: computed(
        () => dataGroom.value.length + checkGuestPartners(dataGroom.value),
    ),
    herGuests: computed(
        () => dataBride.value.length + checkGuestPartners(dataBride.value),
    ),
    totalChildren: computed(() => {
        const totalChildrenGroom = calculateGuests(dataGroom.value, 'children')
        const totalChildrenBride = calculateGuests(dataBride.value, 'children')
        return totalChildrenGroom + totalChildrenBride
    }),
    totalOvernightStays: computed(() => {
        const totalOvernightStaysGroom = calculateGuests(
            dataGroom.value,
            'overnightStays',
        )
        const totalOvernightStaysBride = calculateGuests(
            dataBride.value,
            'overnightStays',
        )
        return totalOvernightStaysGroom + totalOvernightStaysBride
    }),
})

const dataBride = ref([])
const dataGroom = ref([])
const isVisibleAddGuest = ref(false)
const isVisibleHisGuestList = ref(false)
const isVisibleHerGuestList = ref(false)
const isLoading = ref(false)
const category = ref('bride')

watch(
    () => dataGroom,
    (newArray, oldArray) => {
        if (JSON.stringify(newArray) !== JSON.stringify(oldArray)) {
            console.log('Tablica się zmieniła!')
        }
    },
    { deep: true },
)
const sendGuest = async () => {
    isLoading.value = true
    try {
        if (
            state.guestName &&
            state.children &&
            state.overnightStays &&
            state.phoneNumber &&
            state.address
        ) {
            await store.dispatch('setDoc', {
                data: { ...state },
                path: `/users/${store.getters.id}/guests`,
            })
            state.whoseGuests === 'groom'
                ? dataGroom.value.push({ ...state, visible: false })
                : dataBride.value.push({ ...state, visible: false })
            for (const item in state) {
                state[item] = ''
            }
            isVisibleAddGuest.value = false
            toast.success('Add your guests')
        } else {
            toast.error('Please provide more information')
        }
    } catch (error) {
        toast.error(error)
    } finally {
        isLoading.value = false
    }
}

const getGuests = async () => {
    const res = await store.dispatch('getDocs', {
        path: `users/${store.getters.id}/guests`,
    })
    res.forEach((doc) => {
        doc.data().whoseGuests === 'groom'
            ? dataGroom.value.push({
                  ...doc.data(),
                  id: doc.id,
                  visible: false,
              })
            : dataBride.value.push({
                  ...doc.data(),
                  id: doc.id,
                  visible: false,
              })
    })
    console.log(dataGroom.value)
}

const deleteGuest = async (id) => {
    await store.dispatch('deleteDoc', {
        path: `users/${store.getters.id}/guests`,
        id,
    })
    dataGroom.value = dataGroom.value.filter((item) => item.id !== id)
    dataBride.value = dataGroom.value.filter((item) => item.id !== id)
}

const updateGuest = async (id) => {
    const filterData = {}
    for (const key in updateState) {
        if (updateState[key] !== '') filterData[key] = updateState[key]
    }
    await store.dispatch('updateDoc', {
        data: { ...filterData },
        path: `users/${store.getters.id}/guests/${id}`,
    })
}

import 'jspdf-autotable'
import { jsPDF } from 'jspdf'
const generatePDF = () => {
    const fileName = `Wedding-List-${store.getters.getData.name}- ${store.getters.getData.partnerWedding}`
    const dataPdf = {
        heading: 'WEDDING GUEST LIST',
        stats: [
            `Number of invited guests: ${stats.totalGuests}`,
            `Number of overnight stays: ${stats.totalOvernightStays}`,
            `Number of invited children: ${stats.totalChildren}`,
            `Number of guests on the Bride's side: ${stats.herGuests}`,
            `Number of guests on the Groom's side: ${stats.hisGuests}`,
        ],
    }
    const columns = [
        { title: 'Guest', dataKey: 'guestName' },
        { title: 'Partner', dataKey: 'partner' },
        { title: 'Children', dataKey: 'children' },
        { title: 'Overnight stays', dataKey: 'overnightStays' },
        { title: 'Address', dataKey: 'address' },
        { title: 'Phone number', dataKey: 'phoneNumber' },
    ]
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
    })
    // text is placed using x, y coordinates
    doc.setFontSize(16).text(dataPdf.heading, 0.5, 1.0)
    // create a line under heading
    doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1)
    // Using autoTable plugin
    doc.setFontSize(12).text(dataPdf.stats, 0.5, 1.35, {
        align: 'left',
        maxWidth: '7.5',
    })
    doc.setFontSize(16).text("Groom's guests / Bride's guests", 0.5, 2.8)
    doc.setLineWidth(0.01).line(0.5, 2.9, 8.0, 2.9)
    // create a line under heading
    doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1)

    doc.autoTable({
        columns,
        body: dataGroom.value,
        margin: { left: 0.5, top: 3.0 },
    })

    doc.autoTable({
        columns,
        body: dataBride.value,
        margin: { left: 0.5, top: 1.25 },
    })
    //Create stats

    //Create footer and save to file
    doc.setFontSize(10)
    doc.text(
        'WeddingApp. Created by Damian Tadla. Contact: damiantadla@gmail.com',
        0.5,
        doc.internal.pageSize.height - 0.5,
    ).save(`${fileName}.pdf`)
}

onBeforeMount(getGuests)
</script>

<template>
    <LoadingComponent v-if="isLoading" />
    <IconComponent class="mt-6" />
    <div class="flex justify-center items-center flex-col">
        <TitleComponent text="Guest List" class="text-center text-4xl m-8" />
        <ButtonComponent
            text="Generate the guest list"
            class="text-center w-60"
        />
    </div>
    <TitleComponent text="Stats" class="ml-8 mt-8" />
    <div class="mx-10 mt-4">
        <ParafComponent :text="'Total guests: ' + stats.totalGuests" />
        <ParafComponent :text="'His guests:' + stats.hisGuests" />
        <ParafComponent :text="'Her guests: ' + stats.herGuests" />
        <ParafComponent :text="'Children: ' + stats.totalChildren" />
        <ParafComponent
            :text="'Total overnight stays: ' + stats.totalOvernightStays"
        />
    </div>
    <h1
        class="flex justify-between items-center w-80 px-4 py-3.5 mx-10 my-3 mt-6 text-white text-xl font-bold bg-glacier rounded-lg"
        @click="isVisibleHisGuestList = !isVisibleHisGuestList"
    >
        His guest
        <font-awesome-icon
            :icon="
                !isVisibleHisGuestList
                    ? ['fas', 'caret-down']
                    : ['fas', 'caret-up']
            "
        />
    </h1>
    <transition name="slide">
        <ul
            v-if="isVisibleHisGuestList"
            class="flex flex-col justify-center items-center"
        >
            <li
                v-for="(item, index) in dataGroom"
                :key="index"
                class="flex flex-col items-center"
            >
                <div
                    @click="
                        dataGroom[index].visible = !dataGroom[index].visible
                    "
                    class="relative z-20 flex justify-between items-center w-[290px] h-[60px] px-4 mt-3 mx-10 text-black text-base font-bold bg-white rounded-lg"
                >
                    <div class="p-2">
                        {{ item.guestName }}
                        and
                        {{ item.partner }}
                    </div>
                    <font-awesome-icon
                        :icon="
                            !dataGroom[index].visible
                                ? ['fas', 'caret-down']
                                : ['fas', 'caret-up']
                        "
                    />
                </div>
                <transition name="slide">
                    <div
                        v-if="item.visible"
                        class="relative z-10 w-60 max-h-[350px] bg-glacier"
                    >
                        <div class="text-black p-5">
                            <p class="">Phone number</p>
                            <input
                                v-model="updateState.phoneNumber"
                                type="text"
                                class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                :placeholder="item.phoneNumber"
                            />
                            <p>Number of children</p>
                            <input
                                v-model="updateState.children"
                                type="text"
                                class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                :placeholder="item.children"
                            />
                            <p>Overnight stays</p>
                            <input
                                v-model="updateState.overnightStays"
                                type="text"
                                class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                :placeholder="item.overnightStays"
                            />
                            <p>Address</p>
                            <input
                                v-model="updateState.address"
                                type="text"
                                class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                :placeholder="item.address"
                            />

                            <div class="p-1.5">
                                <input
                                    v-model="item.isInvited"
                                    type="checkbox"
                                    @change="
                                        updateState.isInvited = item.isInvited
                                    "
                                /><label class="ml-2">Are they invited?</label>
                            </div>

                            <div class="p-1.5">
                                <input
                                    v-model="item.confirmedGuest"
                                    type="checkbox"
                                    @change="
                                        updateState.confirmedGuest =
                                            item.confirmedGuest
                                    "
                                /><label class="ml-2">Did they confirm?</label>
                            </div>

                            <div class="ml-auto text-right">
                                <font-awesome-icon
                                    :icon="['fas', 'circle-xmark']"
                                    class="text-4xl py-3 text-hippiePink"
                                    @click="deleteGuest(item.id)"
                                />
                                <font-awesome-icon
                                    :icon="['fas', 'circle-check']"
                                    class="text-4xl py-3 ml-3 text-tropicalRainForest"
                                    @click="updateGuest(item.id)"
                                />
                            </div>
                        </div>
                    </div>
                </transition>
            </li>
        </ul>
    </transition>
    <h1
        class="flex justify-between items-center w-80 px-4 py-3.5 mx-10 my-6 text-white text-xl font-bold bg-glacier rounded-lg"
        @click="isVisibleHerGuestList = !isVisibleHerGuestList"
    >
        Her guest
        <font-awesome-icon
            :icon="
                !isVisibleHerGuestList
                    ? ['fas', 'caret-down']
                    : ['fas', 'caret-up']
            "
        />
    </h1>

    <transition name="slide">
        <transition name="slide">
            <ul
                v-if="isVisibleHerGuestList"
                class="flex flex-col justify-center items-center"
            >
                <li
                    v-for="(item, index) in dataBride"
                    :key="index"
                    class="flex flex-col items-center"
                >
                    <div
                        @click="
                            dataBride[index].visible = !dataBride[index].visible
                        "
                        class="relative z-20 flex justify-between items-center w-[290px] h-[60px] px-4 mt-3 mx-10 text-black text-base font-bold bg-white rounded-lg"
                    >
                        <div class="p-2">
                            {{ item.guestName }}
                            and
                            {{ item.partner }}
                        </div>
                        <font-awesome-icon
                            :icon="
                                !dataBride[index].visible
                                    ? ['fas', 'caret-down']
                                    : ['fas', 'caret-up']
                            "
                        />
                    </div>
                    <transition name="slide">
                        <div
                            v-if="item.visible"
                            class="relative z-10 w-60 max-h-[350px] bg-glacier"
                        >
                            <div class="text-black p-5">
                                <p class="">Phone number</p>
                                <input
                                    v-model="updateState.phoneNumber"
                                    type="text"
                                    class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                    :placeholder="item.phoneNumber"
                                />
                                <p>Number of children</p>
                                <input
                                    v-model="updateState.children"
                                    type="text"
                                    class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                    :placeholder="item.children"
                                />
                                <p>Overnight stays</p>
                                <input
                                    v-model="updateState.overnightStays"
                                    type="text"
                                    class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                    :placeholder="item.overnightStays"
                                />
                                <p>Address</p>
                                <input
                                    v-model="updateState.address"
                                    type="text"
                                    class="rounded-xl py-0.5 px-2 w-full placeholder-black"
                                    :placeholder="item.address"
                                />

                                <div class="p-1.5">
                                    <input
                                        v-model="item.isInvited"
                                        type="checkbox"
                                        @change="
                                            updateState.isInvited =
                                                item.isInvited
                                        "
                                    /><label class="ml-2"
                                        >Are they invited?</label
                                    >
                                </div>

                                <div class="p-1.5">
                                    <input
                                        v-model="item.confirmedGuest"
                                        type="checkbox"
                                        @change="
                                            updateState.confirmedGuest =
                                                item.confirmedGuest
                                        "
                                    /><label class="ml-2"
                                        >Did they confirm?</label
                                    >
                                </div>

                                <div class="ml-auto text-right">
                                    <font-awesome-icon
                                        :icon="['fas', 'circle-xmark']"
                                        class="text-4xl py-3 text-hippiePink"
                                        @click="deleteGuest(item.id)"
                                    />
                                    <font-awesome-icon
                                        :icon="['fas', 'circle-check']"
                                        class="text-4xl py-3 ml-3 text-tropicalRainForest"
                                        @click="updateGuest(item.id)"
                                    />
                                </div>
                            </div>
                        </div>
                    </transition>
                </li>
            </ul>
        </transition>
    </transition>

    <GoBackComponent @click="router.back()" />
    <AddButtonComponent @click="isVisibleAddGuest = !isVisibleAddGuest" />

    <transition name="slide-fade">
        <div
            v-if="isVisibleAddGuest"
            class="fixed z-50 w-screen h-screen top-0 left-0 bg-glacier"
        >
            <IconComponent class="mt-8" />
            <TitleComponent text="Add your guests" class="ml-8 mt-8" />
            <div class="flex flex-col items-center">
                <InputComponent
                    v-model="state.guestName"
                    placeholder="Guest"
                    icon="fa-solid fa-user"
                />
                <InputComponent
                    v-model="state.partner"
                    placeholder="Partner"
                    icon="fa-solid fa-user-group"
                />
                <InputComponent
                    v-model="state.children"
                    placeholder="Number of children"
                    type="number"
                    icon="fa-solid fa-users"
                />
                <InputComponent
                    v-model="state.overnightStays"
                    placeholder="Overnight stays"
                    type="number"
                    icon="fa-solid fa-bed"
                />
                <InputComponent
                    v-model="state.phoneNumber"
                    placeholder="Phone number"
                    type="number"
                    icon="fa-solid fa-mobile-screen"
                />
                <InputComponent
                    v-model="state.address"
                    placeholder="Address"
                    icon="fa-solid fa-location-dot"
                />

                <div class="flex flex-col items-center">
                    <HeartComponent />
                    <TitleComponent
                        text="Whose are the guests?"
                        class="text-lg"
                    />
                    <select
                        v-model="state.whoseGuests"
                        name="category"
                        id="category-select"
                        class="w-[150px] h-[50px] text-black rounded-lg p-2"
                    >
                        <option value="groom">Groom's guests</option>
                        <option value="bride">Bride's guests</option>
                    </select>
                </div>
            </div>

            <GoBackComponent @click="isVisibleAddGuest = !isVisibleAddGuest" />
            <SendComponent
                @click="sendGuest"
                class="fixed bottom-0 right-0 m-4"
            />
        </div>
    </transition>
</template>
