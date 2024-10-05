import React from "react";
import GenericComplianceTable from "../../components/GenericComplianceTable"
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { Button } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useReducer, useEffect, useState } from 'react'
import OKDialog from "../../components/Dialogs/OKDialog";


export default function FireExtinguishers() {
  const collection = "fireextinguishers" // THIS IS WHERE THE TABLE NAME GOES
  const { user } = useAuthContext();
  const {documents, error} = useCollection(collection)
  const currentDate = new Date();

  let props = {
    collection: collection,
    documents: documents,
    error: error,
    title: "Fire Extinguishers",
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
        name: "Service Date (Valid for 1 year)",
        selector: (row) => {
          if (row.expiryDate) {
            return new Date(row.expiryDate.seconds * 1000); // Convert seconds to milliseconds
          }
          return null;
        },
        sortable: true,
        cell: (row) => {
          if (row.expiryDate) {
            const serviceDate = new Date(row.expiryDate.seconds * 1000);
            const expiryDate = new Date(serviceDate);
            expiryDate.setFullYear(serviceDate.getFullYear() + 1); // Set the full year correctly
            return (
              <div className={expiryDate <= currentDate ? "overdue" : ""}>
                {new Intl.DateTimeFormat('en-GB').format(serviceDate)}
              </div>
            );
          }
          return null;
        }
      },
    ],
  };
  
  return (
    <div>
      {documents && (
        <GenericComplianceTable {...props} />
      )}
    </div>
  );
}

