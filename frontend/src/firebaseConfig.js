import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB_qTy-FQmKmxDx5ZpD4Wh6_42V_bKXu5o",
  authDomain: "decisioniq-1d112.firebaseapp.com",
  projectId: "decisioniq-1d112",
  storageBucket: "decisioniq-1d112.firebasestorage.app",
  messagingSenderId: "10984477745",
  appId: "1:10984477745:web:fc45798cd2d99988c4b110",
  measurementId: "G-K4HH3R3T98"
};

if (import.meta.env.DEV) {
  const trimmedKey = firebaseConfig.apiKey ? `${firebaseConfig.apiKey.slice(0, 4)}...${firebaseConfig.apiKey.slice(-4)}` : null;
  console.log('Firebase sanity check:', {
    apiKey: trimmedKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
