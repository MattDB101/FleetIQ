import React from 'react';
import GenericComplianceTable from '../../components/GenericComplianceTable';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react';
import OKDialog from '../../components/Dialogs/OKDialog';

export default function FireExtinguishers() {
  const collection = 'fireextinguishers'; // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const { documents, error } = useCollection(collection);
  const currentDate = new Date();

  let props = {
    collection: collection,
    documents: documents,
    error: error,
    title: 'Fire Extinguishers',
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
        name: 'Service Date (Valid for 1 year)',
        selector: (row) => row.expiryDate,
        sortable: true,
      },
    ],
  };

  return <div>{documents && <GenericComplianceTable {...props} />}</div>;
}
