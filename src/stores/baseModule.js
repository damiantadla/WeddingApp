import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from 'firebase/firestore'
import { show } from './showInfoUtils'
import { db, storage } from '../firebase'
import {
    getDownloadURL,
    ref,
    uploadBytes,
    deleteObject,
} from 'firebase/storage'
import { v4 as setRandomIDv4 } from 'uuid'

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
            return docSnap.data()
        },

        async getDocs(context, { path }) {
            return await getDocs(collection(db, path))
        },

        async updateDoc({ rootState }, { data, path }) {
            const userDataRef = doc(db, path)
            try {
                await updateDoc(userDataRef, {
                    ...data,
                })
                show.success('Updated data')
            } catch (error) {
                show.error(error.message)
            }
        },
        async uploadFileAndGetURL({ dispatch }, { imageFile }) {
            const randomId = setRandomIDv4()
            const imgRef = ref(
                storage,
                `${this.state.user.uid}/inspirations/${randomId}`,
            )
            const metadata = {
                contentType: 'image/jpeg',
            }
            try {
                await uploadBytes(imgRef, imageFile, metadata)
                const url = await getDownloadURL(imgRef)
                return { randomId, url }
            } catch (error) {
                console.log(error.message)
            }
        },
        async uploadFileAndGetURLFile(
            { commit, dispatch },
            { imageFile, data },
        ) {
            const imgRef = ref(storage, `${this.state.user.uid}/logo`)
            const metadata = {
                contentType: 'image/jpeg',
            }
            try {
                await uploadBytes(imgRef, imageFile, metadata)
                const url = await getDownloadURL(imgRef)
                await dispatch('updateDoc', {
                    data,
                    path: `users/${this.state.user.uid}`,
                })
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
        async deleteFile(context, { path }) {
            try {
                const desertRef = ref(storage, path)
                await deleteObject(desertRef)
            } catch (error) {
                show.error(error.message)
            }
        },
    },
}
