import React from "react";
import GenericTable from "../../components/GenericTable"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react'
import OKDialog from "../../components/Dialogs/OKDialog";


export default function FirstAid() {
  const collection = "firstaid" // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const {documents, error} = useCollection(collection)

  let props = {
    collection:collection, 
    documents: documents,
    error: error,
    title:"First Aid",

    keyColumn:[{
        key: "Registration",
        name: "Reg"
    }],
      
    columns: [
      {
        name: "Registration",
        selector: (row) => row.registration,
        sortable: true
      },
      {
        name: "Service Date",
        selector: (row) => {
          if (row.serviceDate){
            const serviceDate = new Date(row.serviceDate.seconds * 1000); // Convert seconds to milliseconds
            return new Intl.DateTimeFormat('en-GB').format(serviceDate);
          }
        },
        sortable: true
      },

      
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

