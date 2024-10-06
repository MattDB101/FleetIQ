import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from 'react-data-table-component';
import Card from '@material-ui/core/Card';
import SortIcon from '@material-ui/icons/ArrowDownward';
import { Typography } from '@material-ui/core';
import { Box, Button, Tooltip, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { pink, yellow } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import { useState, useEffect, useContext } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useFirestore } from '../hooks/useFirestore';
import VehicleDialog from './Dialogs/VehicleDialog';
import GenericDialog from './Dialogs/GenericDialog';
import TableHeader from './TableHeader';
import {
  renderExpiryDateCell,
  renderServiceDateCell,
} from './utils/DateCellRendering';

const useStyles = makeStyles((theme) => ({
  style: {
    background: '#fafafa',
    fontSize: '1rem',
    width: '100%',
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    lineHeight: 1.42857,
    textRendering: 'optimizeLegibility',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },

  paper: {
    marginBottom: theme.spacing(2),
  },

  table: {
    minWidth: 750,
  },

  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },

  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '1rem',
    paddingTop: '1rem',
    overflow: 'visible',
    marginBottom: '0.3rem',
  },

  selectedCount: {
    flex: '2 2 90%',
  },

  title: {
    flex: '1 1',
    whiteSpace: 'nowrap',
  },

  editButton: {
    backgroundColor: yellow[800],
    borderColor: yellow[800],
    color: 'white',
    '&:hover': {
      backgroundColor: yellow[900],
    },
  },

  filterButton: {
    backgroundColor: pink[600],
    borderColor: pink[600],
    color: 'white',
    '&:hover': {
      backgroundColor: pink[700],
    },
  },

  searchBar: {
    flex: '1 1 30%',
  },
}));

const defaultDialogState = {
  shown: false,
  title: '',
  flavour: 'success',
  dialogType: null,
  collection: '',
};

export default function ComplianceTable(props) {
  const classes = useStyles();
  const [controlsDisabled, setControlsDisabled] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [columnFilters, setColumnFilters] = useState({});
  const [dialogState, setDialogState] = useState(defaultDialogState);
  const { addDocument, deleteDocument, response } = useFirestore(
    props.collection
  );

  const dialogMapping = {
    'Fire Extinguishers': {
      title: 'Record Fire Extinguisher Service',
      dialogType: 'generic',
      collection: 'fireextinguishers',
    },
    'First Aid': {
      title: 'Record First Aid Expiration',
      dialogType: 'generic',
      collection: 'firstaidkits',
    },
    'Tachograph Calibration': {
      title: 'Record Tachograph Calibration',
      dialogType: 'generic',
      collection: 'tachocalibrations',
    },
    Tax: {
      title: 'Record Vehicle Tax Expiration',
      dialogType: 'generic',
      collection: 'taxes',
    },
    PSV: {
      title: 'Record Vehicle PSV Inspection Expiration',
      dialogType: 'generic',
      collection: 'psvs',
    },
    RTOL: {
      title: 'Record Vehicle RTOL Expiration',
      dialogType: 'generic',
      collection: 'rtols',
    },
    CVRT: {
      title: 'Record CVRT Expiration',
      dialogType: 'generic',
      collection: 'cvrts',
    },
    'Add Vehicle': {
      title: 'Add a Vehicle To Fleet',
      dialogType: 'vehicle',
      collection: 'vehicles',
    },
  };

  const filterTerm = (event) => setSearchTerm(event.target.value);

  const handleDelete = () => {
    if (selectedRows.length == 1) {
      if (window.confirm('Are you sure you want to delete this row?')) {
        setToggleCleared(!toggleCleared);
        deleteDocument(selectedRows[0].id);
        selectedRows.length = 0;
      }
    } else {
      var confirm = prompt(
        'Please enter "CONFIRM" to delete these rows. \nWARNING: This cannot be undone!'
      );
      if (confirm && confirm.toLowerCase() === 'confirm') {
        console.log('multidelete');
        setToggleCleared(!toggleCleared);
        for (let i = 0; i < selectedRows.length; i++) {
          deleteDocument(selectedRows[i].id);
        }
        selectedRows.length = 0;
      }
    }
  };

  const handleAdd = () => {
    const dialogConfig = dialogMapping[props.title];

    if (dialogConfig) {
      setDialogState({
        shown: true,
        title: dialogConfig.title,
        message: dialogConfig.message,
        flavour: dialogConfig.flavour,
        dialogType: dialogConfig.dialogType,
        collection: dialogConfig.collection,
      });
    } else {
      console.warn('No dialog configuration found for this title.');
    }
  };

  const closeDialog = () => {
    setDialogState(defaultDialogState);
  };

  const handleEdit = () => {
    console.log(selectedRows[0]);
  };

  const handleFilter = () => {
    console.log(props.documents);
  };

  const selectedItemText = () => {
    if (selectedRows.length === 0) return '';
    if (selectedRows.length === 1) return '1 row selected';
    if (selectedRows.length > 1 && selectedRows.length < props.documents.length)
      return `${selectedRows.length} ${'rows selected'}`;
    if (selectedRows.length === props.documents.length)
      return 'All rows selected';

    return '';
  };

  const rangeFilter = (greaterThan, value, lessThan) => {
    if (value >= greaterThan && value <= lessThan) return true;

    return false;
  };

  const updatedColumns = props.columns.map((col) => {
    if (col.name === 'Expiration Date') {
      // I'm relying on the column name not to change!! (upside: does allow for custom render conditions such as with Fire Extinguishers by not using set name)
      return {
        ...col,
        cell: renderExpiryDateCell, // Use the custom cell renderer in utils folder
      };
    } else if (col.name === 'Service Date (Valid for 1 year)') {
      return {
        ...col,
        cell: renderServiceDateCell, // Use the custom cell renderer in utils folder
      };
    }
    return col;
  });

  const filterRows = () => {
    let res = props.documents.filter((row) => {
      const rowAlphanumeric = `${row[props.keyColumn[0].key]}`
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '');

      const searchAlphanumeric = searchTerm
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '');

      if (!rowAlphanumeric.includes(searchAlphanumeric)) {
        return false;
      }

      return true;
    });
    return res;
  };

  return (
    <div className={classes.style}>
      <Card>
        <Paper>
          <TableHeader
            title={props.title}
            selectedItemText={selectedItemText}
            searchColumn={props.keyColumn[0].key}
            searchTerm={searchTerm}
            filterTerm={filterTerm}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            handleFilter={handleFilter}
            controlsDisabled={controlsDisabled}
            selectedRows={selectedRows}
            classes={classes}
          />
          <DataTable
            columns={updatedColumns}
            onSelectedRowsChange={(e) => setSelectedRows(e.selectedRows)}
            data={filterRows()}
            sortIcon={<SortIcon />}
            defaultSortFieldId={props.sortField}
            defaultSortAsc={props.sortAsc}
            pagination
            clearSelectedRows={toggleCleared}
            selectableRows
            striped
          />

          {/* Conditionally render dialogs based on dialogType */}
          {dialogState.dialogType === 'vehicle' && (
            <VehicleDialog
              show={dialogState.shown}
              title={dialogState.title}
              collection={dialogState.collection} // Now includes collection
              message={dialogState.message}
              flavour={dialogState.flavour}
              callback={(res) => {
                closeDialog();
              }}
            />
          )}

          {dialogState.dialogType === 'generic' && (
            <GenericDialog
              show={dialogState.shown}
              collection={dialogState.collection} // Now includes collection
              tableRows={props.documents}
              title={dialogState.title}
              message={dialogState.message}
              flavour={dialogState.flavour}
              callback={(res) => {
                closeDialog();
              }}
            />
          )}

          <Typography
            className={classes.title}
            style={{ color: 'Red', fontSize: '1.25rem', marginLeft: '20px' }}
          >
            {props.error}
          </Typography>
        </Paper>
      </Card>
    </div>
  );
}
