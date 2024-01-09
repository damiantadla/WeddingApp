import { createStore } from 'vuex'

import { manageLocalStorage } from './storageUtils'
import authModule from './authModule'
import baseModule from './baseModule'

const store = createStore({
    state: {
        user: null,
        data: null,
        quote: null,
    },
    mutations: {
        setUser(state, data) {
            state.user = data
            manageLocalStorage.set('user', data)
        },
        removeUser(state) {
            state.user = null
            manageLocalStorage.rm('user')
        },
        setData(state, data) {
            state.data = data
            manageLocalStorage.set('data', data)
        },
        removeData(state) {
            state.data = null
            manageLocalStorage.rm('data')
        },
        updateData(state, data) {
            state.data = { ...state.data, ...data }
            manageLocalStorage.set('data', state.data)
        },
        setQuote(state, payload) {
            state.quote = payload
            manageLocalStorage.set('quote', payload)
        },
        removeQuote(state) {
            state.data = null
            manageLocalStorage.rm('quote')
        },
    },
    getters: {
        getData(state) {
            return state.data
        },
        id(state) {
            return state.data.id
        },
    },
    actions: {
        loadUserFromLocalStorage({ commit }) {
            const user = manageLocalStorage.get('user')
            const data = manageLocalStorage.get('data')
            const quote = manageLocalStorage.get('quote')

            commit('setUser', user)
            commit('setData', data)
            commit('setQuote', quote)
        },

        restoreSession({ dispatch }) {
            dispatch('loadUserFromLocalStorage')
        },
    },
    modules: {
        auth: authModule,
        base: baseModule,
    },
})

store.dispatch('restoreSession')
export default store
