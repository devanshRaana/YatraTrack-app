import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// =================================================================
// IMPORTANT: FIREBASE CONFIGURATION REQUIRED
// =================================================================
// To connect the app to your Firebase project, you MUST replace
// the placeholder values below with your actual Firebase project's
// web app configuration.
//
// You can find this configuration in the Firebase console:
// Project Overview > Project settings > General > Your apps > Web app
// =================================================================
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();