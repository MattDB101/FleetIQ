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

function sortByRecent(a, b) {
  if (a.createdAt.seconds < b.createdAt.seconds) {
    return 1;
  }

  if (a.createdAt.seconds > b.createdAt.seconds) {
    return -1;
  }

  return 0;
}

function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  var offset = t.getTimezoneOffset() * -1;
  secs += offset * 60;
  t.setSeconds(secs);

  var DD = t.toString().slice(7, 10);
  var MM = t.toString().slice(4, 7);
  var YY = t.toString().slice(13, 16);
  var dateString = DD + '-' + MM + '-' + YY;
  var timeString = t.toString().slice(16, 21);
  var timeDateString = timeString + '  ' + dateString;
  return timeDateString;
}

const defaultDialogState = {
  shown: false,
  title: '',
  flavour: 'success',
  dialogType: null,
  collection: '',
};

export default function GenericComplianceTable(props) {
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

  const currentDate = new Date();
  const warningThreshold = new Date(); // Create a new date object for 30-day warning
  warningThreshold.setDate(currentDate.getDate() + 30); // Add 30 days to the current date

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
        dialogType: dialogConfig.dialogType, // Set the dialog type
        collection: dialogConfig.collection, // Set the collection property
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

  const renderExpiryDateCell = (row) => {
    if (row.expiryDate) {
      const expiryDate = new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
      const isOverdue = expiryDate <= currentDate;
      const isWarning =
        expiryDate > currentDate && expiryDate <= warningThreshold;

      let className = '';
      if (isOverdue) {
        // conditionally apply classes to cell
        className = 'overdue';
      } else if (isWarning) {
        className = 'overdue-warning';
      }

      return (
        <div className={className}>
          {new Intl.DateTimeFormat('en-GB').format(expiryDate)}
        </div>
      );
    }
    return null;
  };

  const renderServiceDateCell = (row) => {
    if (row.expiryDate) {
      const serviceDate = new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
      const expiryDate = new Date(serviceDate); // Create a new date for the expiry date
      expiryDate.setFullYear(serviceDate.getFullYear() + 1); // Set the expiry date to one year later

      const warningThreshold = new Date(expiryDate);
      warningThreshold.setDate(expiryDate.getDate() - 30); // Subtract 30 days to the expiry date for the warning check

      let className = '';
      if (expiryDate < currentDate) {
        // conditionally apply classes to cell
        className = 'overdue';
      } else if (warningThreshold < currentDate) {
        className = 'overdue-warning';
      }

      return (
        <div className={className}>
          {new Intl.DateTimeFormat('en-GB').format(serviceDate)}
        </div>
      );
    }
    return null;
  };

  const updatedColumns = props.columns.map((col) => {
    if (col.name === 'Expiration Date') {
      // Relying on the column name not to change!! (does also allow for custome classes such as with Fire Extinguishers by not using set name.)
      return {
        ...col,
        cell: renderExpiryDateCell,
      };
    } else if (col.name === 'Service Date (Valid for 1 year)') {
      return {
        ...col,
        cell: renderServiceDateCell, // Use the new custom cell renderer
      };
    }
    return col;
  });

  const filterRows = () => {
    // props.documents.sort(sortByRecent)

    // for (let i = 0; i < props.documents.length; i++) {
    //     props.documents[i].recordedAt=toDateTime(props.documents[i].createdAt.seconds)
    // }
    // console.log(props.documents[0])

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

      let isValid = true;

      // Object.keys(columnFilters).forEach((filterKey) => {
      //   let filter = columnFilters[filterKey];
      //   if (!filter.enabled) return;

      //   if (filter.type === 'text') {
      //     if (
      //       !`${row[filterKey]}`
      //         .toLowerCase()
      //         .includes(filter.filterValue.includes.toLowerCase())
      //     ) {
      //       isValid = false;
      //     }
      //     return;
      //   } else if (filter.type === 'numeric') {
      //     if (
      //       !rangeFilter(
      //         filter.filterValue.greaterThan,
      //         row[filterKey],
      //         filter.filterValue.lessThan
      //       )
      //     )
      //       isValid = false;
      //     return;
      //   } else if (filter.type === 'date') {
      //     if (
      //       !rangeFilter(
      //         filter.filterValue.from,
      //         new Date(row[filterKey]),
      //         filter.filterValue.to
      //       )
      //     )
      //       isValid = false;
      //     return;
      //   }
      // });

      return isValid;
    });
    return res;
  };

  return (
    <div className={classes.style}>
      <Card>
        <Paper>
          <Box mx={2} className={classes.tableHeader}>
            <Typography
              className={classes.title}
              style={{ fontWeight: 400, fontSize: '1.25rem' }}
            >
              {props.title}
            </Typography>

            <Typography
              className={classes.selectedCount}
              style={{ color: 'grey', fontSize: '.9rem' }}
            >
              {selectedItemText()}
            </Typography>
            <div className={classes.searchBar}>
              <TextField
                label={`${'Search by'} ${props.keyColumn[0].name}`}
                id="outlined-size-small"
                style={{ minWidth: '120px' }}
                value={searchTerm}
                onChange={filterTerm}
                variant="outlined"
                fullWidth
                size="small"
                //dense
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'right',
                flex: '30%',
              }}
            >
              <Tooltip title={'Add Record'}>
                <Button
                  style={{ marginLeft: '10px' }}
                  disabled={controlsDisabled}
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => {
                    handleAdd();
                  }}
                  aria-label="add"
                  startIcon={<AddIcon style={{ marginLeft: '30%' }} />}
                ></Button>
              </Tooltip>

              <Tooltip title="Delete Record(s)">
                <span disabled={selectedRows.length === 0 || controlsDisabled}>
                  <Button
                    style={{ marginLeft: '10px' }}
                    disabled={selectedRows.length === 0 || controlsDisabled}
                    size="small"
                    onClick={() => {
                      handleDelete();
                    }}
                    aria-label="delete"
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon style={{ marginLeft: '30%' }} />}
                  ></Button>
                </span>
              </Tooltip>

              <Tooltip title="Edit Record">
                <span disabled={selectedRows.length !== 1 || controlsDisabled}>
                  <Button
                    disabled={selectedRows.length !== 1 || controlsDisabled}
                    style={{ marginLeft: '10px' }}
                    size="small"
                    className={classes.editButton}
                    onClick={() => {
                      handleEdit();
                    }}
                    startIcon={<EditIcon style={{ marginLeft: '30%' }} />}
                    aria-label="edit"
                    variant="contained"
                  ></Button>
                </span>
              </Tooltip>

              <Tooltip title="Filter Records">
                <Button
                  disabled={true}
                  style={{ marginLeft: '10px' }}
                  variant="contained"
                  size="small"
                  onClick={() => {
                    handleFilter();
                  }}
                  className={classes.filterButton}
                  aria-label="add"
                  startIcon={<FilterListIcon style={{ marginLeft: '30%' }} />}
                ></Button>
              </Tooltip>
            </div>
          </Box>
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
