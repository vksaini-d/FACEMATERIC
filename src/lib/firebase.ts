import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDOxJaCZT8BuSWDlFQz5UcYksKpW7pfZnc",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "facemateric.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "facemateric",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "facemateric.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1030208894716",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1030208894716:web:b4417dc79ae254576b8979",
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-LXKC9J4SDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            getAnalytics(app);
        }
    });
}

// Initialize Firestore
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
