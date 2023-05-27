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

  async function login(jwt) {
    // main_home needs: teams, standings, news
    const response = await fetch('http://127.0.0.1:4444/token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: jwt }),
    });
  
    // localStorage.setItem('jwt', jwt);
    if (response.status == 200) localStorage.setItem('jwt', jwt);
    return response.json()
  }

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

  const handleCallbackResponse = (res) => {
    login(res.credential).then((data) => {
      setUser(data)
      setIsLoggedIn(true)
      localStorage.setItem('jwt', res.credential)
    }).catch(e => {
      console.log(e)
      localStorage.removeItem('jwt')
      setIsLoggedIn(false)
      setUser({})
    })
  }
  
  function LoginBtn() {
    React.useEffect(() => {
      
        google.accounts.id.initialize({
          client_id: "543204222025-vu2ci05c2kei4pcspud0pi81peddd2tf.apps.googleusercontent.com",
          callback: handleCallbackResponse
        });
    
        google.accounts.id.renderButton(
          document.getElementById('signIn'),
          { theme: "", size: "large", shape: 'pill', type: "icon", display: 'none' }
        )
      
    },[])
    return (
      <div id="signIn"></div>
    )
  }

  
      
  React.useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    console.log(storedJwt)
    if (data.length == 0) {
      mainFetch()
    }
    if (storedJwt) {
      // If a JWT is stored, attempt to log in with it
      login(storedJwt).then((data) => {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MiniDrawer pages={pages} setter={setTheme} Login={<LoginBtn />}>
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
  );
}

export default App;
