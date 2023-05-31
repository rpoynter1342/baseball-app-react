import React from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';
import useStore from '../store'
import Box from "@mui/material/Box";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Chip from '@mui/material/Chip'
import SkeletonLoad from "../Components/SkeletonLoad";
import * as _ from 'lodash'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
export default function RealTimeUpdates({game, idHome, idAway, liveGames }) {

    const user = useStore(state => state.user)
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
    // const [balls, setBalls] = React.useState()


    React.useEffect(() => {
        
    }, [])


    
    // if (game.status.abstractGameState == 'Live') {
    //     console.log(game.gamePk)
    // }

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

    // console.log(liveGames)

    const thisCardLiveData = liveGames[game.gamePk]
    
    if (thisCardLiveData == undefined) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SkeletonLoad />
          </Box>
        )
      }
      console.log(thisCardLiveData.currentPlay.about)
    return (
        <Grid container flexDirection='column' justifyContent='space-between' alignItems='center' height='100%'>
            <Grid item container flexDirection='column' alignItems='center' justifyContent='center'>
                <Grid item display="flex" justifyContent='space-around' width="60%">
                    <Typography variant="h4">{game.teams.away.score}</Typography>
                    <Grid item container flexDirection='column' alignItems='center' justifyContent='center'>

                        <div class="bases">
                            <div class={'base ' + (thisCardLiveData.currentPlay.runnerIndex.includes(1) ? 'onbase' : '')} id="sb"></div>
                            <div class={'base ' + (thisCardLiveData.currentPlay.runnerIndex.includes(0) ? 'onbase' : '')} id="fb"></div>
                            <div class={'base ' + (thisCardLiveData.currentPlay.runnerIndex.includes(2) ? 'onbase' : '')} id="tb"></div>
                        </div>

                        <Typography sx={{ height: '19px', fontSize: '12px' }}>
                            {
                                thisCardLiveData != undefined ?
                                    thisCardLiveData.currentPlay.count.balls + ' - ' + thisCardLiveData.currentPlay.count.strikes
                                    :
                                    '0 - 0'
                            }
                        </Typography>
                        <div class="outs">
                            <div class={'out ' + (thisCardLiveData.currentPlay.count.outs >= 1 ? 'isOut' : '')} id="oo"></div>
                            <div class={'out ' + (thisCardLiveData.currentPlay.count.outs >= 2 ? 'isOut' : '')} id="to"></div>
                            <div class={'out ' + (thisCardLiveData.currentPlay.count.outs == 3 ? 'isOut' : '')} id="tho"></div>
                        </div>
                        
                            {
                                thisCardLiveData.currentPlay.about.halfInning == 'top' ?
                                    <Grid container justifyContent='center'><ArrowDropUpIcon sx={{fontSize: '1rem'}}/><Typography variant="caption">{thisCardLiveData.currentPlay.about.inning}</Typography></Grid>
                                    :
                                    <Grid container justifyContent='center'><ArrowDropDownIcon sx={{fontSize: '1rem'}}/><Typography variant="caption">{thisCardLiveData.currentPlay.about.inning}</Typography></Grid>
                            }
                        
                    </Grid>
                    <Typography variant="h4">{game.teams.home.score}</Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}
