//yes this is very ugly i know

import * as React from "react";
import { Link, Routes, Route } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from '@mui/material/styles';

import Switch from '@mui/material/Switch';
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import jwt_decode from "jwt-decode"

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const label = { inputProps: { 'aria-label': 'Darkmode Toggle' } };

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: "hidden"
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
  })
}));

export default function MiniDrawer(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState({})
  React.useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "543204222025-vu2ci05c2kei4pcspud0pi81peddd2tf.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('signIn'),
      { theme: "", size: "large", shape: 'pill', type: "icon" }
    )
  }, [])
  const handleToggle = (e) => {
    e.target.checked ? props.setter(darkTheme) : props.setter(lightTheme)
  }
  const handleCallbackResponse = (res) => {
    const user = jwt_decode(res.credential)
    setUser(user)
    document.querySelector('#signIn').hidden = true
  }

  const handleSignOut = (e) => {
    setUser({})
    document.querySelector('#signIn').hidden = false
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" })
            }}
          >
          
          </IconButton>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" noWrap component="div">
              Fantasy and Stats
              
            </Typography>
        
              <div id="signIn"></div>
              {
                Object.keys(user).length != 0 &&
                <Button variant="" id="signOut" onClick={handleSignOut}>LogOut</Button>
              }
                
              
              
            
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Grid container flexDirection="column" height="100%" justifyContent="space-between">
        <List>
          {props.pages.map((page) => {
            return (
              <ListItem
                key={page.name}
                disablePadding
                sx={{ display: "block" }}
              >
                <Link to={page.path} style={{ textDecoration: 'none', color: 'grey' }}>
                <Tooltip title={page.name} placement="right">
                  <ListItemButton
                    key={page.name}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5
                    }}
                  >
                    <ListItemIcon
                      key={page.name}
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {page.icon}
                    </ListItemIcon>
                    
                  </ListItemButton>
                  </Tooltip>
                </Link>
              </ListItem>
            );
          })}
        </List>
        <Switch onClick={handleToggle} {...label} />
        
        </Grid>
        
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {props.children}
        
      </Box>
      
    </Box>
  );
}
