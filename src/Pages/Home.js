import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid'
import GameStepper from "../Components/GameStepper";
import LeagueStandings from "../Components/LeagueStandings";

import News from '../Components/News'

export default function Home({props}) {
  
  console.log(props)
  return(
    <Grid container sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', 'div.MuiGrid-container > div.MuiGrid-item': {padding: '10px'}}}>
      <Grid item sx={{minWidth: '25%'}}>
        <GameStepper currentGames={props.currentGames} teams={props.teams} standings={props.standings}/>
      </Grid>
      <Grid item>
        <LeagueStandings standings={props.standings} />
      </Grid>
      <Grid item>
        <News news={props.news} />
      </Grid>
    </Grid>

  )
}
