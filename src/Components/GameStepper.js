import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import useStore from '../store'
import { Link } from "react-router-dom";
import Carousel from './Carousel';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';


function GameStepper() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  const data = useStore(state => state.mainData)
  const logos = useStore(state => state.teamLogos)

  const filterForId = (dateList, id) => {
    let pastSeven = []
    dateList.forEach(date => {
      const calDate = date.date
      let didPlay = true
      const gamePlayed = date.games.find(game => game.teams.away.team.id == id || game.teams.home.team.id == id)
      if (gamePlayed == undefined) didPlay = false
      if (!didPlay) {
        pastSeven.push(calDate)
      }
      date.games.forEach(game => {
        if (game.teams.home.team.id == id || game.teams.away.team.id == id) {
          pastSeven.push(game)
        }
        
      })
    })
    return(pastSeven)
  }

  const theme = useTheme();
  // console.log(logos)
  return (
   <Grid container justifyContent='center' alignItems='center'>
      <Grid item>
        
      </Grid>
      <Grid item>
      <Carousel>
        {
          data[0].schedule.dates[7].games.map((game, i) => {
            const idHome = game.teams.home.team.id
            const idAway = game.teams.away.team.id
            
            return(
              <Card key={i} sx={{
              'width': '23rem', 
              'height': '23rem', 
              'padding': '1rem', 
              display: 'flex',
              alignItems: 'center',
              pl: 2,
              bgcolor: 'background.default',
              flexDirection: 'column'}}>
                {
                  new Date(data[0].schedule.dates[7].games[i].gameDate).toLocaleDateString()
                }
                {
                  // 
                 (() => {
                  switch(game.status.abstractGameState) {
                    case 'Live':
                      return <Chip icon={<CircularProgress size={10} />} label="Live" />
                    case 'Final':
                      return <Chip icon={<PauseCircleFilledIcon sx={{height:'14px', width:'14px'}} />} label="Final" />
                    case 'Upcoming': 
                      return <Chip icon={<AccessTimeFilledIcon sx={{height:'14px', width:'14px'}} />} label="Upcoming" />
                  }
                 })
                 ()
                }
                <Grid container display="flex" justifyContent="space-evenly" alignItems="center" flexDirection="row">
                  {
                    data[0].teams.teams.map(team => {
                      if (team.id == game.teams.away.team.id) {
                        return(
                          <Grid container flexDirection='column' alignItems='center' sx={{width: '30%'}} onClick={handleClickOpen}>
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
                        return(
                          <Grid container flexDirection='column' alignItems='center' sx={{width: '30%'}} onClick={handleClickOpen}>
                            <Grid item>{team.abbreviation}</Grid>
                            <Grid item><img height='70px' width='70px' src={logos.teams[team.abbreviation]} /></Grid>
                            <Grid item><Typography variant="caption" display="block">({game.teams.home.leagueRecord.wins} - {game.teams.away.leagueRecord.losses})</Typography></Grid>
                          </Grid>
                        )
                      }
                    })
                  }
                  
                </Grid>
                <Grid item>
                  <Typography variant="caption" display="block">
                    {new Date(data[0].schedule.dates[7].games[i].gameDate).toLocaleTimeString()}
                  </Typography>
                </Grid>
                <Grid container justifyContent='space-around' height='100%' alignContent='center' flexDirection='column'>
                  <Grid item>
                    <Card sx={{width: "300px", height: '50px', display: 'flex', alignItems: 'center'}}>
                      <div class='imgHolder'><img height='40px' width='40px' src={logos.teams[data[0].teams.teams.find(team => team.id == idAway).abbreviation]} /></div>
                      <Divider orientation="vertical" flexItem />
                      {
                        filterForId(data[0].schedule.dates.slice(0, -1), idAway).map(game => {
                          if (game.content) {
                            return(
                              <>
                                <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                  <Typography variant='caption'>{game.officialDate.split('-')[1]}/{game.officialDate.split('-')[2]}</Typography>
                                
                                    
                                      {
                                        
                                        game.teams.away.team.id == idAway ? game.teams.away.isWinner == true ? <CheckCircleIcon sx={{height:'20px', width:'20px'}} /> : <CancelIcon sx={{height:'20px', width:'20px'}}/> : game.teams.home.isWinner == true ? <CheckCircleIcon sx={{height:'20px', width:'20px'}} /> : <CancelIcon sx={{height:'20px', width:'20px'}}/>
                                        
                                      }
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                              </>
                            )
                          } else {
                            return(
                              <>
                                <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                  <Typography variant='caption'>{game.split('-')[1]}/{game.split('-')[2]}</Typography>
                                  <DoNotDisturbOnIcon sx={{height:'20px', width:'20px'}}/>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                              </>
                            )
                          }
                        })
                      }
                    </Card>
                  </Grid>
                  <Grid item>
                  <Card sx={{width: "300px", height: '50px', display: 'flex', alignItems: 'center'}}>
                  <div class='imgHolder'><img height='40px' width='40px' src={logos.teams[data[0].teams.teams.find(team => team.id == idHome).abbreviation]} /></div>
                      <Divider orientation="vertical" flexItem />
                      {
                        filterForId(data[0].schedule.dates.slice(0, -1), idHome).map(game => {
                          if (game.content) {
                            return(
                              <>
                                <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                  <Typography variant='caption'>{game.officialDate.split('-')[1]}/{game.officialDate.split('-')[2]}</Typography>
                                      {
                                        game.teams.away.team.id == idAway ? game.teams.away.isWinner == true ? <CheckCircleIcon sx={{height:'20px', width:'20px'}}/> : <CancelIcon sx={{height:'20px', width:'20px'}}/> : game.teams.home.isWinner == true ? <CheckCircleIcon sx={{height:'20px', width:'20px'}}/> : <CancelIcon sx={{height:'20px', width:'20px'}}/>
                                      }
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                              </>
                            )
                          } else {
                            return(
                              <>
                                <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                  <Typography variant='caption'>{game.split('-')[1]}/{game.split('-')[2]}</Typography>
                                  <DoNotDisturbOnIcon sx={{height:'20px', width:'20px'}}/>
                                </Grid>
                                <Divider orientation="vertical" flexItem />
                              </>
                            )
                          }
                        })
                      }
                    </Card>
                  </Grid>
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
