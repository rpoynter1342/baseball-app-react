import * as React from 'react';
import StandingsTable from './StandingsTable'
import Grid from '@mui/material/Grid'
export default function LeagueStandings({standings, teamLogos}) {
  console.log(standings)
  const map = {
    AL: [
        {
            Central: [],
            East: [],
            West: []
        }
    ],
    NL: [
        {
            Central: [],
            East: [],
            West: []
        }
    ],
  }
  standings.forEach(team => {
    map[team.League][0][team.Division].push(team)
  })
  return (
    <>
        <Grid container sx={{display: 'flex', justifyContent: 'space-evenly'}}>
        {
            Object.values(map.AL[0]).map(division => {
                return(
                    <Grid item>
                        <StandingsTable division={division} teamLogos={teamLogos}/>
                    </Grid>
                )
            })
            
        }
        </Grid>
        <Grid container sx={{display: 'flex', justifyContent: 'space-evenly'}}>
        {
            Object.values(map.NL[0]).map(division => {
                return(
                    <Grid item>
                        <StandingsTable division={division} teamLogos={teamLogos}/>
                    </Grid>
                )
            })
        }
        </Grid>
        
    </>
  )
}
