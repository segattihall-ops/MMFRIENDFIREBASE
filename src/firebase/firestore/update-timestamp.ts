'use client';
import { serverTimestamp, setDoc, updateDoc, DocumentReference } from 'firebase/firestore';

/**
 * Envolve operações de gravação adicionando o campo updatedAt
 * automaticamente para rastrear alterações recentes.
 */
export async function setWithTimestamp(ref: DocumentReference, data: any, merge = true) {
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge });
}

export async function updateWithTimestamp(ref: DocumentReference, data: any) {
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}
