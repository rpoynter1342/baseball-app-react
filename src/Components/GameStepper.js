import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import useStore from '../store'
import Carousel from './Carousel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import LastSevenGroup from './LastSevenGroup';
import RealTimeUpdates from './RealTimeUpdates'

import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

function GameStepper() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');
  const [games, setGames] = React.useState([])
  //Object.keys(user).length != 0
  const user = useStore(state => state.user)
  const data = useStore(state => state.mainData)
  const setMainData = useStore(state => state.setMainData)
  const logos = useStore(state => state.teamLogos)
  const currentGamesData = useStore(state => state.currentGamesData)
  const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
  const handleClickOpen = () => {
    setOpen(true);
  };

  console.log(data)


  React.useEffect(() => {
    //also like .then(res => { do stuff... }) but this is like 'fetch'
    socket.on('connect', function () {
      console.log('Connected to server');
    });
    const fetchData = () => {
      socket.emit('get main data');
    };

    // Fetch game data immediately
    fetchData();

    
    const intervalId = setInterval(fetchData, 60000);
    socket.on('response', data => {
      setMainData(data)
    });
    // Clean up function to run when the component is unmounted
    return () => {
      clearInterval(intervalId);  // Stop the interval
      socket.off('connect');
      socket.off('response');
    }
  }, [])




  const theme = useTheme();
  // console.log(logos)
  return (
    <Grid container justifyContent='center' alignItems='center' height='34rem'>
      <Grid item>
        <Carousel>
          {
            data[0].schedule.dates[7].games.map((game, i) => {
              console.log(game)
              const idHome = game.teams.home.team.id
              const idAway = game.teams.away.team.id
              // console.log(game)
              return (
                <Card key={i} sx={{
                  'width': '27rem',
                  'height': '34rem',
                  'padding': '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  pl: 2,
                  bgcolor: 'background.default',
                  flexDirection: 'column'
                }}>
                  {
                    new Date(data[0].schedule.dates[7].games[i].gameDate).toLocaleDateString()
                  }
                  {
                    // 
                    (() => {
                      switch (game.status.abstractGameState) {
                        case 'Live':
                          return <Chip icon={<CircularProgress size={10} />} label="Live" />
                        case 'Final':
                          return <Chip icon={<PauseCircleFilledIcon sx={{ height: '14px', width: '14px' }} />} label="Final" />
                        case 'Preview':
                          return <Chip icon={<AccessTimeFilledIcon sx={{ height: '14px', width: '14px' }} />} label="Upcoming" />
                      }
                    })
                      ()
                  }
                  <Grid container display="flex" justifyContent="space-evenly" alignItems="center" flexDirection="row">
                    {
                      data[0].teams.teams.map(team => {
                        if (team.id == game.teams.away.team.id) {
                          return (
                            <Grid container flexDirection='column' alignItems='center' sx={{ width: '30%' }} onClick={handleClickOpen}>
                              <Grid item>{team.abbreviation}</Grid>
                              <Grid item><img height='70px' width='70px' src={logos.teams[team.abbreviation]} /></Grid>
                              <Grid item><Typography variant="caption" display="block">({game.teams.away.leagueRecord.wins} - {game.teams.away.leagueRecord.losses})</Typography></Grid>
                            </Grid>
                          )
                        }
                      })
                    }
                    @
                    {
                      data[0].teams.teams.map(team => {
                        if (team.id == game.teams.home.team.id) {
                          return (
                            <Grid container flexDirection='column' alignItems='center' sx={{ width: '30%' }} onClick={handleClickOpen}>
                              <Grid item>{team.abbreviation}</Grid>
                              <Grid item><img height='70px' width='70px' src={logos.teams[team.abbreviation]} /></Grid>
                              <Grid item><Typography variant="caption" display="block">({game.teams.home.leagueRecord.wins} - {game.teams.away.leagueRecord.losses})</Typography></Grid>
                            </Grid>
                          )
                        }
                      })
                    }

                  </Grid>
                  {
                    (game.status.abstractGameState == 'Preview' || game.status.abstractGameState == 'Final') ?
                      <Grid item>
                        <Typography variant="caption" display="block">
                          {new Date(data[0].schedule.dates[7].games[i].gameDate).toLocaleTimeString()}
                        </Typography>
                      </Grid>
                      :
                      ''
                  }
                  <Grid container justifyContent='space-around' height="100%" alignContent='center' flexDirection='column'>
                    {
                      //game.status.abstractGameState == 'Preview' ||
                      /**:
                        <RealTimeUpdates game={game} idHome={idHome} idAway={idAway} /> */
                      (game.status.abstractGameState == 'Final') ? 
                        <Grid container flexDirection='column' alignItems='center' justifyContent='space-between' height="100%" paddingTop="3rem" paddingBottom="3rem">
                          <Grid item display="flex" justifyContent='space-around' width="80%"><Typography variant="h4">{game.teams.away.score}</Typography><Typography variant="h4">-</Typography><Typography variant="h4">{game.teams.home.score}</Typography></Grid>
                          <LastSevenGroup game={game} idHome={idHome} idAway={idAway} />
                        </Grid>
                        :
                        (game.status.abstractGameState == 'Preview') ?
                          <LastSevenGroup game={game} idHome={idHome} idAway={idAway} />
                          :
                          <RealTimeUpdates game={game} idHome={idHome} idAway={idAway} />
                        
                    }
                  </Grid>
                </Card>
              )
            })
          }
        </Carousel>
      </Grid>

    </Grid>

  )

}

export default GameStepper;
