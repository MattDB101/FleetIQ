import React from "react";
import GenericTable from "../../components/GenericTable"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react'

export default function Tax() {
  const collection = "tax" // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const {documents, error} = useCollection(collection)
  const currentDate = new Date();
  
  let props = {
    collection:collection, 
    documents: documents,
    error: error,
    title:"Tax",

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
        name: "Calibration Date",
        selector: (row) => {
          if (row.expiryDate){
            const expiryDate = new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
            return  <div className={expiryDate <= currentDate ? "overdue" : ""}>{new Intl.DateTimeFormat('en-GB').format(expiryDate)}</div>;
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

