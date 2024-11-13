import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogActions, TextField, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCollection } from '../../hooks/useCollection';
import { defaultVehicleState } from '../../utils/defaultConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: 'paper',
  },
  dialogBox: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const AddVehicleService = (props) => {
  const { user } = useAuthContext();
  const { addDocument, updateDocument } = useFirestore(props.collection);

  const classes = useStyles();

  const [registrationInvalid, setRegistrationInvalid] = useState(false);
  const [capacityInvalid, setCapacityInvalid] = useState(false);

  // States for form fields
  const [registration, setRegistration] = useState(defaultVehicleState.registration);
  const [make, setMake] = useState(defaultVehicleState.make);
  const [model, setModel] = useState(defaultVehicleState.model);
  const [capacity, setCapacity] = useState(defaultVehicleState.capacity);
  const [vin, setVIN] = useState(defaultVehicleState.vin);
  const [comment, setComment] = useState(defaultVehicleState.comment);

  // Check if in edit mode and populate form
  useEffect(() => {
    console.log(props.edit);
    if (props.edit && props.editData) {
      setRegistration(props.editData.registration || '');
      setMake(props.editData.make || '');
      setModel(props.editData.model || '');
      setCapacity(props.editData.capacity || '');
      setVIN(props.editData.vin || '');
      setComment(props.editData.comment || '');
    }
  }, [props.edit, props.editData]);

  // Form validation
  const validateForm = () => {
    const isRegistrationValid = registration.trim().length > 0;
    const isCapacityValid = capacity.trim().length > 0;

    setRegistrationInvalid(!isRegistrationValid);
    setCapacityInvalid(!isCapacityValid);

    return isRegistrationValid && isCapacityValid;
  };

  // Handle save action
  const handleSave = () => {
    if (validateForm()) {
      const recordData = {
        registration,
        make,
        model,
        capacity,
        vin,
        comment,
      };

      if (props.edit) {
        updateDocument(props.editData.id, recordData);
      } else {
        addDocument(recordData);
      }

      setRegistration('');
      setMake('');
      setModel('');
      setCapacity('');
      setVIN('');
      props.callback('OK');
    }
  };

  return (
    <Dialog
      open={props.show}
      onClose={() => props.callback('Cancel')}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ margin: '30px', marginTop: '10px' }}>
        {props.title}
      </DialogTitle>

      <div style={{ margin: '0px 50px' }}>
        <TextField
          error={registrationInvalid}
          value={registration}
          onChange={(e) => {
            let input = e.target.value.toUpperCase(); // Capitalize for consistency
            input = input.replace(/-/g, ''); // Remove any existing dashes

            // Apply dashes based on different possible patterns
            input = input.replace(/^(\d{1,3})([A-Z]+)(\d{1,4})$/, '$1-$2-$3');

            setRegistration(input);
          }}
          margin="normal"
          id="registration"
          label="Registration"
          fullWidth
          variant="outlined"
        />

        <TextField
          value={make}
          onChange={(e) => setMake(e.target.value)}
          margin="normal"
          id="make"
          label="Make"
          fullWidth
          variant="outlined"
        />

        <TextField
          value={model}
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
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          margin="normal"
          id="capacity"
          label="Max Capacity"
          fullWidth
          variant="outlined"
        />

        <TextField
          value={vin}
          onChange={(e) => setVIN(e.target.value.toUpperCase())}
          margin="normal"
          id="vin"
          label="VIN"
          fullWidth
          variant="outlined"
        />

        <br />
        <br />

        <TextField
          id="comments"
          label="Comments"
          multiline
          margin="none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={2}
          maxRows={6}
          variant="outlined"
        />
      </div>

      <DialogActions style={{ margin: '20px 45px' }}>
        <Tooltip title={props.edit ? 'Update' : 'Save'}>
          <Button style={{ backgroundColor: 'green', color: 'white' }} onClick={handleSave}>
            {props.edit ? 'Update' : 'Save'}
          </Button>
        </Tooltip>
        <Tooltip title="Cancel">
          <Button style={{ backgroundColor: 'red', color: 'white' }} onClick={() => props.callback('Cancel')}>
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default AddVehicleService;
