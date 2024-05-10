import React from 'react';
import {useState} from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link , NavLink} from 'react-router-dom';
import navLinks from './components/paths';
import AccountButton from './components/AccountButton';
import { ListItemIcon } from '@material-ui/core';
import { Box, Grid , Button} from '@material-ui/core';

const defaultProps = {
  bgcolor: 'background.paper',
  m: 1,
  style: { width: '25rem', height: '20rem' },
  borderColor: 'text.primary',
  marginLeft: '50px',
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: "100vw",
    height: "100vh"
  },
  appBar: {
      zIndex: theme.zIndex.drawer + 1,
   //   backgroundColor: '#ADCBE5',
    //  color: "black",
      
     // border: "1px solid"
  },
  drawer: {
    flexShrink: 0,
  },
  activeDrawerPaper:{
    width: 220,
  },
  inactiveDrawerPaper:{
    width: 0,
  },
  drawerContainer: {
    marginTop:"20px",
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: '4rem',
  },
  pointer: {
    cursor: "pointer",
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-between"
  }
}));

export default function ClippedDrawer(props) {
  const classes = useStyles();
  const links = navLinks();
  const { user } = useAuthContext();
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setIsActive(current => !current)}
        >
          <MenuIcon />
        </IconButton>

          <Typography style = {{marginRight: "auto"}} variant="h6" noWrap className={classes.pointer} onClick={event =>  window.location.href='/'}>
            Caha Coaches Record System
          </Typography>
          {user && (
            <h3>{user.displayName}</h3>
          )}
          {user && (
            <AccountButton />
          )}
        </Toolbar>
      </AppBar>
      {user && (
        <Drawer
          className={classes.drawer}
          style={{
            width: isActive ? 220 : 0,
            transition: 'width 0.1s',
          }}
          variant="permanent"
          classes={{paper: `${isActive ? classes.activeDrawerPaper : classes.inactiveDrawerPaper}`,         
          }}
        >

          <Toolbar />
          <div className={classes.drawerContainer}>
            
              {Object.keys(links).map((key, index) => (
                  <NavLink key={index} to={links[key].path} exact={true}
                      style={{ display: 'inline-block', minWidth: "100%",  marginBottom: "10px", color: "black", textDecoration: "none" }}
                      activeStyle={{ backgroundColor: '#ADCBE5', color: 'black', fontWeight: "bold" }}>
                        <div style={{  fontSize: "16px" }}>
                          <Grid container direction="row" alignItems="center"  >
                              <Grid item style={{marginTop:"6px"}}><span style={{ marginLeft: "20px" }}>{links[key].icon}</span></Grid>
                              <Grid item><span style={{ marginLeft: "10px" }}> {links[key].text} </span></Grid>
                          </Grid>
                        </div>
                  </NavLink>
              ))}
            
          </div>
        </Drawer>
      )}
      <main className={classes.content}>
        {props.children}
      </main>
    </div>

  );
}
