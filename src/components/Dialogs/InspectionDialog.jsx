import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core';

const InspectionDialog = (props) => {
  return (
    <Dialog
      open={!!props.show}
      onClose={() => props.callback && props.callback('Cancel')}
    >
      <DialogTitle>{props.title || 'Inspection'}</DialogTitle>
      <DialogContent>{/* blank dialog content for now */}</DialogContent>
      <DialogActions>
        <Button
          id="cancelDialog"
          color="secondary"
          variant="outlined"
          onClick={() => props.callback && props.callback('Cancel')}
        >
          Cancel
        </Button>
        <Button
          id="submitDialog"
          color="primary"
          variant="contained"
          onClick={() => props.callback && props.callback('OK')}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InspectionDialog;
