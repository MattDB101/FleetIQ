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
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCollection } from '../../hooks/useCollection';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: 'paper',
  },
  dialog: {
    width: '400px',
    display: 'flex',
  },
  dialogBox: {
    display: 'flex',
    alignItems: 'center',
  },
  dialogText: {
    flex: '0.4',
  },
  dialogInput: {
    flex: '0.5',
  },
  formControl: {
    margin: theme.spacing(2),
    flex: '0.5',
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  weightRow: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  input: {
    '& input.Mui-disabled': {
      color: 'green',
    },
  },
}));

const defaultState = () => {
  return {
    name: '',
    expiryDate: '',
  };
};

const AddVehicleService = (props) => {
  const collection = props.collection;
  const { user } = useAuthContext();
  const { documents, error } = useCollection(collection);
  const { addDocument, response } = useFirestore(collection);

  const classes = useStyles();

  const [capacityInvalid, setCapacityInvalid] = useState(false);
  const [registrationInvalid, setRegistrationInvalid] = useState(false);

  const [registration, setRegistration] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [vin, setVIN] = useState('');

  const validateForm = () => {
    const isCapacityValid = capacity.length > 0;
    const isRegistrationValid = registration.length > 0;

    setCapacityInvalid(!isCapacityValid);
    setRegistrationInvalid(!isRegistrationValid);

    return isCapacityValid && isRegistrationValid;
  };

  const handleAdd = () => {
    if (validateForm()) {
      const docToAdd = {
        registration,
        make,
        model,
        capacity,
        vin,
      };

      addDocument(docToAdd);
      setRegistration('');
      setMake('');
      setModel('');
      setCapacity('');
      setVIN('');
      props.callback('OK');
    }
  };

  return (
    <div>
      <Dialog
        open={props.show}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ margin: '30px', marginTop: '10px' }}
          id="alert-dialog-title"
        >
          {props.title}
        </DialogTitle>

        <div style={{ margin: '0px 50px' }}>
          <TextField
            error={registrationInvalid}
            onChange={(e) => setRegistration(e.target.value)}
            margin="normal"
            id="registration"
            label="Registration"
            InputLabelProps={{
              className: 'required-label',
            }}
            fullWidth
            variant="outlined"
          />

          <TextField
            onChange={(e) => setMake(e.target.value)}
            margin="normal"
            id="make"
            label="Make"
            fullWidth
            variant="outlined"
          />

          <TextField
            onChange={(e) => setModel(e.target.value)}
            margin="normal"
            id="model"
            label="Model"
            fullWidth
            variant="outlined"
          />

          <TextField
            type="number"
            error={capacityInvalid}
            onChange={(e) => setCapacity(e.target.value)}
            margin="normal"
            id="capacity"
            label="Max Capacity"
            InputLabelProps={{
              className: 'required-label',
            }}
            variant="outlined"
          />

          <TextField
            type="normal"
            onChange={(e) => setVIN(e.target.value)}
            margin="normal"
            id="vin"
            label="VIN"
            variant="outlined"
          />
        </div>

        <DialogActions
          style={{
            marginTop: '20px',
            marginLeft: '70%',
            marginRight: '20px',
            marginBottom: '20px',
          }}
        >
          <div>
            <Tooltip title="Save">
              <Button
                style={{
                  backgroundColor: 'green',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  marginRight: '10px',
                }}
                autofocus
                onClick={() => handleAdd()}
                size="large"
              >
                Save
              </Button>
            </Tooltip>
          </div>

          <div
            className={classes.dialogBox}
            style={{ display: 'flex', flex: '20%', marginRight: '20px' }}
          >
            <Tooltip title="Cancel">
              <Button
                style={{
                  backgroundColor: 'red',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
                onClick={() => props.callback('Cancel')}
                size="large"
              >
                Cancel
              </Button>
            </Tooltip>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddVehicleService;

//onClose = {(event, reason) => {
//    if (reason && reason == "backdropClick") return;
//    props.callback("Cancel")
//}}
