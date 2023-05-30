import React from "react";
import { Routes, Route } from "react-router-dom";

import useStore from './store'


import MiniDrawer from "./Components/MiniDrawer.js";

import SkeletonLoad from "./Components/SkeletonLoad";
import Box from "@mui/material/Box";



import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import jwtDecode from "jwt-decode"

import './styles.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
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



function App() {

  const pages = useStore(state => state.pages)
  const hiddenPages = useStore(state => state.hiddenPages)
  const data = useStore(state => state.mainData)
  const user = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)

  const isLoggedIn = useStore(state => state.isLoggedIn)
  const setIsLoggedIn = useStore(state => state.setIsLoggedIn)

  const setMainData = useStore(state => state.setMainData)
  const [theme, setTheme] = React.useState(lightTheme)



  async function mainFetch() {
    // main_home needs: teams, standings, news
    try {
      const response = await fetch('http://127.0.0.1:4444/main_home');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      setMainData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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




  React.useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    console.log(storedJwt)

    mainFetch()
  
    if (storedJwt) {
      // If a JWT is stored, attempt to log in with it
      getUser(storedJwt).then((data) => {
        console.log(data)
        setUser(data);
        setIsLoggedIn(true)
      }).catch(e => {
        console.log(e)
        setUser({})
        setIsLoggedIn(false)
        localStorage.removeItem('jwt')
      })
    }
    console.log(user)
    if (Object.keys(user).length == 0) {
      setIsLoggedIn(false)
      localStorage.removeItem('jwt')
    }
    console.log(isLoggedIn)
  }, []);


  if (data.length == 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SkeletonLoad />
      </Box>
    )
  }
  // if (isLoggedIn) {
  //   document.querySelector('#signIn').style.display = 'none'
  // }
  return (
    <GoogleOAuthProvider clientId="543204222025-vu2ci05c2kei4pcspud0pi81peddd2tf.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MiniDrawer pages={pages} setter={setTheme}>
          <Routes>
            {
              pages.map((page) => {
                return <Route key={page.name} id={page.name} path={page.path} element={page.element} />
              })
            }
            {
              hiddenPages.map((page) => {
                return <Route key={page.name} path={page.path} element={page.element} />;
              })
            }
          </Routes>
        </MiniDrawer>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
