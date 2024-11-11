import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
  DialogContent,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';

const OKDialog = (props) => {
  return (
    <div>
      <Dialog
        open={props.show}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ color: 'black' }}
            id="alert-dialog-description"
          >
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: '10px' }}
            onClick={() => props.callback('OK')}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OKDialog;

//onClose = {(event, reason) => {
//    if (reason && reason == "backdropClick") return;
//    props.callback("Cancel")
//}}
