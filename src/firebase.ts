import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

  apiKey: "AIzaSyBJLmzYNRnJbhvGhIvNwlFm-YmSjtARSUA",

  authDomain: "move360-c02b3.firebaseapp.com",

  projectId: "move360-c02b3",

  storageBucket: "move360-c02b3.firebasestorage.app",

  messagingSenderId: "410306255400",

  appId: "1:410306255400:web:019ebe4e6a0db186dbb31d"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;