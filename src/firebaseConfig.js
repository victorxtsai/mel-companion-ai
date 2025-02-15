import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1_-UL3ZZ5DyTYEt8LAoJM79OegZEt3L0",
  authDomain: "mindwell-world.firebaseapp.com",
  projectId: "mindwell-world",
  storageBucket: "mindwell-world.appspot.com",
  messagingSenderId: "565553168549",
  appId: "1:565553168549:web:6d69cbe7a518fdbc708d4c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;