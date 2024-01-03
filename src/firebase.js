import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAN5qYYwcfvJ95M40LEPTfU3GK5-lLma70',
    authDomain: 'weddingapp-6df36.firebaseapp.com',
    projectId: 'weddingapp-6df36',
    storageBucket: 'weddingapp-6df36.appspot.com',
    messagingSenderId: '94489953228',
    appId: '1:94489953228:web:c50a72365ca9ff10429369',
    measurementId: 'G-LPT0H28F90',
}

// Initialize Firebase

// init firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
// init firebase auth
const auth = getAuth()

import {
    collection,
    getDoc,
    getDocs,
    addDoc,
    doc,
    setDoc,
} from 'firebase/firestore'

// try {
// const docRef = await addDoc(collection(db, 'users'), {
//     first: 'Ada',
//     last: 'Lovelace',
//     born: 1815,
// })
//     const userCollection = collection(db, 'users')
//     const customRef = doc(userCollection, '1234')
//     await setDoc(customRef, {
//         name: 'Damian',
//         surname: 'Tadla',
//     })
// } catch (e) {
//     console.error('Error adding document: ', e)
// }

// try {
//     const userId = '8o1AJgp6uDyYAWDjHi97'
//     const usersCollectionRef = collection(db, 'users')
//     const userDocRef = doc(usersCollectionRef, userId)
//     const userPostsCollectionRef = collection(userDocRef, 'notes')
//     const querySnapshot = await getDocs(userPostsCollectionRef)
//     querySnapshot.forEach((doc) => {
//         console.log('Dane posta:', doc.data())
//     })
// } catch (e) {
//     console.log(e)
// }
export { auth, db }
