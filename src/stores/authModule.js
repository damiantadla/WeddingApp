import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    updateProfile,
    sendEmailVerification,
} from 'firebase/auth'
import { auth } from '../firebase'
import { show } from './showInfoUtils'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export default {
    actions: {
        async signup({ dispatch }, { email, password, name, surname }) {
            if (!name || !surname) {
                // Zakładając, że show to usługa powiadomień
                show.error('Please provide more information')
                return
            }

            try {
                const res = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                const user = res.user

                await updateProfile(user, {
                    displayName: `${name} ${surname}`,
                })
                await sendEmailVerification(auth.currentUser)

                await dispatch('createDoc', {
                    data: {
                        name: `${name} ${surname}`,
                        email,
                        id: user.uid,
                    },
                    path: `users`,
                    id: user.uid,
                })

                show.success('Registered, activation link sent to e-mail.')
            } catch (error) {
                show.error(error.code)
            }
        },
        async login({ commit, dispatch }, { email, password }) {
            try {
                const res = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password,
                )
                const user = res.user
                if (user.emailVerified) {
                    const data = await dispatch('getDoc', {
                        collectionID: 'users',
                        docID: user.uid,
                    })

                    const quote = await dispatch('getDoc', {
                        collectionID: 'quotations',
                        docID: 'quotations',
                    })

                    commit('setUser', user)
                    commit('setData', data)
                    commit('setQuote', quote)
                    cookies.set('user', user.uid)
                    show.success('Logged in')
                } else {
                    show.error('Verify your email')
                }
            } catch (error) {
                show.error(error.code)
            }
        },

        async loginWithGoogle({ commit, dispatch }) {
            try {
                const provider = new GoogleAuthProvider()
                const res = await signInWithPopup(auth, provider)

                const user = res.user

                const data = await dispatch('getDoc', {
                    collectionID: 'users',
                    docID: user.uid,
                })
                console.log(user)
                if (
                    user.metadata.creationTime === user.metadata.lastSignInTime
                ) {
                    await dispatch('createDoc', {
                        data: {
                            name: user.displayName,
                            email: user.email,
                            id: user.uid,
                        },
                        path: `users`,
                        id: user.uid,
                    })
                }
                const quote = await dispatch('getDoc', {
                    collectionID: 'quotations',
                    docID: 'quotations',
                })
                commit('setQuote', quote)
                commit('setUser', user)
                commit('setData', data)

                cookies.set('user', res.user.uid)
                show.success('Successfully logged in')
            } catch (error) {
                show.error(error)
                console.log(error)
            }
        },

        async loginWithFacebook({ commit }) {
            try {
                // const provider = new FacebookAuthProvider()
                const res = await signInWithPopup(auth, provider)
                commit('setUser', res.user)
                show.success('Successfully logged in')
            } catch (error) {
                show.error('Please use Google.')
            }
        },

        async loginWithGitHub({ commit }) {
            try {
                // const provider = new GithubAuthProvider()
                const res = await signInWithPopup(auth, provider)
                commit('setUser', res.user)
                show.success('Successfully logged in')
            } catch (error) {
                show.error('Please use Google.')
            }
        },

        async logout({ commit }) {
            try {
                await signOut(auth)
                commit('removeUser')
                commit('removeData')
                commit('removeQuote')
                cookies.remove('user')
                show.success('Logged out')
            } catch (error) {
                show.error(error.code)
            }
        },
        async recoverPassword({ commit }, { email }) {
            try {
                await sendPasswordResetEmail(auth, email)
                show.success('Email sent successfully')
            } catch (error) {
                show.error(error.code)
            }
        },
    },
}
