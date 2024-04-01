// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbbs8m5bQIdLMDn7rbbxOZeRSOHVKR1os",
  authDomain: "lyriclens-a79df.firebaseapp.com",
  projectId: "lyriclens-a79df",
  storageBucket: "lyriclens-a79df.appspot.com",
  messagingSenderId: "963469671898",
  appId: "1:963469671898:web:858c7cc8ee4064634dd4e3",
  measurementId: "G-8T16ESN2Q4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line no-unused-vars
const analytics = getAnalytics(app);