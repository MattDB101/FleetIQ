import React from "react";
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import Card from "@material-ui/core/Card";
import SortIcon from "@material-ui/icons/ArrowDownward";
import { Typography } from "@material-ui/core";
import { Box, Button, Tooltip, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { pink, yellow } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect, useContext } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useFirestore } from "../hooks/useFirestore";
import VehicleDialog from "./Dialogs/VehicleDialog";
import GenericDialog from "./Dialogs/GenericDialog";

const useStyles = makeStyles((theme) => ({

    style: {
      background: "#fafafa",
      fontSize: "1rem",
      width: "100%",
      height: "100%",
      fontFamily: "Roboto, sans-serif",
      fontWeight: 400,
      lineHeight: 1.42857,
      textRendering: "optimizeLegibility",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },

    root: {
        width: "100%",
        marginBottom: theme.spacing(2),
    },
    
    paper: {
        marginBottom: theme.spacing(2),
    },

    table: {
        minWidth: 750,
    },

    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
    },

    tableHeader: {
        display: "flex",
        alignItems: "center",
        columnGap: "1rem",
        paddingTop: "1rem",
        overflow: "visible",
        marginBottom: "0.3rem",
    },

    selectedCount: {
        flex: "2 2 90%",
    },

    title: {
        flex: "1 1",
        whiteSpace: "nowrap",
    },

    editButton: {
        backgroundColor: yellow[800],
        borderColor: yellow[800],
        color: "white",
        "&:hover": {
            backgroundColor: yellow[900],
        },
    },

    filterButton: {

        backgroundColor: pink[600],
        borderColor: pink[600],
        color: "white",
        "&:hover": {
            backgroundColor: pink[700],
        },
    },

    searchBar: {
        flex: "1 1 30%",
    },

  }));

function sortByRecent( a, b ) {
    if ( a.createdAt.seconds < b.createdAt.seconds){
        return 1;
    }

    if ( a.createdAt.seconds > b.createdAt.seconds){
        return -1;
    }

    return 0;
}

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    var offset = (t.getTimezoneOffset())*-1
    secs+= offset*60
    t.setSeconds(secs);

    var DD = t.toString().slice(7,10)
    var MM = t.toString().slice(4,7)
    var YY = t.toString().slice(13,16)
    var dateString = DD + "-" + MM + "-" + YY
    var timeString = t.toString().slice(16,21);
    var timeDateString = timeString + "  " + dateString
    return timeDateString;
}


export default function GenericComplianceTable(props) {

    const classes = useStyles();
    const [controlsDisabled, setControlsDisabled] = useState(false)
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const [columnFilters, setColumnFilters] = useState({});
    const {addDocument, deleteDocument, response} = useFirestore(props.collection)
    const docToAdd = props.docToAdd

    const currentDate = new Date();
    const warningThreshold = new Date(); // Create a new date object for 30-day warning
    warningThreshold.setDate(currentDate.getDate() + 30); // Add 30 days to the current date
  
    const filterTerm = (event) => setSearchTerm(event.target.value);

    const [taxDialogState, setTaxDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [fireExDialogState, setFireExDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [firstAidDialogState, setFirstAidDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [CVRTDialogState, setCVRTDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [PSVDialogState, setPSVDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [RTOLDialogState, setRTOLDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [vehicleDialogState, setVehicleDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })

    const [tachoCalibrationDialogState, setTachoCalibrationDialogState] = useState({
        shown: false, title: "", message: "", flavour: "success"
    })
        
    const handleDelete = () => {
        if (selectedRows.length == 1) {
            if (window.confirm("Are you sure you want to delete this row?")) {
                setToggleCleared(!toggleCleared);
                deleteDocument(selectedRows[0].id)
                selectedRows.length = 0;
            }
        } else {
            var confirm = prompt("Please enter \"CONFIRM\" to delete these rows. \nWARNING: This cannot be undone!",);
            if (confirm && confirm.toLowerCase() === "confirm") {
                console.log("multidelete")
                setToggleCleared(!toggleCleared);
                for (let i = 0; i < selectedRows.length; i++) {
                    deleteDocument(selectedRows[i].id)
                }
                selectedRows.length = 0;
            }   
        }
    }
    const handleAdd = () => {
        console.log(props.title)
        switch(props.title) {
            case "Fire Extinguishers":
                setFireExDialogState({shown: true, title:"Record Fire Extinguisher Service", message: "fireextinguishers", flavour: "success"})
                break;
            
            case "First Aid":
                setFirstAidDialogState({shown: true, title:"Record First Aid Expiration", message: "firstaid", flavour: "success"})
                break;

            case "Tachograph Calibration":
                setTachoCalibrationDialogState({shown: true, title:"Record Tachograph Calibration", message: "tachocalibration", flavour: "success"})
                break;

            case "Tax":
                setTaxDialogState({shown: true, title:"Record Vehicle Tax Expiration", message: "tax", flavour: "success"})
                break;

            case "PSV":
                setPSVDialogState({shown: true, title:"Record Vehicle PSV Inspection Expiration", message: "psv", flavour: "success"})
                break;
                
            case "RTOL":
                setRTOLDialogState({shown: true, title:"Record Vehicle RTOL Expiration", message: "rtol", flavour: "success"})
                break;
                        
            case "CVRT":
                setCVRTDialogState({shown: true, title:"Record CVRT Expiration", message: "cvrt", flavour: "success"})
                break;      

            case "Add Vehicle":
                setVehicleDialogState({shown: true, title:"Add a Vehicle To Fleet", message: "vehicle", flavour: "success"})
                break;
        }
    }


    const handleEdit = () => {
        console.log(selectedRows[0])
    };

    const handleFilter = () => {
        console.log(props.documents)
    };

    const selectedItemText = () => {
        if (selectedRows.length === 0) return "";
        if (selectedRows.length === 1) return "1 row selected";
        if (selectedRows.length > 1 && selectedRows.length < props.documents.length)
            return `${selectedRows.length} ${("rows selected")}`;
        if (selectedRows.length === props.documents.length) return ("All rows selected");

        return "";
    };

    const rangeFilter = (greaterThan, value, lessThan) => {
        if (value >= greaterThan && value <= lessThan) return true;

        return false;
    };
    const renderExpiryDateCell = (row) => {
        if (row.expiryDate) {
            const expiryDate = new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
            const isOverdue = expiryDate <= currentDate;
            const isWarning = expiryDate > currentDate && expiryDate <= warningThreshold;

            // Apply class based on the condition
            let className = '';
            if (isOverdue) {
            className = 'overdue';
            } else if (isWarning) {
            className = 'overdue-warning';
            }

            return (
            <div className={className}>
                {new Intl.DateTimeFormat('en-GB').format(expiryDate)}
            </div>
            );
        }
        return null;
    };
    
    const updatedColumns = props.columns.map((col) => {
        if (col.name === "Expiration Date") { // Relying on the column name not to change!! (does also allow for custome classes such as with Fire Extinguishers by not using set name.)
            return {
            ...col,
            cell: renderExpiryDateCell,  // Use the custom cell renderer defined above
            };
        }
        return col;
    });
    

    const filterRows = () => {
        // props.documents.sort(sortByRecent)

        // for (let i = 0; i < props.documents.length; i++) {
        //     props.documents[i].recordedAt=toDateTime(props.documents[i].createdAt.seconds)
        // }
        // console.log(props.documents[0])

        let res = props.documents.filter((row) => {
            if (!`${row[props.keyColumn[0].key]}`.toLowerCase().includes(searchTerm.toLowerCase()))
                return false;

            let isValid = true;

            Object.keys(columnFilters).forEach((filterKey) => {
                let filter = columnFilters[filterKey];
                if (!filter.enabled) return;

                if (filter.type === "text") {

                    if (!`${row[filterKey]}`.toLowerCase().includes(filter.filterValue.includes.toLowerCase())) {
                        isValid = false;
                    }
                    return;

                } else if (filter.type === "numeric") {
                    if (
                        !rangeFilter (
                            filter.filterValue.greaterThan,
                            row[filterKey],
                            filter.filterValue.lessThan
                        )
                    )
                        isValid = false;
                    return;

                } else if (filter.type === "date") {
                    if (
                        !rangeFilter(
                            filter.filterValue.from,
                            new Date(row[filterKey]),
                            filter.filterValue.to
                        )
                    )
                        isValid = false;
                    return;
                }
            });

            return isValid;
        });
        return res;
    };

    return (
        <div className={classes.style}>
        <Card>
        <Paper>
                    <Box mx={2} className={classes.tableHeader}>
                        <Typography
                            className={classes.title}
                            style={{ fontWeight: 400, fontSize: "1.25rem" }}
                        >
                            {props.title}
                        </Typography>

                        <Typography
                            className={classes.selectedCount}
                            style={{ color: "grey", fontSize: ".9rem" }}
                        >
                            {selectedItemText()}
                        </Typography>
                        <div className={classes.searchBar}>
                            <TextField
                                label={`${"Search by"} ${props.keyColumn[0].name}`}
                                id="outlined-size-small"
                                style={{minWidth:"120px"}}
                                value={searchTerm}
                                onChange={filterTerm}
                                variant="outlined"
                                fullWidth
                                size="small"
                                //dense
                            />
                        </div>


            <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'right', flex: '30%' }}>

                <Tooltip title={"Add Record"}>
                    <Button
                        style={{marginLeft:"10px"}}
                        disabled={controlsDisabled}
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => { handleAdd()}}
                        aria-label="add"
                        startIcon={<AddIcon style={{ marginLeft: "30%" }} />}
                    >
                    </Button>
                </Tooltip>

                <Tooltip title="Delete Record(s)">
                <span disabled={selectedRows.length === 0 || controlsDisabled}>
                    <Button
                        style={{marginLeft:"10px"}}
                        disabled={selectedRows.length === 0 || controlsDisabled}
                        size="small"
                        onClick={() => { handleDelete()}}
                        aria-label="delete"
                        variant="contained"
                        color="secondary"
                        startIcon={<DeleteIcon style={{ marginLeft: "30%" }} />}
                    >
                    </Button>
                </span>
            </Tooltip>

            <Tooltip title="Filter Records">
                <Button
                    style={{marginLeft:"10px"}}
                    variant="contained"
                    size="small"
                    onClick={() => { handleFilter()}}
                    className={classes.filterButton}
                    aria-label="add"
                    startIcon={<FilterListIcon style={{ marginLeft: "30%" }} />}
                >
                </Button>
            </Tooltip>

            <Tooltip title="Edit Record">
            <span disabled={selectedRows.length === 0 || controlsDisabled}>
                    <Button
                        disabled={selectedRows.length === 0 || controlsDisabled}
                        style={{marginLeft:"10px"}}
                        size="small"
                        className={classes.editButton}
                        onClick={() => { handleEdit()}}
                        startIcon={<EditIcon style={{ marginLeft: "30%" }} />}
                        aria-label="edit"
                        variant="contained"
                    >
                    </Button>
                </span>
            </Tooltip>
            </div>
            </Box>    
            <DataTable
                columns={updatedColumns}
                onSelectedRowsChange={(e) => setSelectedRows(e.selectedRows)}
                data={filterRows()}
                sortIcon={<SortIcon />}
                defaultSortFieldId={props.sortField}
                defaultSortAsc={props.sortAsc}
                pagination
                clearSelectedRows={toggleCleared}
                selectableRows
                striped
            />

            <VehicleDialog
                show={vehicleDialogState.shown}
                title={vehicleDialogState.title}
                collection={"vehicles"}
                message={vehicleDialogState.message}
                flavour={vehicleDialogState.flavour}
                callback={
                    (res) => {
                        let callback = vehicleDialogState.callback;
                        setVehicleDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            /> 

            <GenericDialog
                show={fireExDialogState.shown}
                collection={"fireextinguishers"}
                tableRows={props.documents}
                title={fireExDialogState.title}
                message={fireExDialogState.message}
                flavour={fireExDialogState.flavour}
                callback={
                    (res) => {
                        let callback = fireExDialogState.callback;
                        setFireExDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />

            <GenericDialog
                show={firstAidDialogState.shown}
                collection={"firstaidkits"}
                tableRows={props.documents}
                title={firstAidDialogState.title}
                message={firstAidDialogState.message}
                flavour={firstAidDialogState.flavour}
                callback={
                    (res) => {
                        let callback = firstAidDialogState.callback;
                        setFirstAidDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />

            <GenericDialog
                show={PSVDialogState.shown}
                collection={"psvs"}
                tableRows={props.documents}
                title={PSVDialogState.title}
                message={PSVDialogState.message}
                flavour={PSVDialogState.flavour}
                callback={
                    (res) => {
                        let callback = PSVDialogState.callback;
                        setPSVDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />

            <GenericDialog
                show={CVRTDialogState.shown}
                collection={"cvrts"}
                tableRows={props.documents}
                title={CVRTDialogState.title}
                message={CVRTDialogState.message}
                flavour={CVRTDialogState.flavour}
                callback={
                    (res) => {
                        let callback = CVRTDialogState.callback;
                        setCVRTDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />
        
            <GenericDialog
                show={RTOLDialogState.shown}
                collection={"rtols"}
                title={RTOLDialogState.title}
                tableRows={props.documents}
                message={RTOLDialogState.message}
                flavour={RTOLDialogState.flavour}
                callback={
                    (res) => {
                        let callback = RTOLDialogState.callback;
                        setRTOLDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />
            
            <GenericDialog
                show={taxDialogState.shown}
                collection={"taxes"}
                tableRows={props.documents}
                title={taxDialogState.title}
                message={taxDialogState.message}
                flavour={taxDialogState.flavour}
                callback={
                    (res) => {
                        let callback = taxDialogState.callback;
                        setTaxDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />

            <GenericDialog
                show={tachoCalibrationDialogState.shown}
                collection={"tachocalibrations"}
                tableRows={props.documents}
                title={tachoCalibrationDialogState.title}
                message={tachoCalibrationDialogState.message}
                flavour={tachoCalibrationDialogState.flavour}
                callback={
                    (res) => {
                        let callback = tachoCalibrationDialogState.callback;
                        setTachoCalibrationDialogState({ shown: false });
                        if (callback) callback(res);
                    }
                }
            />


            <Typography
                className={classes.title}
                style={{ color: "Red", fontSize: "1.25rem", marginLeft: "20px"}}
            >
                {props.error}
            </Typography>

            </Paper>
        </Card>
        </div>
    );
}

