import React from 'react';
import InspectionsTable from '../../components/Tables/InspectionsTable';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { useFirestore } from '../../hooks/useFirestore';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Button, Tooltip, TextField } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';

export default function Inspections() {
  const months = [
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
  const { user } = useAuthContext();
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [year, setYear] = useState(new Date().getFullYear());
  const collection =
    'inspections/' +
    datePickerValue.getFullYear() +
    '/' +
    months[datePickerValue.getMonth()]; // THIS IS WHERE THE TABLE NAME GOES
  const { addDocument, response } = useFirestore(collection);

  var { documents, error } = useCollection(collection);

  let props = {
    collection: collection,
    documents: documents,
    year: year,
    error: error,
    title:
      'Inspections | ' +
      months[datePickerValue.getMonth()] +
      ' ' +
      datePickerValue.getFullYear(),

    keyColumn: [
      {
        key: 'client',
        name: 'Client',
      },
    ],

    columns: [
      {
        name: 'Registration',
        selector: (row) => row.registration,
        sortable: false,
      },
      {
        name: 'Inspection',
        selector: (row) => row.inspectionType,
        sortable: false,
      },
      {
        name: 'Done',
        selector: (row) => (row.complete ? 'Yes' : 'No'),
        sortable: false,
      },
    ],
  };
  return (
    <div>
      {documents && (
        <>
          <div
            style={{
              maxWidth: '300px',
              marginBottom: '30px',
              marginTop: '30px',
              marginLeft: '10px',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year', 'month']}
                openTo={'month'}
                label="Viewing Month"
                value={datePickerValue}
                style={{ maxWidth: '200px' }}
                onChange={(newValue) => {
                  setDatePickerValue(newValue);
                  setYear(newValue.getFullYear());
                  console.log(collection);
                }}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          </div>

          <InspectionsTable {...props} />
        </>
      )}
    </div>
  );
}
