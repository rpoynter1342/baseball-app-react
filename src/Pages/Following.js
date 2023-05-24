import React from 'react'
import useStore from '../store'

import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

export default function Following() {

  const user = useStore(state => state.user)
  const data = useStore(state => state.mainData)
  const logos = useStore(state => state.teamLogos)

  return (
    <Grid container display='flex' justifyContent='space-around' alignContent='center'>
      
    </Grid>
  )
}
