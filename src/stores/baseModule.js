import {
    collection,
    setDoc,
    getDoc,
    getDocs,
    addDoc,
    doc,
} from 'firebase/firestore'
import { auth, db } from '../firebase'

export default {
    actions: {
        async getDoc({ commit }, { collectionID, docID }) {
            const docRef = doc(db, collectionID, docID)
            const docSnap = await getDoc(docRef)
            const data = docSnap.data()
            commit('setQuote', data)
        },
    },
}
