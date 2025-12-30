import { useReducer, useState, useEffect } from 'react';
import { projectFirestore, timestamp } from '../firebase/config';
import { useAuthContext } from '../hooks/useAuthContext';
import useUpdateFault from './useUpdateFault';

const initialState = {
  isPending: false,
  error: null,
  success: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, error: null, success: false };
    case 'CREATED':
      return { isPending: false, error: null, success: true };
    case 'ERROR':
      return { isPending: false, error: action.payload, success: false };
    default:
      return state;
  }
};

export const useCreateMaintenance = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  const { user } = useAuthContext();
  const { updateFault } = useUpdateFault();

  const dispatchIfActive = (action) => {
    if (!isCancelled) dispatch(action);
  };

  const createMaintenance = async ({
    registration = '',
    serviceDate = null,
    technician = '',
    odometer = null,
    faults = [],
    jobs = [],
  }) => {
    dispatch({ type: 'IS_PENDING' });
    try {
      const createdAt = timestamp.fromDate(new Date());
      const createdBy = user ? user.displayName : 'unknown';

      // normalize serviceDate: accept JS Date, Firestore Timestamp, seconds object, or ISO string
      let normalizedDate = null;
      try {
        if (serviceDate) {
          if (serviceDate.toDate) normalizedDate = serviceDate.toDate();
          else if (serviceDate.seconds !== undefined) normalizedDate = new Date(serviceDate.seconds * 1000);
          else normalizedDate = new Date(serviceDate);
          if (Number.isNaN(normalizedDate.getTime())) {
            console.warn('useCreateMaintenance: invalid serviceDate, ignoring', serviceDate);
            normalizedDate = null;
          }
        }
      } catch (err) {
        console.warn('useCreateMaintenance: error normalizing serviceDate', err, serviceDate);
        normalizedDate = null;
      }

      const maintenance = {
        registration,
        serviceDate: normalizedDate ? timestamp.fromDate(normalizedDate) : null,
        technician: technician || '',
        odometer: odometer !== undefined ? odometer : null,
        jobs: (jobs || []).map((j) => ({
          workPerformed: j.workPerformed || '',
          partsReplaced: j.partsReplaced || '',
          linkedFaultId: j.linkedFaultId || null,
          faultStatus: j.faultStatus || null,
          faultNote: j.faultNote || null,
          // preserve attachment metadata when provided by caller
          fileUrl: j.fileUrl || null,
          fileName: j.fileName || null,
        })),
        createdAt,
        createdBy,
      };

      const ref = projectFirestore.collection('maintenance');
      const added = await ref.add(maintenance);

      // Update linked faults (if any). Each fault update: { faultId, status, note }
      const maintenanceRef = `maintenance/${added.id}`;

      // Update linked faults from top-level faults array (legacy) and from jobs
      for (const f of faults || []) {
        if (!f || !f.faultId) continue;
        const status = f.status || 'partially_resolved';
        const note = f.note || '';
        await updateFault({ faultId: f.faultId, status, note, maintenanceRef });
      }

      for (const j of jobs || []) {
        if (j && j.linkedFaultId) {
          const status = j.faultStatus || 'partially_resolved';
          const note = j.faultNote || '';
          await updateFault({ faultId: j.linkedFaultId, status, note, maintenanceRef });
        }
      }

      dispatchIfActive({ type: 'CREATED' });
      return { success: true, id: added.id };
    } catch (err) {
      console.error('Failed to create maintenance', err);
      dispatchIfActive({ type: 'ERROR', payload: err.message });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { createMaintenance, state };
};

export default useCreateMaintenance;
