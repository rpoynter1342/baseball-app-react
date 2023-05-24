import React from "react";
import { Routes, Route } from "react-router-dom";

import useStore from './store'


import MiniDrawer from "./Components/MiniDrawer.js";

import SkeletonLoad from "./Components/SkeletonLoad";
import Box from "@mui/material/Box";


import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

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
  const isLoggedIn = Object.keys(user).length != 0
  const setMainData = useStore(state => state.setMainData)

  console.log(isLoggedIn)
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

  console.log(data)
  React.useEffect(() => {
      if (data.length == 0) {
        mainFetch()
      }
    }, []);
  

  if (data.length == 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SkeletonLoad />
      </Box>
    )
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MiniDrawer pages={pages} setter={setTheme}>
        <Routes>
          {
            pages.map((page) => {
              return <Route id={page.name} path={page.path} element={page.element} />
            })
          }
          {
            hiddenPages.map((page) => {
              return <Route path={page.path} element={page.element} />;
            })
          }
        </Routes>
      </MiniDrawer>
    </ThemeProvider>
  );
}

export default App;
