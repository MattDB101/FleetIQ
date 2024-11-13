import React from 'react';
import GenericTable from '../../components/Tables/GenericTable';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react';
import OKDialog from '../../components/Dialogs/OKDialog';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { defaultDialogState } from '../../utils/defaultConfig';

export default function FireExtinguishers() {
  const collection = 'fireextinguishers'; // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const { documents, error } = useCollection(collection);
  const currentDate = new Date();
  const [dialogState, setDialogState] = useState(defaultDialogState);

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
        name: 'Expiration Date',
        selector: (row) => row.expiryDate,
        sortable: true,
      },
      {
        name: '', // comment button
        button: true,
        cell: (row) =>
          row.comment ? (
            <Tooltip title="View Comment">
              <IconButton
                style={{
                  color: 'white',
                  backgroundColor: '#eb4034',
                  borderRadius: '5px',
                  padding: '5px',
                }}
                onClick={() =>
                  setDialogState({
                    shown: true,
                    message: row.comment,
                    title: row.registration,
                  })
                }
              >
                <NoteAltOutlinedIcon />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          ),
        sortable: false,
        width: '10%',
      },
      {
        name: '', // attached file button
        selector: (row) => row.fileURL,
        button: true,
        cell: (row) =>
          row.fileURL ? (
            <a target="_blank" href={row.fileURL} rel="noopener noreferrer">
              <Tooltip title="Open document">
                <IconButton
                  style={{
                    color: 'white',
                    backgroundColor: '#d4af0b',
                    borderRadius: '5px',
                    padding: '5px',
                  }}
                >
                  <FilePresentIcon />
                </IconButton>
              </Tooltip>
            </a>
          ) : (
            ''
          ),
        sortable: false,
        width: '10%',
      },
    ],
  };

  return (
    <div>
      {' '}
      <OKDialog
        show={dialogState.shown}
        message={dialogState.message}
        title={dialogState.title}
        callback={(res) => {
          setDialogState({ shown: false });
        }}
      ></OKDialog>
      {documents && <GenericTable {...props} />}
    </div>
  );
}
