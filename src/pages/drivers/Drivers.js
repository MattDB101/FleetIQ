import React from 'react';
import GenericTable from '../../components/GenericTable';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useCollection } from '../../hooks/useCollection';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react';
import OKDialog from '../../components/Dialogs/OKDialog';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { defaultDialogState } from '../../utils/defaultStates';

export default function Drivers() {
  const collection = 'drivers'; // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const { documents, error } = useCollection(collection);
  const [dialogState, setDialogState] = useState(defaultDialogState);

  let props = {
    collection: collection,
    documents: documents,
    error: error,
    title: 'Drivers',

    keyColumn: [
      {
        key: 'name',
        name: 'Name',
      },
    ],

    columns: [
      {
        name: 'Name',
        selector: (row) => row.Name,
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
                  backgroundColor: '#bf5532',
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
                <NoteAltIcon />
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
      // {
      //   name: "More Info",
      //   cell: (row) => (
      //       <Button
      //           variant="contained"
      //           size="small"
      //           color="primary"
      //           onClick={() => console.log("")}
      //           aria-label="add"
      //           startIcon={ <AssignmentIcon style={{marginLeft: "25%"}}/> }
      //           >
      //       </Button>
      //   ),
      //   sortable: false,
      // },
      // {
      //   name: "Time/Date Recorded",
      //   selector: (row) => row.recordedAt,
      //   sortable: true
      // },
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
