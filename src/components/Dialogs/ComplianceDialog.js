import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  DialogContent,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCollection } from '../../hooks/useCollection';

const useStyles = makeStyles((theme) => ({''}));

const defaultState = {
  registration: '',
  expiryDate: '',
};

const AddService = (props) => {
  const { user } = useAuthContext();
  const { documents } = useCollection('vehicles');
  const { addDocument, updateDocument } = useFirestore(props.collection + '/');

  const classes = useStyles();

  const [registrationInvalid, setRegistrationInvalid] = useState(false);
  const [registration, setRegistration] = useState(defaultState.registration);
  const [expiryDate, setExpiryDate] = useState(new Date());

  const [tableRegistrations, setTableRegistrations] = useState([]);

  useEffect(() => {
    if (props.tableRows && props.tableRows.length > 0) {
      const registrations = props.tableRows.map((row) => row.registration);
      setTableRegistrations(registrations);
    }
  }, [props.tableRows]);

  // Detect if this is an edit dialog and populate form
  useEffect(() => {
    if (props.edit && props.editData) {
      setRegistration(props.editData.registration);
      setExpiryDate(new Date(props.editData.expiryDate.seconds * 1000));
    }
  }, [props.edit, props.editData]);

  const handleVehicleChange = (event) => {
    console.log(props);
    setRegistration(event.target.value);
  };

  const handleChangeDate = (newValue) => {
    setExpiryDate(newValue);
  };

  const validateForm = () => {
    const isVehicleSelected = registration !== '';
    setRegistrationInvalid(!isVehicleSelected);
    return isVehicleSelected;
  };

  const handleSave = () => {
    if (validateForm()) {
      // fire extinguishers & tacho's are recorded by SERVICE date, not EXPIRY date, so we need to add the appropriate number of years to their service date to get their expiry date
      if (props.collection === 'fireextinguishers') {
        setExpiryDate(expiryDate.setFullYear(expiryDate.getFullYear() + 1));
      }

      if (props.collection === 'tachocalibrations') {
        setExpiryDate(expiryDate.setFullYear(expiryDate.getFullYear() + 2));
      }

      const docToAdd = {
        registration: registration,
        expiryDate: expiryDate,
      };

      if (props.edit) {
        updateDocument(props.editData.id, docToAdd);
      } else {
        addDocument(docToAdd);
      }

      // Reset form or close dialog
      setExpiryDate(new Date());
      setRegistration('');
      props.callback('OK');
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        document.getElementById('cancelDialog').click();
      } else if (event.key === 'Enter') {
        document.getElementById('submitDialog').click();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <Dialog open={props.show} onClose={() => props.callback('Cancel')}>
      <DialogTitle>{props.title}</DialogTitle>

      <div style={{ margin: '0px 50px' }}>
        <FormControl fullWidth>
          <InputLabel id="vehicleSelectLabel">Vehicle</InputLabel>
          <Select
            labelId="vehicleSelectLabel"
            id="vehicleSelect"
            error={registrationInvalid}
            value={registration}
            label="Vehicle"
            onChange={handleVehicleChange}
          >
            {documents &&
              (() => {
                const filteredVehicles = documents
                  .sort((a, b) => a.registration.localeCompare(b.registration)) // Sort by registration
                  .filter((vehicle) => {
                    // If in edit mode include the current registration
                    if (props.edit && vehicle.registration === registration) {
                      return true;
                    }
                    // filter out vehicles already on this table
                    return !tableRegistrations.includes(vehicle.registration);
                  });

                return filteredVehicles.length > 0 ? (
                  // Map over the filtered and sorted vehicles to render the options
                  filteredVehicles.map((vehicle, index) => (
                    <MenuItem key={index} value={vehicle.registration}>
                      {vehicle.registration}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>All registrations in use</MenuItem>
                );
              })()}
          </Select>
        </FormControl>

        <br />
        <br />

        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
          <DesktopDatePicker
            label={
              props.collection === 'fireextinguishers' ||
              props.collection === 'tachocalibrations'
                ? 'Service Date'
                : 'Expiration Date'
            }
            format="dd/MM/yyyy"
            value={expiryDate}
            onChange={handleChangeDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      <DialogActions style={{ margin: '20px 45px' }}>
        <Tooltip title={props.edit ? 'Update' : 'Save'}>
          <Button
            id="submitDialog"
            style={{ backgroundColor: 'green', color: 'white' }}
            onClick={handleSave}
          >
            {props.edit ? 'Update' : 'Save'}
          </Button>
        </Tooltip>
        <Tooltip title="Cancel">
          <Button
            id="cancelDialog"
            style={{ backgroundColor: 'red', color: 'white' }}
            onClick={() => props.callback('Cancel')}
          >
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default AddService;
