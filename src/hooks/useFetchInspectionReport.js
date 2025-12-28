import { useState, useEffect } from 'react';
import { projectFirestore } from '../firebase/config';

export const useFetchInspectionReport = (year, month, id, enabled = true) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    if (!year || !month || !id) return;

    let cancelled = false;
    const fetchDoc = async () => {
      setIsPending(true);
      try {
        const path = `inspections/${year}/${month}/${id}/`;
        const docRef = projectFirestore.doc(path);
        const snap = await docRef.get();
        if (!cancelled) {
          if (snap.exists) setData(snap.data());
          else setData(null);
          setIsPending(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setIsPending(false);
        }
      }
    };

    fetchDoc();

    return () => {
      cancelled = true;
    };
  }, [year, month, id, enabled]);

  return { data, isPending, error };
};

export default useFetchInspectionReport;
