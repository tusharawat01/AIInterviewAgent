import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "aiinterviewagent-ada47.firebaseapp.com",
  projectId: "aiinterviewagent-ada47",
  storageBucket: "aiinterviewagent-ada47.firebasestorage.app",
  messagingSenderId: "1048883660007",
  appId: "1:1048883660007:web:193693a7989281047a0e42",
  measurementId: "G-3TQ5WZEXX5",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
