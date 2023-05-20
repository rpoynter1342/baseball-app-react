import * as React from 'react'
import Avatar from '@mui/material/Avatar';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid'; // Grid version 1
import { Link, Routes, Route } from "react-router-dom";
export default function Logos({viewing, teams, standings}) {


    const playingTeams = teams.filter(
      (team) =>
        team.TeamID === viewing.AwayTeamID || team.TeamID === viewing.HomeTeamID
    )
    .map((team) => ({
      team: team,
      standing: standings.filter(
        (standing) => standing.TeamID === team.TeamID
      ),
    }));


  return (
    <>
      {
        playingTeams.map(team => {
          return (
         
            <Grid sx={{minWidth: '100%'}} container display="flex" justifyContent="space-evenly" alignItems="center" flexDirection="column">
              <Link to={`/team/${team.team.Key}`} style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>
                {team.team.Key}
              </Link>
              <Link to={`/team/${team.team.Key}`} style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }}>
                <img src={team.team.WikipediaLogoUrl} height="70px" width="70px"/>
              </Link>
              <Typography variant="caption" display="block" gutterBottom>
                ({team.standing[0].Wins} - {team.standing[0].Losses})
              </Typography>
            </Grid>
            
          )
        })
      }
    </>
  )
}
