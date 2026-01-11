// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgcgbtKPlf0sgWIt6YR5pUaY84PH7Gifo",
  authDomain: "soft-girl-core-3a09f.firebaseapp.com",
  projectId: "soft-girl-core-3a09f",
  storageBucket: "soft-girl-core-3a09f.firebasestorage.app",
  messagingSenderId: "378365764022",
  appId: "1:378365764022:web:0b05bd2ada9ae1586c6117",
  measurementId: "G-YS72BJ1JSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
