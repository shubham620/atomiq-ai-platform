import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7rQSaYF23ELcV2caXKt-49zKbsMu_Ar4",
  authDomain: "atomiq-web.firebaseapp.com",
  projectId: "atomiq-web",
  storageBucket: "atomiq-web.firebasestorage.app",
  messagingSenderId: "994975342633",
  appId: "1:994975342633:web:207e18304c0329bfb3bc38",
  measurementId: "G-BN9Y4G1JKY"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);