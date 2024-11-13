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
    startDate: '',
    endDate: '',
  };
};

const JobDialog = (props) => {
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
  const classes = useStyles();
  const [state, setState] = useState(defaultState());
  const [pax, setPAX] = useState('');
  const [days, setDays] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [client, setClient] = useState('');
  const [departing, setDeparting] = useState('');
  const [destination, setDestination] = useState('');
  const [quote, setQuote] = useState('');
  const [comment, setComment] = useState('');

  const [daysInvalid, setDaysInvalid] = useState(false);
  const [clientInvalid, setClientInvalid] = useState(false);
  const [contactDetailsInvalid, setContactDetailsInvalid] = useState(false);
  const [paxInvalid, setPAXInvalid] = useState(false);
  const [departingInvalid, setDepartingInvalid] = useState(false);
  const [destinationInvalid, setDestinationInvalid] = useState(false);

  const { user } = useAuthContext();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [departTime, setDepartTime] = useState(null);
  const [returnTime, setReturnTime] = useState(null);
  const { addDocument, response } = useFirestore(
    'diary/' + startDate.getFullYear() + '/' + MONTHS[startDate.getMonth()]
  );

  useEffect(() => {
    const differenceInTime = endDate.getTime() + 1000 * 3600 * 24 - startDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    setDays(differenceInDays);
  }, [startDate, endDate]); // Run this effect whenever startDate or endDate changes

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate);
    }
  }, [startDate]); // Run this effect whenever startDate changes

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
  };

  const handleChangeDepartTime = (newValue) => {
    setDepartTime(newValue);
  };

  const handleChangeReturnTime = (newValue) => {
    setReturnTime(newValue);
  };
  const validateForm = () => {
    const isValidClient = client.length > 0;
    const isValidContactDetails = contactDetails.length > 0;
    const isValidPax = pax.length > 0;
    const isValidDays = days > 0;
    const isValidDeparting = departing.length > 0;
    const isValidDestination = destination.length > 0;

    setClientInvalid(!isValidClient);
    setContactDetailsInvalid(!isValidContactDetails);
    setPAXInvalid(!isValidPax);
    setDaysInvalid(!isValidDays);
    setDepartingInvalid(!isValidDeparting);
    setDestinationInvalid(!isValidDestination);

    return (
      isValidClient && isValidContactDetails && isValidPax && isValidDays && isValidDeparting && isValidDestination
    );
  };

  const handleAdd = () => {
    if (validateForm()) {
      const formattedDepartTime = departTime ? `${departTime.$H}:${String(departTime.$m).padStart(2, '0')}` : '';
      const formattedReturnTime = returnTime ? `${returnTime.$H}:${String(returnTime.$m).padStart(2, '0')}` : '';

      let docToAdd = {
        client: client,
        contactDetails: contactDetails,
        days: days,
        pax: pax,
        departing: departing,
        destination: destination,
        quote: quote,
        departTime: formattedDepartTime,
        returnTime: formattedReturnTime,
        startDate: startDate,
        endDate: endDate,
        comment: comment,
      };

      addDocument(docToAdd);

      setStartDate(new Date());
      setEndDate(new Date());
      setClient('');
      setDays(1);
      setComment('');
      setContactDetails('');
      setQuote('');
      setPAX('');
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
        <DialogTitle style={{ margin: '30px', marginTop: '10px' }} id="alert-dialog-title">
          {props.title}
        </DialogTitle>
        {/* <DialogContent>
                    <Alert severity={props.flavour}>{props.message}</Alert>
                    <DialogContentText id="alert-dialog-description">
                    </DialogContentText>
                </DialogContent> */}

        <div style={{ margin: '0px 50px' }}>
          <div class="rowOne" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div class="startDate" style={{ maxWidth: '180px', float: 'left', marginRight: '20px' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label={'Start Date'}
                  inputFormat="dd/MM/yyyy"
                  margin="normal"
                  value={startDate}
                  defaultValue={props.edit ? props.selected.startDate : ''}
                  onChange={handleChangeStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div id="calenderDiv"></div>
            </div>

            <div class="endDate" style={{ maxWidth: '180px', marginRight: '20px' }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="dd/MM/yyyy"
                  margin="normal"
                  value={endDate}
                  defaultValue={props.edit ? props.selected.endDate : ''}
                  onChange={handleChangeEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <div id="calenderDiv"></div>
            </div>

            <div class="dayCounter" style={{ maxWidth: '100px' }}>
              <TextField
                type="number"
                disabled
                value={days}
                style={{ marginTop: '0px' }}
                error={daysInvalid}
                onChange={(e) => setDays(e.target.value)}
                margin="normal"
                id="Days"
                label="Days"
                variant="outlined"
              />
            </div>
          </div>

          <div class="rowTwo" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <TextField
              style={{ maxWidth: '240px', marginRight: '20px' }}
              error={clientInvalid}
              onChange={(e) => setClient(e.target.value)}
              margin="normal"
              id="client"
              label="Client"
              InputLabelProps={{
                className: 'required-label',
              }}
              fullWidth
              variant="outlined"
            />

            <TextField
              style={{ maxWidth: '240px' }}
              error={contactDetailsInvalid}
              onChange={(e) => setContactDetails(e.target.value)}
              margin="normal"
              id="contactDetails"
              label="Contact Details"
              InputLabelProps={{
                className: 'required-label',
              }}
              fullWidth
              variant="outlined"
            />
          </div>

          <div class="rowThree" style={{ display: 'flex', flexWrap: 'wrap' }}>
            <TextField
              type="number"
              error={paxInvalid}
              onChange={(e) => setPAX(e.target.value)}
              margin="normal"
              id="PAX"
              label="PAX"
              InputLabelProps={{
                className: 'required-label',
              }}
              variant="outlined"
              style={{ maxWidth: '240px', marginRight: '20px' }}
            />

            <TextField
              type="number"
              onChange={(e) => setQuote(e.target.value)}
              margin="normal"
              id="Quote"
              label="Price Quoted"
              variant="outlined"
              style={{ maxWidth: '240px' }}
            />
          </div>

          <div class="rowFour" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
            <TextField
              style={{ maxWidth: '240px', marginRight: '20px' }}
              error={departingInvalid}
              onChange={(e) => setDeparting(e.target.value)}
              margin="none"
              id="departing"
              label="Pick Up"
              InputLabelProps={{
                className: 'required-label',
              }}
              variant="outlined"
            />
            <TextField
              error={destinationInvalid}
              onChange={(e) => setDestination(e.target.value)}
              margin="none"
              id="destination"
              label="Destination"
              InputLabelProps={{
                className: 'required-label',
              }}
              variant="outlined"
              style={{ maxWidth: '240px' }}
            />
          </div>

          <div class="rowFive" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
            <div style={{ maxWidth: '240px', marginRight: '20px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker label="Depart Time" onChange={handleChangeDepartTime} />
              </LocalizationProvider>
            </div>

            <div style={{ maxWidth: '240px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker style={{ maxWidth: '240px' }} label="Return Time" onChange={handleChangeReturnTime} />
              </LocalizationProvider>
            </div>
          </div>

          <div class="rowSix" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
            <TextField
              id="comments"
              label="Comments"
              multiline
              margin="none"
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxRows={6}
              variant="outlined"
            />
          </div>
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

          <div className={classes.dialogBox} style={{ display: 'flex', flex: '20%', marginRight: '20px' }}>
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

export default JobDialog;

//onClose = {(event, reason) => {
//    if (reason && reason == "backdropClick") return;
//    props.callback("Cancel")
//}}
