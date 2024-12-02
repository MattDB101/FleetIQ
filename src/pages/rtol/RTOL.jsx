import React from 'react';
import ComplianceTable from '../../components/ComplianceTable';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react';

export default function RTOL() {
  const collection = 'rtols'; // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const { documents, error } = useCollection(collection);
  const currentDate = new Date();

  let props = {
    collection: collection,
    documents: documents,
    error: error,
    title: 'RTOL',
    sortField: 2,
    sortAsc: true,

    keyColumn: [
      {
        key: 'registration',
        name: 'Registration',
      },
    ],

    columns: [
      {
        name: 'Registration',
        selector: (row) => row.registration,
        sortable: true,
      },
      {
        name: 'Expiration Date',
        selector: (row) => row.expiryDate, // Only pass expiryDate here
        sortable: true,
      },
    ],
  };
  return <div>{documents && <ComplianceTable {...props} />}</div>;
}
