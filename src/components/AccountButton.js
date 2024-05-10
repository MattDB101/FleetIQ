import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { useAuthContext } from '../hooks/useAuthContext';
import {useLogout} from '../hooks/useLogout'
import React from 'react';

const useStyles = makeStyles({
    icon: {
        fontSize: 30,
        color: 'white'
    }
})



function AccountButton(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user } = useAuthContext()
    const { logout } = useLogout()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const isLoggedIn = user

    const handleAccountClose = () => {
        setAnchorEl(null);
        logout()
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <AccountCircle className={classes.icon} />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleAccountClose}>Logout</MenuItem>
            </Menu>
        </Box>
    )
}

export default AccountButton;