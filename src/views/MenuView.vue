<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import IconComponent from '@/components/IconComponent.vue'
const router = useRouter()
const store = useStore()

const logout = async () => {
    await store.dispatch('logout')
    router.push('/')
}

const isActive = (path) => {
    return router.currentRoute.value.path === path
}
</script>

<template>
    <div class="hidden xl:flex justify-between">
        <router-link class="text-center" :to="{ name: 'UserView' }">
            <IconComponent class="p-4 ml-8" />
        </router-link>
        <div class="hidden xl:block text-white">
            <ul class="flex m-6 mr-20 text-base text-center">
                <li class="w-[110px] py-2 px-4 border-r-2 border-gray-500">
                    <router-link
                        :to="{ name: 'UserView' }"
                        :class="{ 'active-menu-item': isActive('/user') }"
                    >
                        <p>Home</p>
                    </router-link>
                </li>
                <li class="w-[110px] py-2 px-4 border-r-2 border-gray-500">
                    <router-link
                        :to="{ name: 'GuestListView' }"
                        :class="{
                            'active-menu-item': isActive('/user/guest-list'),
                        }"
                    >
                        <p>Guest List</p>
                    </router-link>
                </li>
                <li class="w-[110px] py-2 px-4 border-r-2 border-gray-500">
                    <router-link
                        :to="{ name: 'InspirationsView' }"
                        :class="{
                            'active-menu-item': isActive('/user/inspirations'),
                        }"
                    >
                        <p>Inspiration</p>
                    </router-link>
                </li>
                <li class="w-[110px] py-2 px-4 border-r-2 border-gray-500">
                    <router-link
                        :to="{ name: 'NotesView' }"
                        :class="{ 'active-menu-item': isActive('/user/notes') }"
                    >
                        <p>Notes</p>
                    </router-link>
                </li>

                <li class="w-[110px] py-2 px-4">
                    <router-link
                        :to="{ name: 'SongListView' }"
                        :class="{
                            'active-menu-item': isActive('/user/song-list'),
                        }"
                    >
                        <p class="">Song list</p>
                    </router-link>
                </li>
                <li class="w-[110px] py-2 px-4 border-l-2 border-gray-500">
                    <router-link
                        :to="{ name: 'EditUserView' }"
                        :class="{ 'active-menu-item': isActive('/user/edit') }"
                    >
                        <p>Edit user</p>
                    </router-link>
                </li>
                <li
                    class="flex w-[110px] py-1 pl-4 border-l-2 text-glacier border-gray-500"
                    @click="logout"
                >
                    <p class="text-xl font-bold">Logout</p>
                    <font-awesome-icon
                        :icon="['fas', 'right-from-bracket']"
                        class="text-3xl pl-2"
                    />
                </li>
            </ul>
        </div>
    </div>
</template>
<style scoped>
.active-menu-item {
    font-weight: bold;
    color: #78bbc5;
}
</style>
