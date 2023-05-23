import * as React from 'react'
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
import { Link } from "react-router-dom";
import useStore from '../store'

export default function Logos() {

  const data = useStore(state => state.mainData)
  const logos = useStore(state => state.teamLogos)
  return (
    <>
      {
        data[0].schedule.dates[0].games.map(game => {
          return (
         
            <Grid sx={{minWidth: '100%'}} container display="flex" justifyContent="space-evenly" alignItems="center" flexDirection="column">
              team
            </Grid>
            
          )
        })
      }
    </>
  )
}
