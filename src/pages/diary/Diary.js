import React from "react";
import DiaryTable from "../../components/DiaryTable"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore"
import { useState } from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Box, Button, Tooltip, TextField } from "@material-ui/core";
import AssignmentIcon from '@material-ui/icons/Assignment';


export default function Diary() {
  const months =  ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const { user } = useAuthContext();
  const [value, setValue] = useState(new Date());
  const [year, setYear] = useState(new Date().getFullYear());
  const collection = "diary/" + value.getFullYear() + "/"+ months[value.getMonth()] // THIS IS WHERE THE TABLE NAME GOES
  const {addDocument, response} = useFirestore(collection)
  

  var {documents, error} = useCollection(collection)

  let props = {
    collection:collection, 
    documents: documents,
    year: year,
    error: error,
    title:"Diary | " + months[value.getMonth()] + " " + value.getFullYear(),

    keyColumn:[{
        key: "client",
        name: "Client"
    }],
      
    columns: [
      {
        name: "Client",
        selector: (row) => row.client ? <Tooltip title={row.client} placement="top"><span>{row.client}</span></Tooltip>: "-",
        sortable: true,
        //flex:3
      },
      {
        name: "Start Date",
        selector: (row) => {
          if (row.startDate){
            const startDate = new Date(row.startDate.seconds * 1000); // Convert seconds to milliseconds
            return new Intl.DateTimeFormat('en-GB').format(startDate);
          }
        },
        sortable: true,
        maxWidth: "110px",
        
      },
      {
        name: "End Date",
        selector: (row) => {
          if (row.endDate){
            const endDate = new Date(row.endDate.seconds * 1000); // Convert seconds to milliseconds
            return new Intl.DateTimeFormat('en-GB').format(endDate);
          }
        },
        sortable: true,
        maxWidth: "110px",
        
      },
      {
        name: "Days",
        selector: (row) => row.days ? row.days : "-",
        sortable: true,
        maxWidth: "10px",
      },
      {
        name: "Contact Details",
        selector: (row) => row.contactDetails ? <Tooltip title={row.contactDetails} placement="top"><span>{row.contactDetails}</span></Tooltip>: "-",
        sortable: false,
        minWidth: "200px",
      },
      {
        name: "Departing",
        selector: (row) => row.departing ? <Tooltip title={row.departing} placement="top"><span>{row.departing}</span></Tooltip>: "-",
        sortable: false,
      },
      {
        name: "Destination",
        selector: (row) => row.destination ? <Tooltip title={row.destination} placement="top"><span>{row.destination}</span></Tooltip>: "-",
        sortable: false,
      },
      {
        name: "Depart Time",
        selector: (row) => row.departTime ? row.departTime : "-",
        sortable: false,
        maxWidth: "105px"
      },
      {
        name: "Return Time",
        selector: (row) => row.returnTime ? row.returnTime : "-",
        sortable: false,
        maxWidth: "105px"
      },
      {
        name: "PAX",
        selector: (row) => row.pax ? row.pax : "-",
        sortable: false,
        maxWidth: "10px",
      },
      {
        name: "Quoted",
        selector: (row) => row.quote ? <Tooltip title={row.quote} placement="top"><span>{row.quote}</span></Tooltip>: "-",
        sortable: false,
        maxWidth: "10px",
      },

      {
        name: "More Info",
        cell: (row) => (
            <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => alert("More Info: \n"+row.comment)}
                aria-label="More Info"
                startIcon={ <AssignmentIcon style={{marginLeft: "25%"}}/> }
                >
            </Button>
        ),
        maxWidth: "110px",
        sortable: false,
      },
      {
        name: "Recorded By",
        selector: (row) => row.addedBy ? row.addedBy : "-",
        sortable: false,
        maxWidth: "150px",
      },
      {
        name: "Recorded At",
        selector: (row) => row.recordedAt ? row.recordedAt : "-",
        sortable: true,
        maxWidth: "160px",
    },
    ],
  }
    return (
    <div>
      {documents && (
          
        <>
        <div style={{ maxWidth: "300px", marginBottom: "30px", marginTop: "30px", marginLeft: "10px"}}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year', 'month']}
                openTo={'month'}
                label="Viewing Month"
                value={value}
                style={{maxWidth:"200px"}}
                onChange={(newValue) => {
                  setValue(newValue);
                  setYear(newValue.getFullYear());
                  console.log(collection)
                } }
                renderInput={(params) => <TextField {...params} helperText={null} />} />
            </LocalizationProvider>
          </div>

          <DiaryTable {...props} />
          </>
        
      )}
    </div>
    )
}

