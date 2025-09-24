
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "aqui tu api key",
  authDomain: "tu dominio ",
  projectId: "nombre del proyecto",
  storageBucket: "la direccion de aplicativo",
  messagingSenderId: "tu senderid",
  appId: "el appid de tus plicacion en firetore",
  measurementId: "tu ide de mesurament"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
