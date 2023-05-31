import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import SkeletonLoad from "../Components/SkeletonLoad";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useStore from '../store'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PlayerCarouselHitters from '../Components/PlayerCarouselHitters';
export default function TopPlayers() {
  const user = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)
  const isLoggedIn = useStore(state => state.isLoggedIn)

  const [topPlayers, setTopPlayers] = React.useState({})
  const getStatLeaders = async () => {
    const response = await fetch('http://127.0.0.1:4444/get_top_players', {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response)
    return response.json()
  }

  React.useEffect(() => {
    getStatLeaders().then(data => {
      setTopPlayers(data)
    }).catch(e => {
      console.log(e)
    })
  }, [])

  if (Object.keys(topPlayers).length == 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <SkeletonLoad />
      </Box>
    )
  }

  const regularCase = (text) => {
    const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult
  }

  const statsMap = {
    'battingAverage': 'Avg',
    'doubles': 'Doubles',
    'earnedRunAverage': 'ERA',
    'homeRuns': 'Home Runs',
    'onBasePercentage': 'OBP',
    'onBasePlusSlugging': 'OBPS',
    'pitchesPerInning': 'PPI',
    'runs': 'Runs',
    'runsBattedIn': "RBI's",
    'sluggingPercentage': 'Slugging',
    'stolenBases': 'Stolen Bases',
    'strikeoutWalkRatio': 'K per Walk',
    'strikeouts': "K's",
    'strikeoutsPer9Inn': "K's per Nine",
    'triples': 'Tripples',
    'walksAndHitsPerInningPitched': 'WHIP',
    'winPercentage': 'Win Percent',
    'wins': 'Wins',
    'hits': 'Hits'


  }

  const addFav = async (e) => {
    const id = e.target.closest('button').id

    try {
      const response = await fetch('http://127.0.0.1:4444/add_fav', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'user': user, newFav: { 'id': id } }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const resUser = await response.json();
      setUser(resUser)
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  const removeFav = async (e) => {
    const id = e.target.closest('button').id
    try {
      const response = await fetch('http://127.0.0.1:4444/remove_fav', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'user': user, remove: { 'id': id } }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const resUser = await response.json();
      setUser(resUser)
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }

  

  console.log(topPlayers)
  return (
    <Grid container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <Card sx={{height: '25rem', width: '40rem', padding: '1rem', margin: '1rem'}}>
        <Grid container item sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', marginBottom: '2rem' }}>
          <WhatshotIcon sx={{fontSize: '3rem'}}/><Typography variant="h3">Batters</Typography>
        </Grid>
        <Grid container item sx={{ display: 'flex', alignItems: 'center', justifyContent:'center'}}>
            <PlayerCarouselHitters topPlayers={topPlayers}/>
        </Grid>
      </Card>

      <Card sx={{height: '25rem', width: '40rem', padding: '1rem', margin: '1rem'}}>
        <Grid container item sx={{ display: 'flex', alignItems: 'center', justifyContent:'center', marginBottom: '2rem'  }}>
          <WhatshotIcon sx={{fontSize: '3rem'}}/><Typography variant="h3">Pitchers</Typography>
        </Grid>
        <Grid container item>
          hi
        </Grid>
      </Card>

    </Grid>
  )
}
