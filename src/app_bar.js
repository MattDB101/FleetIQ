import React, { useState } from 'react';
import { useAuthContext } from './hooks/useAuthContext';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink, useLocation, Link as RouterLink } from 'react-router-dom';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import navLinks from './components/NavLinks';
import AccountButton from './components/AccountButton';
import { Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: "100vw",
    height: "100vh",
    "&$expanded": {
      margin: "auto"
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    flexShrink: 0,
  },
  activeDrawerPaper: {
    width: 250,
  },
  inactiveDrawerPaper: {
    width: 0,
  },
  drawerContainer: {
    marginTop: "5px",
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
    justifyContent: "space-between",
  },
  accordionSummary: {
    backgroundColor: theme.palette.action.hover,
  },
  accordionDetails: {
    padding: 0,
    '& > div': {
      width: '100%',
    },
  },
  navLink: {
    display: 'inline-block',
    minWidth: "100%",
    marginBottom: "10px",
    color: "black",
    textDecoration: "none",
    '&.active': {
      backgroundColor: '#ADCBE5',
      color: 'black',
      fontWeight: "bold",
      textDecoration: "underline",
    },
  },
  activeAccordionSummary: {
    textDecoration: 'underline',
  },
  breadcrumbs: {
    color: theme.palette.common.white,
    textDecoration: 'none',
    '& a': {
      color: theme.palette.common.white,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));



const generatePathNameMap = (navLinks) => {
  const pathNameMap = {};

  Object.values(navLinks).forEach(category => {
    pathNameMap[category.heading] = {
      text: category.heading,
      links: {},
    };

    Object.values(category.links).forEach(link => {
      pathNameMap[category.heading].links[link.path] = link.text;
    });
  });

  return pathNameMap;
};

export default function ClippedDrawer(props) {
  const classes = useStyles();
  const categories = navLinks();
  const { user } = useAuthContext();
  const [isActive, setIsActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const pathNameMap = generatePathNameMap(categories);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function renderNavLink(link) {
    return (
      <div className='MuiNavlink-root'>
        <NavLink
          to={link.path}
          exact={true}
          className={classes.navLink}
        >
          <div>
            <Grid container direction="row" alignItems="center">
              <Grid item>
                <span style={{ marginLeft: "20px" }}>{link.icon}</span>
              </Grid>
              <Grid item>
                <span style={{ marginLeft: "10px" }}>{link.text}</span>
              </Grid>
            </Grid>
          </div>
        </NavLink>
      </div>
    );
  }

  function renderAccordion(categoryKey, category) {
    const isActiveCategory = Object.values(category.links).some(link => location.pathname.includes(link.path));
    return (
      <Accordion
        style={{ margin: '1px' }}
        key={categoryKey}
        expanded={expanded === categoryKey}
        onChange={handleChange(categoryKey)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={`${classes.accordionSummary} ${isActiveCategory ? classes.activeAccordionSummary : ''}`}
        >
          <Grid container direction="row" alignItems="center">
            <Grid item style={{ marginRight: "10px" }}>{category.icon}</Grid>
            <Grid style={{ fontSize: "16px" }} item>{category.heading}</Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <div>
            {Object.values(category.links).map((link, linkIndex) => (
              <React.Fragment key={linkIndex}>
                {renderNavLink(link)}
              </React.Fragment>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }

  function renderCategory(categoryKey, category) {
    if (Object.keys(category.links).length === 1) {
      return renderNavLink(Object.values(category.links)[0]); // 1 child, don't use accordion menu
    } else {
      return renderAccordion(categoryKey, category); // > 1 child, use accordion menu
    }
  }

  function renderBreadcrumbs() {
    const pathnames = location.pathname.split('/').filter(x => x);
    let breadcrumbs = [];

    Object.keys(categories).forEach((categoryKey) => {
      const category = categories[categoryKey];
      Object.values(category.links).forEach((link) => {
        if (location.pathname.includes(link.path)) {
          breadcrumbs.push(
            <Typography key={category.heading} >
              {category.heading}
            </Typography>);
            if (category.heading !== link.text) {
              breadcrumbs.push(
                <Typography key={link.path} >
                {link.text}
              </Typography>);
            }
        }
      });
    });

    return (
      <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumbs}>
        {breadcrumbs}
      </Breadcrumbs>
    );
  }

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
          <Typography
            style={{ marginRight: "auto" }}
            variant="h6"
            noWrap
            className={classes.pointer}
            onClick={event => window.location.href = '/'}
          >
            FleetIQ
          </Typography>
          <Typography
            style={{ marginRight: "auto" }}
            variant="h6"
            noWrap
            className={classes.pointer}
            onClick={event => window.location.href = '/'}
          >{renderBreadcrumbs()}
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
            width: isActive ? 250 : 0,
            transition: 'width 0.1s',
          }}
          variant="permanent"
          classes={{
            paper: `${isActive ? classes.activeDrawerPaper : classes.inactiveDrawerPaper}`,
          }}
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            {Object.keys(categories).map((categoryKey, index) => (
              <React.Fragment key={index}>
                {renderCategory(categoryKey, categories[categoryKey])}
              </React.Fragment>
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