import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import SkeletonLoad from "../Components/SkeletonLoad";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import useStore from '../store'
import PersonIcon from '@mui/icons-material/Person';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
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

  const getProperBookmarkStatus = (id) => {
    if (isLoggedIn) {
      if (user.favorites.find(fav => fav.id == id) == undefined) {
        return <IconButton id={id} onClick={addFav} sx={{ height: '22px', width: '22px'}}><BookmarkBorderIcon sx={{ height: '15px', width: '15px' }} /></IconButton>
      } else {
        return <IconButton id={id} onClick={removeFav} sx={{ height: '22px', width: '22px'}}><BookmarkIcon sx={{ height: '15px', width: '15px' }} /></IconButton>
      }
    } else {
      return ''
    }
  }

  console.log(topPlayers)
  return (
    <Grid container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {
        Object.keys(topPlayers.data).map(key => {
          return (
            <Grid item container flexDirection='column' justifyContent='center' alignContent='center' alignItems='center'>
              <Typography variant='h4'>{regularCase(key)}</Typography>
              <Grid item container justifyContent='center'>
                {
                  topPlayers.data[key].map(player => {
                    return (
                      <Card sx={{ height: '18rem', width: '12rem', marginRight: '2rem', marginLeft: '2rem', padding: '.5rem' }}>
                        <Grid container flexDirection='column'>
                          <Grid item container justifyContent='space-between'>
                            <Grid item>
                              <Typography variant='caption'>
                                {getProperBookmarkStatus(topPlayers.player_info[player[1]][0].id)}
                                {`#${player[0]} ${player[1]}`}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <IconButton sx={{ height: '1rem', width: '1rem' }} aria-label="info">
                                <InfoIcon sx={{ height: '1rem', width: '1rem' }} />
                              </IconButton>
                            </Grid>
                          </Grid>
                          <Grid item alignSelf='center'>
                            <PersonIcon sx={{ height: '10rem', width: '3rem' }} />
                          </Grid>
                          <Grid item alignSelf='center'>
                            {
                              ` ${topPlayers.player_info[player[1]][0].primaryPosition.abbreviation}`
                            }
                          </Grid>
                          <Grid item alignSelf='center'>
                            {
                              player[2]
                            }
                          </Grid>
                          <Grid item alignSelf='center'>
                            {
                              `${statsMap[key]}: ${player[3]}`
                            }
                          </Grid>

                        </Grid>
                      </Card>
                    )
                  })
                }
              </Grid>
            </Grid>
          )
        })
      }
    </Grid>
  )
}
