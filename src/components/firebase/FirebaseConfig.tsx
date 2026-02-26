import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBsqKyWCuSNkXtoQF4SaD5f20yRSkqSPQw",
  authDomain: "desafio-flugo-6b7b5.firebaseapp.com",
  projectId: "desafio-flugo-6b7b5",
  storageBucket: "desafio-flugo-6b7b5.firebasestorage.app",
  messagingSenderId: "566431489816",
  appId: "1:566431489816:web:2e2e20856f7f0d1522c86d",
  measurementId: "G-W4FJ4BS6CK"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);