import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid'
import { Link, Routes, Route } from "react-router-dom";

export default function StandingsTable({division, teamLogos}) {
    console.log(teamLogos)
    return (

      <TableContainer sx={{ maxWidth: 450, minWidth: 450 }} component={Paper}>
        <Table  size="small">
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
                  <Grid container alignItems="center">
                  <img src={teamLogos.teams[row.Key]} height="15px" width="15px"/> &nbsp;
                    <Link style={{ textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)' }} to={`/team/${row.Key}`}>{row.Key + ' '}{row.Name == 'Diamondbacks' ? 'DBacks' : row.Name}</Link>
                  </Grid>
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
