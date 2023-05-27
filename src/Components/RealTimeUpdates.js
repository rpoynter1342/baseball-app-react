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

import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

export default function RealTimeUpdates({ game, idHome, idAway }) {

    const user = useStore(state => state.user)
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
    const [games, setGamesData] = React.useState({})
    React.useEffect(() => {
        const fetchGameData = () => {
            socket.emit('get game data', { 'gamePk': game.gamePk });
        };
        
        fetchGameData();
        const intervalId = setInterval(fetchGameData, 15000);
    
        

        socket.on('response', data => {
            setGamesData(data)
        });
    }, [])
    if (Object.keys(games).length == 0) {
        return (
            <Card sx={{ width: "100%", height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Card>
        )
    }
    //<Chip sx={{height: '19px', fontSize: '10px'}} label={`${pitch.details.description.split(' - ')[1]}`} />
    // console.log(games)

    return (
        <Grid container flexDirection='column' justifyContent='center'  alignItems='center'>
            <Grid item container flexDirection='column' alignItems='center' justifyContent='center'>
                <Typography sx={{ height: '19px', fontSize: '10px' }}>Bases</Typography>
                <Typography sx={{ height: '19px', fontSize: '10px' }}>Count</Typography>
            </Grid>
            *NEEDS REWORK*
        </Grid>
    )
}
