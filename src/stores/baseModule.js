import {
    collection,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore'
import { show } from './showInfoUtils'
import { db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

export default {
    actions: {
        async createDoc(context, { data, path, id }) {
            const userCollection = collection(db, `${path}`)
            const userCollectionRef = doc(userCollection, id)
            await setDoc(userCollectionRef, {
                ...data,
            })
        },

        async setDoc(context, { data, path }) {
            await addDoc(collection(db, `${path}`), {
                ...data,
            })
        },
        async getDoc(context, { collectionID, docID }) {
            const docRef = doc(db, collectionID, docID)
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            return data
        },

        async getDocs(context, { path }) {
            const querySnapshot = await getDocs(collection(db, path))
            return querySnapshot
        },

        async updateDoc({ rootState }, { partnerWedding, placeWedding, dateWedding, imgURL }) {
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
            }
        },
        async upoladFileAndGetURLFile({ commit, dispatch }, { imageFile, data }) {
            const imgRef = ref(storage, `${this.state.user.uid}/logo`)
            try {
                await uploadBytes(imgRef, imageFile)
                const url = await getDownloadURL(imgRef)
                await dispatch('updateDoc', data)
                await commit('updateData', data)
                return url
            } catch (error) {
                show.error(error.message)
            }
        },
        async deleteDoc(context, { path, id }) {
            try {
                await deleteDoc(doc(db, path, id))
            } catch (error) {
                show.error(error.message)
            }
        },
    },
}
