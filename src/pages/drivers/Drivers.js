import React from "react";
import GenericTable from "../../components/GenericTable"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react'
import OKDialog from "../../components/Dialogs/OKDialog";


export default function Drivers() {
  const collection = "drivers" // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const {documents, error} = useCollection(collection)

  let props = {
    collection:collection, 
    documents: documents,
    docToAdd: {Name:"Matthew Byrne", DOB:"13/09/00", addedBy: user.displayName},
    error: error,
    title:"Drivers",

    keyColumn:[{
        key: "Name",
        name: "Name"
    }],
      
    columns: [
      {
        name: "Name",
        selector: (row) => row.Name,
        sortable: true
      },
      // {
      //   name: "More Info",
      //   cell: (row) => (
      //       <Button
      //           variant="contained"
      //           size="small"
      //           color="primary"
      //           onClick={() => console.log("")}
      //           aria-label="add"
      //           startIcon={ <AssignmentIcon style={{marginLeft: "25%"}}/> }
      //           >
      //       </Button>
      //   ),
      //   sortable: false,
      // },
      // {
      //   name: "Time/Date Recorded",
      //   selector: (row) => row.recordedAt,
      //   sortable: true
      // },
      
    ],
  }
    return (
      
    <div>
      {documents && (
        <GenericTable {...props} />
      )}
    </div>
    )
}

