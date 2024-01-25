import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import UserView from '@/views/UserView.vue'
import RecoverPasswordView from '@/views/RecoverPasswordView.vue'
import RegisterView from '@/views/RegisterView.vue'
import NotesView from '@/views/NotesView.vue'
import EditUserView from '@/views/EditUserView.vue'
import EditorView from '@/views/EditorView.vue'
import InspirationsView from '@/views/InspirationsView.vue'
import PlannerView from '@/views/PlannerView.vue'
import SongListView from '@/views/SongListView.vue'
import GuestListView from '@/views/GuestListView.vue'
import Page404View from '@/views/Page404View.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'DefaultLayout',
            component: DefaultLayout,
        },
        {
            path: '/recover-password',
            name: 'RecoverPasswordView',
            component: RecoverPasswordView,
        },
        {
            path: '/register',
            name: 'RegisterView',
            component: RegisterView,
        },
        {
            path: '/user',
            name: 'UserView',
            component: UserView,
            children: [],
        },
        {
            path: '/user/notes',
            name: 'NotesView',
            component: NotesView,
        },
        {
            path: '/user/inspirations',
            name: 'InspirationsView',
            component: InspirationsView,
        },
        {
            path: '/user/edit',
            name: 'EditUserView',
            component: EditUserView,
        },
        {
            path: '/user/planner',
            name: 'PlannerView',
            component: PlannerView,
        },
        {
            path: '/user/guest-list',
            name: 'GuestListView',
            component: GuestListView,
        },
        {
            path: '/user/song-list',
            name: 'SongListView',
            component: SongListView,
        },
        {
            path: '/:catchAll(.*)',
            component: Page404View,
        },
    ],
})

export default router
