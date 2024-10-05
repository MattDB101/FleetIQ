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
import { enGB } from "date-fns/locale"; 

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
        expiryDate: "",
    }
}


const AddService= (props) => {
    const collection = "vehicles" // THIS IS WHERE THE TABLE NAME GOES
    const { user } = useAuthContext();
    const {documents, error} = useCollection(collection)

    const classes = useStyles();
    const [selectedVehicleInvalid, setSelectedVehicleInvalid] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState({id:0});
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [tableRegistrations, setTableRegistrations] = useState([]);

    useEffect(() => {
    if (props.tableRows && props.tableRows.length > 0) { // store the reg's that are already on the table to hide them from the reg dropdown.
        const registrations = props.tableRows.map(row => row.registration);
        setTableRegistrations(registrations);
    }
    }, [props.tableRows]);

    const {addDocument, response} = useFirestore(props.collection + "/");
    
    const handleVehicleChange = (event) => {
        setSelectedVehicle(event.target.value);
    };

    const handleChangeServiceDate = (newValue) => {
        setExpiryDate(newValue);
    };

    const validateForm = () => {
        const isVehicleSelected = selectedVehicle && selectedVehicle.id !== 0;
        setSelectedVehicleInvalid(!isVehicleSelected);
        return isVehicleSelected;
    };

    const handleAdd = () => {
        if (validateForm()) {
            const docToAdd = {
                registration: selectedVehicle.registration,
                expiryDate: expiryDate,
            };

            addDocument(docToAdd);
            setExpiryDate(new Date());
            setSelectedVehicle({id:0})
            props.callback("OK");
        }
    };

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
                    <InputLabel id="vehicleSelectLabel">Vehicle</InputLabel>
                    <Select
                        labelId="vehicleSelectLabel"
                        id="vehicleSelect"
                        error={selectedVehicleInvalid}
                        value={selectedVehicle}
                        label="Vehicle"
                        onChange={handleVehicleChange}
                    >
                        {documents && documents.filter(vehicle => !tableRegistrations.includes(vehicle.registration)).length > 0 ? (
                        documents
                            .filter(vehicle => !tableRegistrations.includes(vehicle.registration)) // Filter out vehicles already in the registrations array
                            .map((vehicle, index) => (
                            <MenuItem key={index} value={vehicle}>
                                {vehicle.registration}
                            </MenuItem>
                            ))
                        ) : (
                        <MenuItem disabled>All registrations in use</MenuItem> // Disabled message when all registrations are in use
                        )}
                    </Select>
                </FormControl>

                        <br></br><br></br>
                    <div class="expiryDate">
                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>

                        <DesktopDatePicker
                            label={"Expiration Date"}
                            inputFormat="dd/MM/yyyy"
                            margin="normal" 
                            value={expiryDate}
                            defaultValue={props.edit ? props.selected.expiryDate : ""}
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
                                style={{backgroundColor:"green", color:"white", fontSize:"1rem", marginRight:"10px"}}
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
                                style={{backgroundColor:"red", color:"white", fontSize:"1rem"}}
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

export default AddService;

//onClose = {(event, reason) => {
//    if (reason && reason == "backdropClick") return;
//    props.callback("Cancel")
//}}