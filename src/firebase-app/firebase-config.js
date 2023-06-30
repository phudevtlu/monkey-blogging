import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKE2uMMQOdypgPBspDcRrPmUo5N5bPJPM",
  authDomain: "monkey-blogging-20db1.firebaseapp.com",
  projectId: "monkey-blogging-20db1",
  storageBucket: "monkey-blogging-20db1.appspot.com",
  messagingSenderId: "126951696172",
  appId: "1:126951696172:web:cc49a8fa85bb98bf182e89",
  measurementId: "G-7MY9NPC7DX",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
