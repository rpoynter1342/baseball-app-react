import React, { useState, useEffect } from "react";
import Grid from '@mui/material/Grid'
import GameStepper from "../Components/GameStepper";
import LeagueStandings from "../Components/LeagueStandings";



import News from '../Components/News'

export default function Home() {

  return(
    <Grid container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Grid item>
        <GameStepper />
      </Grid>
      <Grid item>
        <LeagueStandings />
      </Grid>
      
    </Grid>

  )
}
