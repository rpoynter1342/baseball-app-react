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
  console.log(roster)
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Roster (Hitting)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            roster.map((player) => {
               return(player.PositionCategory != 'P' ? 
               <TableRow
                key={player.LastName}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
               >
                <TableCell component="th" scope="row">
                    {player.FirstName + ' ' + player.LastName}
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
