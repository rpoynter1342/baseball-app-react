import * as React from 'react';
import Grid from '@mui/material/Grid'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import { Link, Routes, Route } from "react-router-dom";
import useStore from '../store'
export default function LeagueStandings() {
    const data = useStore(state => state.mainData)
    const teamLogos = useStore(state => state.teamLogos)
    console.log(teamLogos)
    return (
        data[0].standings.records.map(division => {
            return (
                <TableContainer sx={{marginTop: '1.5rem'}} component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {
                                        data[0].divisions.divisions.find(div => division.division.id == div.id).nameShort
                                    }
                                </TableCell>
                                <TableCell>League Rank</TableCell>
                                <TableCell>Wins</TableCell>
                                <TableCell>Losses</TableCell>
                                <TableCell>Win PCT</TableCell>
                                <TableCell>Runs Scored</TableCell>
                                <TableCell>Runs/Game</TableCell>
                                <TableCell>Runs Against</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                division.teamRecords.map(team => {
                                    return (
                                        <TableRow
                                            key={team.team.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                <Grid container alignItems="center">
                                                    <img src={teamLogos.teams[data[0].teams.teams.find(info => info.id == team.team.id).abbreviation]} height="15px" width="15px"/> &nbsp;
                                                    {
                                                     
                                                        data[0].teams.teams.find(info => info.id == team.team.id).abbreviation + ' ' + data[0].teams.teams.find(info => info.id == team.team.id).teamName
                                                        
                                                    }
                                                    
                                                </Grid>
                                            </TableCell>
                                            <TableCell >{team.sportRank}</TableCell>
                                            <TableCell >{team.wins}</TableCell>
                                            <TableCell >{team.losses}</TableCell>
                                            <TableCell >{team.winningPercentage}</TableCell>
                                            <TableCell >{team.runsScored}</TableCell>
                                            <TableCell >{(team.runsScored / (team.gamesPlayed)).toFixed(1)}</TableCell>
                                            <TableCell >{team.runsAllowed}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        })
    )
}
