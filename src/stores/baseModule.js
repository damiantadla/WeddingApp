import {
    collection,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    doc,
} from 'firebase/firestore'
import { auth, db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'

export default {
    actions: {
        async getDoc({ commit }, { collectionID, docID }) {
            const docRef = doc(db, collectionID, docID)
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            console.log(data)
            return data
        },

        async getURLFile({ commit }, { file }) {
            try {
                const fileRef = ref(storage, file)
                const downloadURL = await getDownloadURL(fileRef)
                return downloadURL
            } catch (error) {
                console.log(error)
            }
        },

        async uploadFile({ commit }, { src, file }) {
            console.log(file)
            const storageRef = ref(storage, `${src}/${file}`)
            try {
                const value = await uploadBytes(storageRef, file)
                return value
            } catch (error) {
                console.log(error)
            }
        },
    },
}
