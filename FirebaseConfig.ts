// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbMThPtWcbjTNZidC8m-sw8nnXGazw0DE",
  authDomain: "goto-8274e.firebaseapp.com",
  projectId: "goto-8274e",
  storageBucket: "goto-8274e.appspot.com",
  messagingSenderId: "440900192393",
  appId: "1:440900192393:web:dd28fbc7d5efc8e9d29e58",
  measurementId: "G-PD3PH1XNVG"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);