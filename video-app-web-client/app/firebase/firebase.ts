// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3bfRo-OZERSyv97i03Lzu_w5opb4tHaw",
  authDomain: "barebone-video-app.firebaseapp.com",
  projectId: "barebone-video-app",
  //   storageBucket: "barebone-video-app.firebasestorage.app",
  //   messagingSenderId: "913761568395",
  appId: "1:913761568395:web:5bc32b973c2c70d691b68e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Sign in with Google popup
// @returns - A promise that resolves with the user's credentials
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider()); // Other providers like Github/ Facebook etc also work
}

// Signs the user out
// @returns - A promise that resolves when the user is signed out
export function signOut() {
  return auth.signOut();
}

// Trigger a callback when the User's auth state changes
// @returns - A function to unsubscribe callback

export function onAuthStateChangedHelper(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}
