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
              <Link to={`/team/${team.team.Key}`}>
                {team.team.Key}
              </Link>
              <Avatar sx={{ width: 70, height: 70, "& > img": { objectFit: 'scale-down' } }} src={team.team.WikipediaLogoUrl} />
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
