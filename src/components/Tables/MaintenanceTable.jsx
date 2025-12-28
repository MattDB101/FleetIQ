import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import TableHeader from './TableHeader';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Card,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { pink, yellow } from '@material-ui/core/colors';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

const formatServiceDate = (row) => {
  if (!row || !row.serviceDate) return '';
  try {
    let d;
    if (row.serviceDate.seconds !== undefined)
      d = new Date(row.serviceDate.seconds * 1000);
    else if (row.serviceDate.toDate) d = row.serviceDate.toDate();
    else d = new Date(row.serviceDate);
    if (!d || Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      timeZone: 'UTC',
    });
  } catch (err) {
    return '';
  }
};

const useStyles = makeStyles((theme) => ({
  style: {
    background: '#fafafa',
    fontSize: '1rem',
    width: '100%',
    height: '100%',
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 400,
    lineHeight: 1.42857,
    textRendering: 'optimizeLegibility',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    columnGap: '1rem',
    paddingTop: '1rem',
    overflow: 'visible',
    marginBottom: '0.3rem',
    [theme.breakpoints.down(750)]: {
      display: 'none',
    },
  },
  selectedCount: {
    flex: '2 2 90%',
  },
  title: {
    flex: '1 1',
    whiteSpace: 'nowrap',
  },
  editButton: {
    backgroundColor: yellow[800],
    borderColor: yellow[800],
    color: 'white',
    '&:hover': {
      backgroundColor: yellow[900],
    },
  },
  filterButton: {
    backgroundColor: pink[600],
    borderColor: pink[600],
    color: 'white',
    '&:hover': {
      backgroundColor: pink[700],
    },
  },
  searchBar: {
    flex: '1 1 35%',
    [theme.breakpoints.down(1100)]: {
      flex: '1 1 45%',
    },
    '& label': {
      paddingRight: '25px',
      [theme.breakpoints.down(1100)]: {
        fontSize: '0.75rem',
      },
    },
  },
}));

const ExpandedComponent = ({ data }) => {
  const jobs = data?.jobs || [];
  if (!jobs || jobs.length === 0) {
    return (
      <Box style={{ padding: 12 }}>
        <Typography variant="body2">
          No jobs recorded for this maintenance entry.
        </Typography>
      </Box>
    );
  }

  return (
    <Box style={{ padding: 12 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Work Performed</TableCell>
            <TableCell>Parts Replaced</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Note</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((j, idx) => (
            <TableRow key={j.id || idx}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell style={{ maxWidth: 420, whiteSpace: 'pre-wrap' }}>
                {j.workPerformed || '—'}
              </TableCell>
              <TableCell style={{ maxWidth: 200, whiteSpace: 'pre-wrap' }}>
                {j.partsReplaced || '—'}
              </TableCell>
              <TableCell>{j.faultStatus || '—'}</TableCell>
              <TableCell style={{ maxWidth: 420, whiteSpace: 'pre-wrap' }}>
                {j.faultNote || '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default function MaintenanceTable({
  documents = [],
  onAdd,
  onEdit,
  onDelete,
}) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();

  const handleSelectedRows = (state) => {
    setSelectedRows(state.selectedRows || []);
  };

  const handleFilterTerm = (e) => setSearchTerm(e.target.value || '');

  const selectedItemText = () => {
    if (selectedRows.length === 0) return '';
    if (selectedRows.length === 1) return '1 row selected';
    return `${selectedRows.length} rows selected`;
  };

  const filterRows = () => {
    if (!searchTerm) return documents;
    const q = searchTerm.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    return (documents || []).filter((row) => {
      const reg = (row.registration || '')
        .toString()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '');
      return reg.includes(q);
    });
  };

  const columns = [
    {
      name: 'Service Date',
      selector: (row) => {
        try {
          if (!row || !row.serviceDate) return 0;
          if (row.serviceDate.seconds !== undefined)
            return row.serviceDate.seconds * 1000;
          if (row.serviceDate.toDate) return row.serviceDate.toDate().getTime();
          const d = new Date(row.serviceDate);
          return d.getTime() || 0;
        } catch (err) {
          return 0;
        }
      },
      cell: (row) => formatServiceDate(row),
      sortable: true,
      grow: 1,
    },
    {
      name: 'Registration',
      selector: (row) => row.registration,
      sortable: false,
      grow: 1,
    },
    {
      name: 'Odometer',
      selector: (row) => row.odometer,
      sortable: false,
      grow: 1,
    },
    {
      name: 'Technician',
      selector: (row) => row.technician || '',
      sortable: false,
      grow: 1,
    },
    {
      name: '',
      button: true,
      cell: (row) =>
        row.comment ? (
          <IconButton
            color="secondary"
            style={{ borderRadius: '5px', padding: '5px' }}
            onClick={() => {
              /* empty - parent may handle click via expandable row */
            }}
          >
            <NoteAltOutlinedIcon />
          </IconButton>
        ) : (
          ''
        ),
      sortable: false,
      width: '5%',
    },
  ];

  return (
    <div className={classes.style}>
      <Card>
        <Paper>
          <TableHeader
            title="Maintenance Records"
            selectedItemText={selectedItemText}
            searchColumn="registration"
            searchTerm={searchTerm}
            filterTerm={handleFilterTerm}
            handleAdd={() => (onAdd ? onAdd() : null)}
            handleDelete={() => (onDelete ? onDelete(selectedRows) : null)}
            handleEdit={() => (onEdit ? onEdit(selectedRows) : null)}
            handleFilter={() => {}}
            controlsDisabled={false}
            selectedRows={selectedRows}
            classes={classes}
          />

          <DataTable
            columns={columns}
            data={filterRows()}
            onSelectedRowsChange={handleSelectedRows}
            pagination
            paginationPerPage={25}
            paginationRowsPerPageOptions={[10, 25, 50]}
            striped
            expandableRows
            expandableRowsComponent={ExpandedComponent}
            selectableRows
          />
        </Paper>
      </Card>
    </div>
  );
}
