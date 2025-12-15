
// src/firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyASsPBDb-dHLFFH80jBhtQRaBM3eX7zXls',
  authDomain: 'ezatlan-fire.firebaseapp.com',
  projectId: 'ezatlan-fire',
  storageBucket: 'ezatlan-fire.firebasestorage.app',
  messagingSenderId: '481507232892',
  appId: '1:481507232892:web:4b75bf2b0be93c1beb4df9',
  databaseURL: 'https://ezatlan-fire-default-rtdb.firebaseio.com',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

// Debug opcional
if (__DEV__) {
  console.log('[Firebase] Inicializado:', app.name);
}
