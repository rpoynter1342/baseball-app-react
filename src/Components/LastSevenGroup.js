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
import Tooltip from '@mui/material/Tooltip';

export default function LastSevenGroup({ game, idHome, idAway }) {
    const user = useStore(state => state.user)
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
        return (pastSeven)
    }
    return (
        <>
            <Grid item width="90%">
                <Card sx={{  height: '50px', display: 'flex', alignItems: 'center' }}>
                    <div className='imgHolder'><img height='40px' width='40px' src={logos.teams[data[0].teams.teams.find(team => team.id == idAway).abbreviation]} /></div>
                    <Divider orientation="vertical" flexItem />
                    {
                        filterForId(data[0].schedule.dates.slice(0, -1), idAway).map(game => {
                            if (game.content) {

                                return (

                                    <>
                                        <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                            <Typography variant='caption'>{game.officialDate.split('-')[1]}/{game.officialDate.split('-')[2]}</Typography>


                                            {

                                                game.teams.away.team.id == idAway ?
                                                    game.teams.away.isWinner == true ?
                                                        <Tooltip title="Win"><CheckCircleIcon sx={{ height: '20px', width: '20px' }} /></Tooltip> :
                                                        <Tooltip title="Loss"><CancelIcon sx={{ height: '20px', width: '20px' }} /></Tooltip> :
                                                    game.teams.home.isWinner == true ?
                                                        <Tooltip title="Win"><CheckCircleIcon sx={{ height: '20px', width: '20px' }} /></Tooltip> :
                                                        <Tooltip title="Loss"><CancelIcon sx={{ height: '20px', width: '20px' }} /></Tooltip>

                                            }
                                        </Grid>
                                        <Divider orientation="vertical" flexItem />
                                    </>


                                )
                            } else {
                                return (
                                    <>
                                        <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                            <Typography variant='caption'>{game.split('-')[1]}/{game.split('-')[2]}</Typography>
                                            <Tooltip title="DNP"><DoNotDisturbOnIcon sx={{ height: '20px', width: '20px' }} /></Tooltip>
                                        </Grid>
                                        <Divider orientation="vertical" flexItem />
                                    </>
                                )
                            }
                        })
                    }
                </Card>
            </Grid>
            <Grid item width="90%">
                <Card sx={{  height: '50px', display: 'flex', alignItems: 'center' }}>
                    <div className='imgHolder'><img height='40px' width='40px' src={logos.teams[data[0].teams.teams.find(team => team.id == idHome).abbreviation]} /></div>
                    <Divider orientation="vertical" flexItem />
                    {
                        filterForId(data[0].schedule.dates.slice(0, -1), idHome).map(game => {
                            if (game.content) {
                                return (
                                    <>
                                        <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                            <Typography variant='caption'>{game.officialDate.split('-')[1]}/{game.officialDate.split('-')[2]}</Typography>
                                            {
                                                game.teams.away.team.id == idAway ?
                                                    game.teams.away.isWinner == true ?
                                                        <Tooltip title="Win"><CheckCircleIcon sx={{ height: '20px', width: '20px' }} /></Tooltip> :
                                                        <Tooltip title="Loss"><CancelIcon sx={{ height: '20px', width: '20px' }} /></Tooltip> :
                                                    game.teams.home.isWinner == true ?
                                                        <Tooltip title="Win"><CheckCircleIcon sx={{ height: '20px', width: '20px' }} /></Tooltip> :
                                                        <Tooltip title="Loss"><CancelIcon sx={{ height: '20px', width: '20px' }} /></Tooltip>
                                            }
                                        </Grid>
                                        <Divider orientation="vertical" flexItem />
                                    </>
                                )
                            } else {
                                return (
                                    <>
                                        <Grid container flexDirection='column' alignContent='center' justifyContent='center' alignItems='center'>
                                            <Typography variant='caption'>{game.split('-')[1]}/{game.split('-')[2]}</Typography>
                                            <Tooltip title="DNP"><DoNotDisturbOnIcon sx={{ height: '20px', width: '20px' }} /></Tooltip>
                                        </Grid>
                                        <Divider orientation="vertical" flexItem />
                                    </>
                                )
                            }
                        })
                    }
                </Card>
            </Grid>
        </>
    )
}
