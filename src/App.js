import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import HomeIcon from "@mui/icons-material/Home";
import TopPlayers from './Pages/TopPlayers';
import StarIcon from '@mui/icons-material/Star';
import Teams from './Pages/Teams';
import GroupsIcon from '@mui/icons-material/Groups';
import CurrentGames from './Pages/CurrentGames';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Fantasy from './Pages/Fantasy';
import AddIcon from '@mui/icons-material/Add';
import MiniDrawer from "./Components/MiniDrawer.js";
import Team from './Pages/Team'
import SkeletonLoad from "./Components/SkeletonLoad";
import Box from "@mui/material/Box";
import Players from './Pages/Players'
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import Player from './Pages/Player'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";

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

  const [data, setData] = React.useState([])
  const [theme, setTheme] = React.useState(lightTheme)

  
  const handleCallbackResponse = (res) => {
    console.log(res)
  }

  async function mainFetch() {
    // main_home needs: teams, standings, news
    try {
      const response = await fetch('http://127.0.0.1:4444/main_home');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonData = await response.json();

      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  React.useEffect(() => {

    mainFetch()
  }, []);

  if (data.length == 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SkeletonLoad />
      </Box>
    )
  }
  const pages = [
    { name: 'Home', path: '/', element: <Home props={data} />, icon: <HomeIcon /> },
    { name: 'Top Players', path: '/top', element: <TopPlayers />, icon: <StarIcon /> },
    { name: 'All Players', path: '/players', element: <Players />, icon: <SportsBaseballIcon /> },
    { name: 'Teams', path: '/teams', element: <Teams />, icon: <GroupsIcon /> },
    { name: 'Current Games', path: '/curGames', element: <CurrentGames />, icon: <NotificationsActiveIcon /> },
    { name: 'Fantasy', path: '/fantasy', element: <Fantasy />, icon: <AddIcon /> }
  ];

  const hiddenPages = [
    { name: 'Team', path: '/team/:key', element: <Team teams={data.teams} standings={data.standings} /> },
    { name: 'Player', path: '/player/:key', element: <Player /> },
  ]
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MiniDrawer pages={pages} setter={setTheme}>
        <Routes>
          {pages.map((page) => {
            return <Route path={page.path} element={page.element} />;
          })}
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
