import { useReducer, useState, useEffect } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';

const initialState = {
  isPending: false,
  error: null,
  success: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, error: null, success: false };
    case 'UPDATED':
      return { isPending: false, error: null, success: true };
    case 'ERROR':
      return { isPending: false, error: action.payload, success: false };
    default:
      return state;
  }
};

export const useUpdateFault = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  const { user } = useAuthContext();

  const dispatchIfActive = (action) => {
    if (!isCancelled) dispatch(action);
  };

  /**
   * Update a fault's status and attach metadata about the maintenance that changed it.
   * payload: { faultId, status, note, maintenanceRef }
   */
  const updateFault = async ({ faultId, status, note = '', maintenanceRef = null }) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      if (!faultId) throw new Error('faultId is required');

      const updatedAt = timestamp.fromDate(new Date());
      const updatedBy = user ? user.displayName : 'unknown';

      const faultRef = projectFirestore.collection('faults').doc(faultId);

      const updatePayload = {
        status,
        lastUpdatedAt: updatedAt,
        lastUpdatedBy: updatedBy,
      };

      if (note) updatePayload.resolutionNote = note;
      if (maintenanceRef) updatePayload.maintenanceRef = maintenanceRef;

      await faultRef.set(updatePayload, { merge: true });

      dispatchIfActive({ type: 'UPDATED' });
      return { success: true };
    } catch (err) {
      console.error('Failed to update fault', err);
      dispatchIfActive({ type: 'ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  /**
   * Re-open a fault that was previously linked to a maintenance record.
   * This clears the maintenanceRef and sets status back to 'open'.
   * payload: { faultId }
   */
  const reopenFault = async ({ faultId }) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      if (!faultId) throw new Error('faultId is required');

      const updatedAt = timestamp.fromDate(new Date());
      const updatedBy = user ? user.displayName : 'unknown';

      const faultRef = projectFirestore.collection('faults').doc(faultId);

      const updatePayload = {
        status: 'open',
        maintenanceRef: null,
        resolutionNote: '',
        lastUpdatedAt: updatedAt,
        lastUpdatedBy: updatedBy,
      };

      await faultRef.set(updatePayload, { merge: true });

      dispatchIfActive({ type: 'UPDATED' });
      return { success: true };
    } catch (err) {
      console.error('Failed to reopen fault', err);
      dispatchIfActive({ type: 'ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { updateFault, reopenFault, state };
};

export default useUpdateFault;
