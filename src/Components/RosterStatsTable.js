import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid'
import { Link, Routes, Route } from "react-router-dom";



export default function RosterStatsTable({roster, stats}) {
  const rosterStatsMap = roster.map(player => {
    const stat = stats.find(i2 => i2.first_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0] === player.FirstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0] && i2.last_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0] === player.LastName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0])
    if (stat) {
        return {...player, ...stat}
    }
    return stat
  })
  console.log(rosterStatsMap)
  return (
    <Grid container  sx={{display: 'flex', justifyContent: 'space-evenly', flexDirection: 'column'}}>
        <Grid item sx={{paddingRight: '200px', paddingLeft: '200px', paddingTop: '20px', paddingBottom: '20px'}}>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small">
        <TableHead>
          <TableRow>
          <TableCell>Roster (Hitting)</TableCell>
          <TableCell>Games Played</TableCell>
          <TableCell>At Bats</TableCell>
          <TableCell>Batting Avg</TableCell>
          <TableCell>OBP</TableCell>
          <TableCell>OPS</TableCell>
          <TableCell>RBIs</TableCell>
          <TableCell>Stolen Bases</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rosterStatsMap.map((player) => {
               return(player.PositionCategory != 'P' ? 
               <TableRow
                key={player.LastName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
               >
                <TableCell component="th" scope="row">
                <Link to={`/player/${player.PlayerID}`}>{player.FirstName + ' ' + player.LastName + ' ('+player.Position+')'}</Link>
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.gamesPlayed
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.atBats
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.avg
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.obp
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.ops
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.rbi
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'hitting') {
                            return stat.stats.stolenBases
                        }
                      })
                    }
                </TableCell>
                
                </TableRow>
                :
                ''
                )
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    <Grid item sx={{paddingRight: '200px', paddingLeft: '200px', paddingTop: '10px', paddingBottom: '20px'}}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}  size="small">
        <TableHead>
          <TableRow>
          <TableCell>Roster (Pitching)</TableCell>
          <TableCell>Innings Pitched</TableCell>
          <TableCell>ER per Inning Pitched</TableCell>
          <TableCell>Number of Pitches</TableCell>
          <TableCell>ERA</TableCell>
          <TableCell>Pitches Per Inning</TableCell>
          <TableCell>WHIP</TableCell>
          <TableCell>Wins</TableCell>
          <TableCell>Win %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rosterStatsMap.map((player) => {
               return(player.PositionCategory == 'P' ? 
               <TableRow
                key={player.LastName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
               >
                <TableCell component="th" scope="row">
                    <Link to={`/player/${player.PlayerID}`}>{player.FirstName + ' ' + player.LastName + ' ('+player.Position+')'}</Link>
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.inningsPitched
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return ((stat.stats.era/stat.stats.inningsPitched).toFixed(3))
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.numberOfPitches
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.era
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.pitchesPerInning
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.whip
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.wins
                        }
                      })
                    }
                </TableCell>
                <TableCell component="th" scope="row">
                    {
                      player.stats.map(stat => {
                        if (stat.group == 'pitching') {
                            return stat.stats.winPercentage
                        }
                      })
                    }
                </TableCell>
                </TableRow>
                :
                ''
                )
          })}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    </Grid>
  )
}
