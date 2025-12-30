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
  const updateFault = async ({
    faultId,
    status,
    note = '',
    maintenanceRef = null,
    maintenanceDate = null,
    maintenanceTechnician = null,
    actionTaken = null,
    partsReplaced = null,
  }) => {
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
      if (maintenanceDate) updatePayload.maintenanceDate = maintenanceDate;
      if (maintenanceTechnician) updatePayload.maintenanceTechnician = maintenanceTechnician;

      await faultRef.set(updatePayload, { merge: true });

      // If resolved, and the fault references an inspection, mark the inspection item as rectified
      if (status === 'resolved') {
        try {
          const fSnap = await faultRef.get();
          const fData = fSnap.exists ? fSnap.data() : null;
          const inspectionPath = fData?.inspectionPath || null;
          const itemLabel = fData?.item || null;

          if (inspectionPath && itemLabel) {
            const inspRef = projectFirestore.doc(inspectionPath);
            const inspSnap = await inspRef.get();
            if (inspSnap.exists) {
              const inspData = inspSnap.data() || {};
              const sections = ['sectionA', 'sectionB', 'sectionC'];
              const updatedSections = {};
              let changed = false;

              for (const s of sections) {
                const section = inspData[s] || null;
                if (section && Object.prototype.hasOwnProperty.call(section, itemLabel)) {
                  const itemObj = { ...(section[itemLabel] || {}) };
                  if (!itemObj.rectified) {
                    itemObj.rectified = true;
                    // populate actionTaken/partsReplaced/notes if provided
                    if (actionTaken) itemObj.actionTaken = actionTaken;
                    if (partsReplaced) itemObj.partsReplaced = partsReplaced;
                    if (note) itemObj.notes = itemObj.notes || note;
                    // also record maintenanceDate on the inspection item if provided
                    if (maintenanceDate) itemObj.maintenanceDate = maintenanceDate;
                    if (maintenanceTechnician) itemObj.maintenanceTechnician = maintenanceTechnician;
                    updatedSections[s] = { ...section, [itemLabel]: itemObj };
                    changed = true;
                  } else {
                    // even if rectified already true, still update fields if provided
                    let localChanged = false;
                    if (actionTaken && itemObj.actionTaken !== actionTaken) {
                      itemObj.actionTaken = actionTaken;
                      localChanged = true;
                    }
                    if (partsReplaced && itemObj.partsReplaced !== partsReplaced) {
                      itemObj.partsReplaced = partsReplaced;
                      localChanged = true;
                    }
                    if (note && !itemObj.notes) {
                      itemObj.notes = note;
                      localChanged = true;
                    }
                    if (maintenanceDate && itemObj.maintenanceDate !== maintenanceDate) {
                      itemObj.maintenanceDate = maintenanceDate;
                      localChanged = true;
                    }
                    if (maintenanceTechnician && itemObj.maintenanceTechnician !== maintenanceTechnician) {
                      itemObj.maintenanceTechnician = maintenanceTechnician;
                      localChanged = true;
                    }
                    if (localChanged) {
                      updatedSections[s] = { ...section, [itemLabel]: itemObj };
                      changed = true;
                    }
                  }
                }
              }

              if (changed) {
                const lastModified = updatedAt;
                const modifiedBy = updatedBy;
                const updatePayload = { lastModified, modifiedBy };
                // merge in updated sections
                Object.assign(updatePayload, updatedSections);
                await inspRef.set(updatePayload, { merge: true });
              }
            }
          }
        } catch (err) {
          console.warn('Failed to update inspection rectified flag for fault', faultId, err);
        }
      }

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

      // If this fault was linked to an inspection item previously marked rectified, clear that flag
      try {
        const fSnap = await faultRef.get();
        const fData = fSnap.exists ? fSnap.data() : null;
        const inspectionPath = fData?.inspectionPath || null;
        const itemLabel = fData?.item || null;

        if (inspectionPath && itemLabel) {
          const inspRef = projectFirestore.doc(inspectionPath);
          const inspSnap = await inspRef.get();
          if (inspSnap.exists) {
            const inspData = inspSnap.data() || {};
            const sections = ['sectionA', 'sectionB', 'sectionC'];
            const updatedSections = {};
            let changed = false;

            for (const s of sections) {
              const section = inspData[s] || null;
              if (section && Object.prototype.hasOwnProperty.call(section, itemLabel)) {
                const itemObj = { ...(section[itemLabel] || {}) };
                if (itemObj.rectified) {
                  itemObj.rectified = false;
                  // clear rectification metadata
                  itemObj.actionTaken = '';
                  itemObj.partsReplaced = '';
                  itemObj.notes = '';
                  updatedSections[s] = { ...section, [itemLabel]: itemObj };
                  changed = true;
                }
              }
            }

            if (changed) {
              const lastModified = updatedAt;
              const modifiedBy = updatedBy;
              const updatePayload = { lastModified, modifiedBy };
              Object.assign(updatePayload, updatedSections);
              await inspRef.set(updatePayload, { merge: true });
            }
          }
        }
      } catch (err) {
        console.warn('Failed to clear inspection rectified flag for fault', faultId, err);
      }

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
