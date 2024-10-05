import React from "react";
import GenericComplianceTable from "../../components/GenericComplianceTable"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react'
import OKDialog from "../../components/Dialogs/OKDialog";


export default function FirstAid() {
  const collection = "firstaidkits" // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const {documents, error} = useCollection(collection)
  const currentDate = new Date();

  let props = {
    collection:collection, 
    documents: documents,
    error: error,
    title:"First Aid",
    sortField: 2,
    sortAsc: true,

    keyColumn:[{
      key: "registration",
      name: "Registration"
    }],
    
    columns: [
      {
        name: "Registration",
        selector: (row) => row.registration,
        sortable: true
      },
      {
        name: "Expiration Date",
        selector: (row) => row.expiryDate,  // Only pass expiryDate here
        sortable: true,
      },
    ],
  }
    return (
      
    <div>
      {documents && (
        <GenericComplianceTable {...props} />
      )}
    </div>
    )
}

