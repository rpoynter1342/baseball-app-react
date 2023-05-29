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
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

import { Link, Routes, Route } from "react-router-dom";


import useStore from '../store'
export default function LeagueStandings() {
    const user = useStore(state => state.user)
    const setUser = useStore(state => state.setUser)
    const data = useStore(state => state.mainData)
    const teamLogos = useStore(state => state.teamLogos)


    const isLoggedIn = useStore(state => state.isLoggedIn)
    const setIsLoggedIn = useStore(state => state.setIsLoggedIn)

    const addFav = async(e) => {
        const id = e.target.closest('button').id
        
        try {
            const response = await fetch('http://127.0.0.1:4444/add_fav', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({'user': user, newFav: {'id': id} }),
              });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const resUser = await response.json();
            setUser(resUser)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
          
    }
    
    const removeFav = async(e) => {
        const id = e.target.closest('button').id
        try {
            const response = await fetch('http://127.0.0.1:4444/remove_fav', {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({'user': user, remove: {'id': id} }),
              });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const resUser = await response.json();
            setUser(resUser)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    
    }
    
    const getProperBookmarkStatus = (id) => {
        if (isLoggedIn) {
            if (user.favorites.find(fav => fav.id == id) == undefined) {
                return <IconButton id={id} onClick={addFav} sx={{height: '22px', width: '22px', marginRight: '1rem'}}><BookmarkBorderIcon sx={{height: '15px', width: '15px'}}/></IconButton>
            } else {
                return <IconButton id={id} onClick={removeFav} sx={{height: '22px', width: '22px', marginRight: '1rem'}}><BookmarkIcon sx={{height: '15px', width: '15px'}}/></IconButton>
            }
        } else {
            return ''
        }
    }

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
                                                {getProperBookmarkStatus(team.team.id)}<img src={teamLogos.teams[data[0].teams.teams.find(info => info.id == team.team.id).abbreviation]} height="15px" width="15px"/> &nbsp;
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
                                            <TableCell >{(team.runsScored / (team.gamesPlayed)).toFixed(2)}</TableCell>
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
