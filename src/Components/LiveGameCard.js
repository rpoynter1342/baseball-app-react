import React from 'react'
import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import useStore from '../store'
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import LastSevenGroup from './LastSevenGroup';
import RealTimeUpdates from './RealTimeUpdates'

export default function LiveGameCard({game, i, idHome, idAway, active, liveGames}) {
    // console.log(i)
    // console.log(game)
    // const [active, setActive] = React.useState(0);
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
    const MAX_VISIBILITY = 3
    const count = data[0].schedule.dates[7].games.length
  return (
    <div className='card-container' style={{
        '--active': i === active ? 1 : 0,
        '--offset': (active - i) / 3,
        '--direction': Math.sign(active - i),
        '--abs-offset': Math.abs(active - i) / 3,
        'opacity': Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
        'display': Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
      }}>
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
          new Date(game.gameDate).toLocaleDateString()
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
                  <Grid container flexDirection='column' alignItems='center' sx={{ width: '30%' }}>
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
                  <Grid container flexDirection='column' alignItems='center' sx={{ width: '30%' }}>
                    <Grid item>{team.abbreviation}</Grid>
                    <Grid item><img height='70px' width='70px' src={logos.teams[team.abbreviation]} /></Grid>
                    <Grid item><Typography variant="caption" display="block">({game.teams.home.leagueRecord.wins} - {game.teams.home.leagueRecord.losses})</Typography></Grid>
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
                {new Date(game.gameDate).toLocaleTimeString()}
              </Typography>
            </Grid>
            :
            ''
        }
        <Grid container justifyContent='space-around' height="100%" alignContent='center' flexDirection='column'>
          {
            (game.status.abstractGameState == 'Final') ?
              <Grid container flexDirection='column' alignItems='center' justifyContent='space-between' height="100%" paddingTop="3rem" paddingBottom="3rem">
                <Grid item display="flex" justifyContent='space-around' width="80%"><Typography variant="h4">{game.teams.away.score}</Typography><Typography variant="h4">-</Typography><Typography variant="h4">{game.teams.home.score}</Typography></Grid>
                <LastSevenGroup game={game} idHome={idHome} idAway={idAway} />
              </Grid>
              :
              (game.status.abstractGameState == 'Preview') ?
                <LastSevenGroup game={game} idHome={idHome} idAway={idAway} />
                :
                <RealTimeUpdates game={game} liveGames={liveGames} idHome={idHome} idAway={idAway} />

          }
        </Grid>
      </Card>
      </div>
  )
}
