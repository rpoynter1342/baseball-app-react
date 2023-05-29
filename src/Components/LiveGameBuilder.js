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

export default function LiveGameBuilder({ game, gamePk, idHome, idAway }) {
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)

    let liveGame = {}



    console.log(gamePk)




    React.useEffect(() => {
        const fetchGameData = () => {
            console.log(gamePk)
            socket.emit('get game data', { 'gamePk': gamePk });
        };

        const intervalId = setInterval(fetchGameData, 5000);

        socket.on('response', data => {
            console.log(data)
        });
    }, [])

    // if (Object.keys(currentGamesData) == 0) {
    //     return <CircularProgress />
    // }

    return (
        
    )
}
