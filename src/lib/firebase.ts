import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOxJaCZT8BuSWDlFQz5UcYksKpW7pfZnc",
    authDomain: "facemateric.firebaseapp.com",
    projectId: "facemateric",
    storageBucket: "facemateric.firebasestorage.app",
    messagingSenderId: "1030208894716",
    appId: "1:1030208894716:web:b4417dc79ae254576b8979",
    measurementId: "G-LXKC9J4SDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only on client side)
let analytics;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

// Initialize Firestore
export const db = getFirestore(app);

export default app;
