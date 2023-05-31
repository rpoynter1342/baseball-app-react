import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid'; // Grid version 1
import useStore from '../store'
import Carousel from './Carousel';
import * as _ from 'lodash'
import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

function GameStepper() {

  const setMainData = useStore(state => state.setMainData)
  const data = useStore(state => state.mainData)
  React.useEffect(() => {
    //also like .then(res => { do stuff... }) but this is like 'fetch'
    socket.on('connect')
    socket.on('response', res => {
      console.log(res)
    })
    const fetchData = () => {
      socket.emit('get main data');
    };

    // Fetch game data immediately
    fetchData();

    const intervalId = setInterval(fetchData, 30000);


    socket.on('main data response', mainData => {
      console.log(mainData)
      setMainData(mainData)
    });

    console.log(data)
    
  }, [])




  // console.log(data)
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
