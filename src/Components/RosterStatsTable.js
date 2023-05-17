import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';




export default function RosterStatsTable({roster, stats}) {
  const rosterStatsMap = roster.map(player => {
    const stat = stats.find(i2 => i2.first_name === player.FirstName.normalize('NFD').replace(/[\u0300-\u036f]/g, '') && i2.last_name === player.LastName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    if (stat) {
        return {...player, ...stat}
    }
    return stat
  })


  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>Roster (Hitting)</TableCell>
          <TableCell>Batting Avg</TableCell>
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
                    {player.FirstName + ' ' + player.LastName + ' ('+player.Position+')'}
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
                </TableRow>
                :
                ''
                )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
