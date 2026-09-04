import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase web config is PUBLIC by design - safe to hardcode in client code
// See: https://firebase.google.com/docs/projects/api-keys
const firebaseConfig = {
  apiKey: "AIzaSyBN0_d98ePeMEMw1qteoc2WL4v4nu2tvYw",
  authDomain: "threadly-45c26.firebaseapp.com",
  projectId: "threadly-45c26",
  storageBucket: "threadly-45c26.firebasestorage.app",
  messagingSenderId: "759572461356",
  appId: "1:759572461356:web:f580da68f869daedf41e89",
  measurementId: "G-F8YF88XQ8Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
