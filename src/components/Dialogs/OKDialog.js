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
import { useTranslation } from 'react-i18next';
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
          <Alert severity={props.flavour}>{props.message}</Alert>
          <DialogContentText id="alert-dialog-description"></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
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
