import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import useStore from '../store'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Chip from '@mui/material/Chip'
import * as _ from 'lodash'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

export default function RealTimeUpdates({ game, idHome, idAway }) {

    const user = useStore(state => state.user)
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
    

    // let liveGame = {}
    // const fetchGameData = async () => {
    //     await socket.emit('get game data', { 'gamePk': game.gamePk });
    // };

    // React.useEffect(() => {


    //     if (game.status.abstractGameState == 'Live') {
    //         const intervalId = setInterval(fetchGameData, 5000);
    //     }



    //     socket.on('response', data => {
    //         setCurrentGamesData(data)
    //     });
    // }, [])

    // console.log()

    // if (Object.keys(currentGamesData) == 0) {
    //     return <CircularProgress />
    // }

// <Grid item container alignItems='center' justifyContent='space-between'>
//                 <Grid item>
//                     H: {
//                         currentGamesData.data.currentPlay.matchup.batter.fullName
//                     }
//                 </Grid>
//                 <Grid item>
//                     P: {
//                         currentGamesData.data.currentPlay.matchup.pitcher.fullName
//                     }
//                 </Grid>
//             </Grid>

    

    return (
        <Grid container flexDirection='column' justifyContent='space-between' alignItems='center' height='100%'>
            <Grid item container flexDirection='column' alignItems='center' justifyContent='center'>
                <Grid item display="flex" justifyContent='space-around' width="60%">
                    <Typography variant="h4">{game.teams.away.score}</Typography>
                    <Grid item container flexDirection='column' alignItems='center' justifyContent='center'>

                        <div class="bases">
                            <div class="base" id="fb"></div>
                            <div class="base" id="sb"></div>
                            <div class="base" id="tb"></div>
                        </div>

                        <Typography sx={{ height: '19px', fontSize: '12px' }}>0 - 0</Typography>
                        <div class="outs">
                            <div class="out" id="oo"></div>
                            <div class="out" id="to"></div>
                            <div class="out" id="tho"></div>
                        </div>
                    </Grid>
                    <Typography variant="h4">{game.teams.home.score}</Typography>
                </Grid>
            </Grid>
            
        </Grid>
    )
}
