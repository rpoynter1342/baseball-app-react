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
import * as _ from 'lodash'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

function GameStepper() {

  const setMainData = useStore(state => state.setMainData)
  const data = useStore(state => state.mainData)
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

    const intervalId = setInterval(fetchData, 30000);




    socket.on('response', data => {
      setMainData(data)
    });
    // Clean up function to run when the component is unmounted
    return () => {
      clearInterval(intervalId);  // Stop the interval
      socket.off('connect');
      socket.off('response');
      socket.off('get main data');
    }
  }, [])





  const theme = useTheme();
  // console.log(logos)
  return (
    <Grid container justifyContent='center' alignItems='center' height='34rem'>
      <Grid item>
        <Carousel />
      </Grid>
    </Grid>

  )

}

export default GameStepper;
