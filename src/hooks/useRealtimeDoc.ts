'use client';

import { useEffect, useState } from 'react';
import { onSnapshot, DocumentReference, DocumentData, getDoc } from 'firebase/firestore';
import useSWR from 'swr';

/**
 * Hook para sincronizar documentos do Firestore em tempo real
 * com fallback automático via SWR (atualiza a cada 60 segundos).
 */
export function useRealtimeDoc<T = any>(docRef: DocumentReference<DocumentData> | null) {
  const [localData, setLocalData] = useState<T | null>(null);

  // SWR para revalidação periódica
  const { data: swrData, mutate } = useSWR(
    docRef ? `doc-${docRef.path}` : null,
    async () => {
      if (!docRef) return null;
      const snap = await getDoc(docRef);
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
    },
    { refreshInterval: 60000 }
  );

  // Snapshot em tempo real
  useEffect(() => {
    if (!docRef) return;
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as T;
        setLocalData(data);
        mutate(data, false); // atualiza o cache local sem refetch
      }
    });
    return () => unsubscribe();
  }, [docRef, mutate]);

  return localData ?? swrData;
}
