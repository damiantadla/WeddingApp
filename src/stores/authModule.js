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
import { auth, db } from '../firebase'
import {
    collection,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    doc,
    updateDoc,
} from 'firebase/firestore'
import { show } from './showInfoUtils'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export default {
    actions: {
        async update(
            { rootState },
            { partnerWedding, placeWedding, dateWedding, imgURL },
        ) {
            const userDataRef = doc(db, 'users', rootState.user.uid)
            try {
                await updateDoc(userDataRef, {
                    partnerWedding,
                    placeWedding,
                    dateWedding,
                    imgURL,
                })
                show.success('Updated data')
            } catch (error) {
                show.error(error.message)
                console.log(error.message)
            }
        },
        async signup({ commit }, { email, password, name, surname, number }) {
            if (!name || !surname) {
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

                const usersCollection = collection(db, 'users')
                const userCollectionRef = doc(usersCollection, user.uid)

                await setDoc(userCollectionRef, {
                    name,
                    surname,
                    email,
                    number,
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
                commit('setUser', user, '123')
                if (user.emailVerified) {
                    const data = await dispatch('getDoc', {
                        collectionID: 'users',
                        docID: user.uid,
                    })

                    console.log(data)
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

        async loginWithGoogle({ commit }) {
            try {
                const provider = new GoogleAuthProvider()
                const res = await signInWithPopup(auth, provider)
                commit('setUser', res.user)
                show.success('Successfully logged in')
            } catch (error) {
                show.error(error.code)
            }
        },

        async loginWithFacebook({ commit }) {
            try {
                const provider = new FacebookAuthProvider()
                const res = await signInWithPopup(auth, provider)
                commit('setUser', res.user)
                show.success('Successfully logged in')
            } catch (error) {
                show.error(error.code)
            }
        },

        async loginWithGitHub({ commit }) {
            try {
                const provider = new GithubAuthProvider()
                const res = await signInWithPopup(auth, provider)
                commit('setUser', res.user)
                show.success('Successfully logged in')
            } catch (error) {
                show.error(error.code)
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
