// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
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
const analytics = getAnalytics(app);

const auth = getAuth();

export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};