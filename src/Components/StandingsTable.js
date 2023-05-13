import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function StandingsTable({division}) {
    console.log(division)
    return (

      <TableContainer sx={{ maxWidth: 450, minWidth: 450 }} component={Paper}>
        <Table  size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
                <TableCell>{division[0].League + ' ' + division[0].Division}</TableCell>
                <TableCell>Rank</TableCell>
                <TableCell>Wins</TableCell>
                <TableCell>Losses</TableCell>
                <TableCell>Win PCT</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {division.map((row) => (
              <TableRow
                key={row.Name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.Key + ' ' + row.Name}
                </TableCell>
                <TableCell align="right">{row.DivisionRank}</TableCell>
                <TableCell align="right">{row.Wins}</TableCell>
                <TableCell align="right">{row.Losses}</TableCell>
                <TableCell align="right">{row.Percentage.toFixed (3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
}
