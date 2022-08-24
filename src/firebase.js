import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAb7efOd_qwXCICRabtS8mIC1KTos_qNyA",
    authDomain: "dmwm-blogs-app.firebaseapp.com",
    projectId: "dmwm-blogs-app",
    storageBucket: "dmwm-blogs-app.appspot.com",
    messagingSenderId: "857954148740",
    appId: "1:857954148740:web:1358ff1d94188aa519bdd1"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };