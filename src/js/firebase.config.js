// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQrU_WkmFLUbMnhgj_tIunbePmCwc0Qv8",
  authDomain: "rowaq-student.firebaseapp.com",
  databaseURL: "https://rowaq-student-default-rtdb.firebaseio.com",
  projectId: "rowaq-student",
  storageBucket: "rowaq-student.appspot.com",
  messagingSenderId: "37508585596",
  appId: "1:37508585596:web:3e89c06927006d7eb151f9",
  measurementId: "G-FYJEBT29V7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);