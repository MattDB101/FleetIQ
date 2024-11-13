import { addDoc } from 'firebase/firestore';
import { useCollection } from '../hooks/useCollection';
import { useFirestore } from '../hooks/useFirestore';
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
    const addInspection = (date, type) => {
      const year = date.getFullYear();
      const month = MONTHS[date.getMonth()];
      const collectionPath = `inspections/${year}/${month}`;

      if (!alreadyScheduled.has(collectionPath)) {
        alreadyScheduled.add(collectionPath);
        addDocumentToCollection(collectionPath, {
          registration: recordData.registration,
          inspectionType: type,
          complete: false,
        });
      }
    };

    // Schedule pre-test inspection (1 month before expiry)
    const preInspectionDate = new Date(expiryDate);
    preInspectionDate.setMonth(expiryDate.getMonth() - 1);
    addInspection(preInspectionDate, 'Pre-test');

    // Schedule voluntary inspection (6 months before expiry) if in the future
    const voluntaryTestDate = new Date(expiryDate);
    voluntaryTestDate.setMonth(expiryDate.getMonth() - 6);
    if (voluntaryTestDate > currentDate) {
      addInspection(voluntaryTestDate, 'Voluntary');
    }

    // Schedule 12-week inspections back from expiry until reaching the current date
    let inspectionInterval = new Date(expiryDate);
    inspectionInterval.setDate(expiryDate.getDate() - 84);

    while (inspectionInterval > currentDate) {
      addInspection(inspectionInterval, '12 Week');
      inspectionInterval.setDate(inspectionInterval.getDate() - 84);
    }
  };

  return { scheduleInspections };
};
