import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBkNsdWIycbJ4GfJnmOZJWSVur_m38UNI4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'meesho-clone-d1709.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'meesho-clone-d1709',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'meesho-clone-d1709.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '312973658415',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'G-1XVEJNMSN0',
};

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY || '';

let app = null;
let auth = null;
let googleProvider = null;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn('⚠️ Firebase initialization warning:', error?.message);
}

export { auth, googleProvider };
export default app;
