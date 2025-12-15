
import { db } from './firebase';
import { ref, get, onValue, update, remove } from 'firebase/database';
import type { UserProfile } from './types';

export function subscribeToUser(uid: string, cb: (user: UserProfile | null) => void) {
  const userRef = ref(db, `users/${uid}`);
  return onValue(userRef, (snap) => {
    cb(snap.exists() ? (snap.val() as UserProfile) : null);
  });
}

export async function readUser(uid: string): Promise<UserProfile | null> {
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? (snap.val() as UserProfile) : null;
}

export async function updateUser(uid: string, partial: Partial<UserProfile>) {
  await update(ref(db, `users/${uid}`), partial);
}

export async function deleteUser(uid: string) {
  await remove(ref(db, `users/${uid}`));
}
