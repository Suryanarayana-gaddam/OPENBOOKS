// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "mern-book-inventory-app.firebaseapp.com",
  projectId: "mern-book-inventory-app",
  storageBucket: "mern-book-inventory-app.appspot.com",
  messagingSenderId: "138192602999",
  appId: "1:138192602999:web:6ce8149811329ee2e40372"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;