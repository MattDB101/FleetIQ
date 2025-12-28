import { useCollection } from '../hooks/useCollection';
import { useFirestore } from '../hooks/useFirestore';
import { projectFirestore } from '../firebase/config';
import React, { useEffect, useState } from 'react';

export const useInspectionScheduler = () => {
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const { addDocumentToCollection, response } = useFirestore('inspections');

  const scheduleInspections = (recordData) => {
    const currentDate = new Date();
    const expiryDate = new Date(recordData.expiryDate);
    const alreadyScheduled = new Set();

    // Helper function to add documents and update scheduled months
    const addInspection = async (date, type) => {
      const year = date.getFullYear();
      const month = MONTHS[date.getMonth()];
      const collectionPath = `inspections/${year}/${month}`;

      if (!alreadyScheduled.has(collectionPath)) {
        alreadyScheduled.add(collectionPath);

        // Create a deterministic doc ID so repeated scheduling is idempotent
        const rawId = `${recordData.registration}_${type}_${year}_${month}`;
        const docId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');

        const docRef = projectFirestore.collection(collectionPath).doc(docId);
        // Use set with merge to avoid overwriting unrelated fields if the doc exists
        await docRef.set(
          {
            registration: recordData.registration,
            inspectionType: type,
            complete: false,
          },
          { merge: true }
        );
      }
    };

    // Schedule pre-test inspection (1 month before expiry)
    const preInspectionDate = new Date(expiryDate);
    preInspectionDate.setMonth(expiryDate.getMonth() - 1);
    if (preInspectionDate > currentDate) {
      addInspection(preInspectionDate, 'Pre-test');
    }

    // Schedule voluntary inspection (6 months before expiry) if in the future
    const voluntaryTestDate = new Date(expiryDate);
    voluntaryTestDate.setMonth(expiryDate.getMonth() - 6);
    if (voluntaryTestDate > currentDate) {
      addInspection(voluntaryTestDate, 'Voluntary');
    }

    // Schedule 12-week inspections back from expiry until reaching the current date
    let inspectionInterval = new Date(expiryDate);
    inspectionInterval.setDate(expiryDate.getDate() - 84);

    // don't schedule any 12 week inspections before the day the CVRT was recorded
    const cutoffDate = new Date(currentDate);
    cutoffDate.setDate(currentDate.getDate());

    // Schedule inspections as long as inspectionInterval is greater than cutoffDate
    while (inspectionInterval > cutoffDate) {
      addInspection(inspectionInterval, '12 Week');
      inspectionInterval.setDate(inspectionInterval.getDate() - 84);
    }
  };

  return { scheduleInspections };
};
