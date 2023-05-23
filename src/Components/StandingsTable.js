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
import useStore from '../store'

export default function StandingsTable() {
    console.log(teamLogos)
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    return('hi')
}
