import React from 'react';
import { Box, Typography, TextField, Button, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

export default function TableHeader({
  title,
  selectedItemText,
  searchColumn,
  searchTerm,
  filterTerm,
  handleAdd,
  handleDelete,
  handleEdit,
  handleFilter,
  controlsDisabled,
  selectedRows,
  classes,
}) {
  return (
    <Box mx={2} className={classes.tableHeader}>
      <Typography
        className={classes.title}
        style={{ fontWeight: 400, fontSize: '1.25rem' }}
      >
        {title}
      </Typography>

      <Typography
        className={classes.selectedCount}
        style={{ color: 'grey', fontSize: '.9rem' }}
      >
        {selectedItemText()}
      </Typography>
      <div className={classes.searchBar}>
        <TextField
          label={`Search by ${searchColumn}`}
          id="outlined-size-small"
          style={{ minWidth: '120px' }}
          value={searchTerm}
          onChange={filterTerm}
          variant="outlined"
          fullWidth
          size="small"
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'right',
          flex: '30%',
        }}
      >
        <Tooltip title={'Add Record'}>
          <Button
            style={{ marginLeft: '10px' }}
            disabled={controlsDisabled}
            variant="contained"
            size="small"
            color="primary"
            onClick={handleAdd}
            aria-label="add"
            startIcon={<AddIcon style={{ marginLeft: '30%' }} />}
          ></Button>
        </Tooltip>

        <Tooltip title="Delete Record(s)">
          <span disabled={selectedRows.length === 0 || controlsDisabled}>
            <Button
              style={{ marginLeft: '10px' }}
              disabled={selectedRows.length === 0 || controlsDisabled}
              size="small"
              onClick={handleDelete}
              aria-label="delete"
              variant="contained"
              color="secondary"
              startIcon={<DeleteIcon style={{ marginLeft: '30%' }} />}
            ></Button>
          </span>
        </Tooltip>

        <Tooltip title="Edit Record">
          <span disabled={selectedRows.length !== 1 || controlsDisabled}>
            <Button
              disabled={selectedRows.length !== 1 || controlsDisabled}
              style={{ marginLeft: '10px' }}
              size="small"
              className={classes.editButton}
              onClick={handleEdit}
              startIcon={<EditIcon style={{ marginLeft: '30%' }} />}
              aria-label="edit"
              variant="contained"
            ></Button>
          </span>
        </Tooltip>

        <Tooltip title="Filter Records">
          <Button
            disabled={true}
            style={{ marginLeft: '10px' }}
            variant="contained"
            size="small"
            onClick={handleFilter}
            className={classes.filterButton}
            aria-label="add"
            startIcon={<FilterListIcon style={{ marginLeft: '30%' }} />}
          ></Button>
        </Tooltip>
      </div>
    </Box>
  );
}
