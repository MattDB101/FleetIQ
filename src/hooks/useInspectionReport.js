import { useReducer, useState, useEffect } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';

const initialState = {
  isPending: false,
  error: null,
  success: null,
};

const reportReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, error: null, success: false };
    case 'SAVED':
      return { isPending: false, error: null, success: true };
    case 'ERROR':
      return { isPending: false, error: action.payload, success: false };
    default:
      return state;
  }
};

export const useInspectionReport = () => {
  const [response, dispatch] = useReducer(reportReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  const { user } = useAuthContext();

  const dispatchIfActive = (action) => {
    if (!isCancelled) dispatch(action);
  };

  const saveReport = async ({ year, month, id, report }) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const lastModified = timestamp.fromDate(new Date());
      const modifiedBy = user ? user.displayName : 'unknown';
      const docPath = `inspections/${year}/${month}/${id}/`;
      const docRef = projectFirestore.doc(docPath);
      await docRef.set({ ...report, lastModified, modifiedBy }, { merge: true });

      // Also mark the parent inspection document complete=true
      const parentPath = `inspections/${year}/${month}/${id}`;
      const parentRef = projectFirestore.doc(parentPath);
      await parentRef.set({ complete: true, lastModified, modifiedBy }, { merge: true });
      dispatchIfActive({ type: 'SAVED' });
      return { success: true };
    } catch (err) {
      console.error('Failed to save report', err);
      dispatchIfActive({ type: 'ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { saveReport, response };
};

export default useInspectionReport;
