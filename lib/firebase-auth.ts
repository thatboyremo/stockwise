import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile, type User } from 'firebase/auth'
import { auth, requireFirebaseConfig } from './firebase'

export async function signUp(email: string, password: string, name: string) {
  requireFirebaseConfig()
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() })
  return credential.user
}

export async function signIn(email: string, password: string) {
  requireFirebaseConfig()
  return (await signInWithEmailAndPassword(auth!, email, password)).user
}

export async function resetPassword(email: string) {
  requireFirebaseConfig()
  return sendPasswordResetEmail(auth!, email)
}

export async function logOut() { requireFirebaseConfig(); return signOut(auth!) }
export type FirebaseUser = User

