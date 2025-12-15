
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from './firebase';
import type { UserProfile } from './types';

export async function registerWithEmail(email: string, password: string, displayName?: string): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = cred.user.uid;

  const profile: UserProfile = {
    uid,
    email,
    createdAt: Date.now(),
    displayName,
  };

  // Guarda el perfil en Realtime DB bajo /users/{uid}
  await set(ref(db, `users/${uid}`), profile);

  return profile;
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}
