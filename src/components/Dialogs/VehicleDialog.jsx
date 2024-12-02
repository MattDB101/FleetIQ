import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useCollection } from '../../hooks/useCollection';
import { defaultVehicleState } from '../../utils/defaultConfig';
import { Stack, Checkbox, Input } from '@mui/material';
import Typography from '@material-ui/core/Typography';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { handleFileUpload } from '../../utils/fileHandler';

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
  const [registration, setRegistration] = useState(
    defaultVehicleState.registration
  );
  const [make, setMake] = useState(defaultVehicleState.make);
  const [model, setModel] = useState(defaultVehicleState.model);
  const [capacity, setCapacity] = useState(defaultVehicleState.capacity);
  const [vin, setVIN] = useState(defaultVehicleState.vin);
  const [comment, setComment] = useState(defaultVehicleState.comment);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // New state to track upload

  // Check if in edit mode and populate form
  useEffect(() => {
    if (props.edit && props.editData) {
      setRegistration(props.editData.registration || '');
      setMake(props.editData.make || '');
      setModel(props.editData.model || '');
      setCapacity(props.editData.capacity || '');
      setVIN(props.editData.vin || '');
      setComment(props.editData.comment || '');
      setFile(
        { name: props.editData.fileName, url: props.editData.fileUrl } || null
      );
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

  const handleSave = () => {
    if (validateForm()) {
      const recordData = {
        registration,
        make,
        model,
        capacity,
        vin,
        comment,
        fileName: file ? file.name : '',
        fileUrl: file ? file.url : '',
      };

      if (props.edit) {
        updateDocument(props.editData.id, recordData);
      } else {
        addDocument(recordData);
      }

      // Reset form
      setRegistration('');
      setMake('');
      setModel('');
      setCapacity('');
      setVIN('');
      setFile(null);
      props.callback('OK');
    }
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setLoading(true); // Set loading to true during file upload
      const uploadedFile = await handleFileUpload(selectedFile);
      setFile({
        name: uploadedFile.name,
        url: uploadedFile.url,
      });
      setLoading(false); // Set loading back to false after upload completes
    }
  };

  return (
    <Dialog
      open={props.show}
      onClose={() => props.callback('Cancel')}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={{ margin: '10px', marginTop: '10px' }}
      >
        {props.title}
      </DialogTitle>
      <div style={{ margin: '0px 50px' }}>
        <Stack direction="row" useFlexGap spacing={2}>
          <TextField
            error={registrationInvalid}
            value={registration}
            onChange={(e) => {
              let input = e.target.value.toUpperCase();
              input = input.replace(/-/g, '');
              input = input.replace(/^(\d{1,3})([A-Z]+)(\d{1,9})$/, '$1-$2-$3');
              setRegistration(input);
            }}
            margin="normal"
            id="registration"
            label="Registration"
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
        </Stack>
        <Stack direction="row" useFlexGap spacing={2}>
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
        </Stack>

        <TextField
          value={vin}
          onChange={(e) => setVIN(e.target.value.toUpperCase())}
          margin="normal"
          id="vin"
          label="VIN"
          fullWidth
          variant="outlined"
        />

        <TextField
          style={{ marginTop: '15px' }}
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
      <div style={{ margin: '25px 0 0 50px' }}>
        <Input
          type="file"
          inputProps={{ accept: '.pdf,.jpg,.jpeg,.png' }}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          id="file-upload-input"
        />

        <label htmlFor="file-upload-input">
          <Button
            startIcon={<AttachFileIcon />}
            variant="contained"
            component="span"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'UPLOAD VRC'}
          </Button>
        </label>

        {file && (
          <Typography variant="body2" style={{ marginTop: 10 }}>
            {file.name}
          </Typography>
        )}
      </div>
      <DialogActions style={{ margin: '20px 45px' }}>
        <Tooltip title={props.edit ? 'Update' : 'Save'}>
          <Button
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={loading}
            onClick={handleSave}
          >
            {props.edit ? 'Update' : 'Save'}
          </Button>
        </Tooltip>
        <Tooltip title="Cancel">
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => props.callback('Cancel')}
          >
            Cancel
          </Button>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default AddVehicleService;
