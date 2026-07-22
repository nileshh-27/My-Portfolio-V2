import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3vDeXrqS673WQ9YrD0tB4itTgCg0Rr-4",
  authDomain: "my-portfolio-cb334.firebaseapp.com",
  projectId: "my-portfolio-cb334",
  storageBucket: "my-portfolio-cb334.firebasestorage.app",
  messagingSenderId: "948724925353",
  appId: "1:948724925353:web:713728e1eab69e70637ab8",
  measurementId: "G-11LC8Q8WF0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
