
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWAeEuE36bP2qty8zF4qd7aOQTBy0xRxE",
  authDomain: "gestion-de-insumos-c478a.firebaseapp.com",
  projectId: "gestion-de-insumos-c478a",
  storageBucket: "gestion-de-insumos-c478a.appspot.com",
  messagingSenderId: "861986713329",
  appId: "1:861986713329:web:78d0bf5c0cc6f89dbd4350",
  measurementId: "G-17ZBG2LN4N"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
