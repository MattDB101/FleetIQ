import { Dialog, DialogTitle, DialogActions, DialogContentText, TextField, Button, DialogContent, Tooltip } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import { makeStyles } from "@material-ui/core/styles";
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
import { useCollection } from "../../hooks/useCollection";

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
        display: 'flex'
    },
    dialogBox: {
        display: 'flex',
        alignItems: 'center'
    },
    dialogText: {
        flex: '0.4'
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
        marginBottom: theme.spacing(2)
    },
    weightRow: {
        display: 'flex',
        flexWrap: 'wrap'
    },

    input: {
        "& input.Mui-disabled": {
          color: "green"
        }

    },

}));

const defaultState = () => {
    return {
        name: "",
        serviceDate: "",
    }
}


const AddFEService= (props) => {
    const collection = "vehicles" // THIS IS WHERE THE TABLE NAME GOES
    const { user } = useAuthContext();
    const {documents, error} = useCollection(collection)

    const classes = useStyles();

    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [serviceDate, setServiceDate] = useState(new Date());

    const {addDocument, response} = useFirestore("vehicles/" + "0" + "/" + "fireExtinguisher")
    
    const handleVehicleChange = (event) => {
        setSelectedVehicle(event.target.value);
    };

    const handleChangeServiceDate = (newValue) => {
        setServiceDate(newValue);
    };

    const handleAdd = () => {
            let docToAdd = {
              selectedVehicle: selectedVehicle,
              serviceDate: serviceDate,
              addedBy: user.displayName
            };
            
            //addDocument(docToAdd);
            setServiceDate(new Date());
            props.callback("OK");
    }

    return (
        <div>
            <Dialog
                open={props.show}
                onClose={() => {}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle style={{margin:"30px", marginTop:"10px"}} id="alert-dialog-title">
                    {props.title}
                </DialogTitle>

                <div style={{margin:"0px 50px"}}>
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Vehicle Registration</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={""}
                        label="Vehicle"
                        onChange={handleVehicleChange}
                    >
                        {documents && documents.map((vehicle, index) => (
                                <MenuItem  value={vehicle.Registration}>{vehicle.Registration} </MenuItem>
                            ))
                        }
                    </Select>
                    </FormControl>
                        <br></br><br></br>
                        <div class="serviceDate">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>

                            <DesktopDatePicker
                                label={"Start Date"}
                                inputFormat="dd/MM/yyyy"
                                margin="normal" 
                                value={serviceDate}
                                defaultValue={props.edit ? props.selected.serviceDate : ""}
                                onChange={handleChangeServiceDate}
                                renderInput={(params) => <TextField {...params} />}
                            />

                            
                            </LocalizationProvider>
                            <div id="calenderDiv" ></div>
                        </div>

                </div>

                <DialogActions style={{marginTop: "20px", marginLeft: "70%", marginRight:"20px", marginBottom:"20px"}}>
                    <div>
                        <Tooltip title="Save">
                            <Button
                                style={{backgroundColor:"green", fontWeight:"bold", fontSize:"1rem", marginRight:"10px"}}
                                autofocus
                                onClick={() => handleAdd()}
                                size="large">
                                    Save 
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.dialogBox} style={{ display: 'flex', flex: '20%', marginRight:"20px"}}>
                        <Tooltip title="Cancel">
                            <Button
                                style={{backgroundColor:"red", fontWeight:"bold", fontSize:"1rem"}}
                                onClick={() => props.callback("Cancel")}
                                size="large">
                                    Cancel 
                            </Button>
                        </Tooltip>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddFEService;

//onClose = {(event, reason) => {
//    if (reason && reason == "backdropClick") return;
//    props.callback("Cancel")
//}}