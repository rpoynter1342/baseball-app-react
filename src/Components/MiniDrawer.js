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
import Button from '@mui/material/Button'
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";

import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid'


import { GoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import useStore from '../store'

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
  console.log(props)
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  //Object.keys(user).length != 0
  const user = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)

  const isLoggedIn = useStore(state => state.isLoggedIn)
  const setIsLoggedIn = useStore(state => state.setIsLoggedIn)

  const handleSignOut = (e) => {
    
  }
  
  React.useEffect(() => {
    // console.log(user)
    
  }, [])

  

  const handleToggle = (e) => {
    e.target.checked ? props.setter(darkTheme) : props.setter(lightTheme)
    // if (isLoggedIn == true) {
    //   setDark(e)
    // }
  }


  const setDark = async (e) => {
    const response = await fetch('http://127.0.0.1:4444/set_darkmode', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'user': user, 'update': e.target.checked }),
    });
    console.log(response)
    return response.json()
  }

  const getUser = async (token) => {
    const response = await fetch('http://127.0.0.1:4444/get_user', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    console.log(response)
    if (response.status == 200) {
      localStorage.setItem('jwt', token)
    }
    return response.json()
  }
  
  const handleGetUser = (cred) => {
    getUser(cred.credential).then(res => {
      setUser(res)
      setIsLoggedIn(true)
    })
    console.log(cred.credential)
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
              Full Count Fantasy
            </Typography>
            {!isLoggedIn && <GoogleLogin
              onSuccess={handleGetUser}
              onError={() => {
                console.log('Login Failed');
              }}
            />}
            {isLoggedIn && <Button variant="" id="signOut" onClick={googleLogout}>SignOut</Button>}
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
              if (!isLoggedIn && (page.name == 'Favorites' || page.name == 'Fantasy')) {
                return (
                  ''
                );
              } else {
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
              }

            })}
          </List>
          

        </Grid>
        <Switch onClick={handleToggle} {...label} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {props.children}

      </Box>

    </Box>
  );
}
