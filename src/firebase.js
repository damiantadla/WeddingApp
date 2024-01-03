import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
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
const storage = getStorage(app)
const db = getFirestore(app)

const auth = getAuth()

export { auth, db, storage }
