import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBIuycDQCkDkrmKGqqqJeBAvoac1J10UuA',
  authDomain: 'trackydoro-app.firebaseapp.com',
  projectId: 'trackydoro-app',
  storageBucket: 'trackydoro-app.firebasestorage.app',
  messagingSenderId: '416807715561',
  appId: '1:416807715561:web:5c0a9513503edeab04a678',
  measurementId: 'G-ZFZHRELN2K',
};

// Initialize Firebase only if it hasn't been already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export the services you'll need
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
