// FIX: Changed to Firebase v9 compat imports to resolve the module export error.
// The v9 SDK with the compat libraries provides a v8-style namespaced API.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBtCnPeRGHPZNdTEJlk30P6waArflAK-EI",
  authDomain: "biozilla-website.firebaseapp.com",
  projectId: "biozilla-website",
  storageBucket: "biozilla-website.appspot.com",
  messagingSenderId: "307496746827",
  appId: "1:307496746827:web:a73765406b945aa77532ce",
  measurementId: "G-Y3XZZGH7TK"
};

// Initialize Firebase
// This code uses the v8 API, which is made available by the compat libraries.
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { app, auth, db, storage };
