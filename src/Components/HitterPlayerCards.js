import React from 'react'
import { Typography } from '@mui/material';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import useStore from '../store'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PlayerStatTabs from './PlayerStatTabs'

export default function HitterPlayerCards({ i, active, topPlayers, player }) {
  const data = useStore(state => state.mainData)
  const user = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)
  const isLoggedIn = useStore(state => state.isLoggedIn)

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('0');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const getProperBookmarkStatus = (id) => {
    if (isLoggedIn) {
      if (user.favorites.find(fav => fav.id == id) == undefined) {
        return <IconButton id={id} onClick={addFav} sx={{ height: '22px', width: '22px' }}><BookmarkBorderIcon sx={{ height: '15px', width: '15px' }} /></IconButton>
      } else {
        return <IconButton id={id} onClick={removeFav} sx={{ height: '22px', width: '22px' }}><BookmarkIcon sx={{ height: '15px', width: '15px' }} /></IconButton>
      }
    } else {
      return ''
    }
  }



  const MAX_VISIBILITY = 3


  return (
    <div className='card-container' style={{
      '--active': i === active ? 1 : 0,
      '--offset': (active - i) / 3,
      '--direction': Math.sign(active - i),
      '--abs-offset': Math.abs(active - i) / 3,
      'opacity': Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
      'display': 'flex',
      'justifyContent': 'center'
    }}>
      <Card key={i} sx={{
        'width': '12rem',
        'height': '17rem',
        'padding': '1rem',
        display: 'flex',
        alignItems: 'center',
        pl: 2,
        bgcolor: 'background.default',
        flexDirection: 'column'
      }}>
        <Grid container flexDirection='column'>
          <Grid item container justifyContent='space-between'>
            <Grid item>
              <Typography variant='caption'>
                {getProperBookmarkStatus(topPlayers.player_info[player][0].id)}
                {player}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton sx={{ height: '1rem', width: '1rem' }} id={topPlayers.player_info[player][0].id} onClick={handleClickOpen} aria-label="info">
                <InfoIcon sx={{ height: '1rem', width: '1rem' }} />
              </IconButton>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{marginLeft: '64px' }}

              >
                <Grid container sx={{ height: '30rem', width: '37rem'}} justifyContent='center' flexDirection='column' alignContent='center'>
                  <DialogTitle id="alert-dialog-title">
                    {getProperBookmarkStatus(topPlayers.player_info[player][0].id)}{player}
                  </DialogTitle>
                  <DialogContent>
                    playerstuff
                  </DialogContent>
                  <DialogContent>
                    
                      
                        <PlayerStatTabs id={topPlayers.player_info[player][0].id} p={player} />

                  
                  </DialogContent>
                </Grid>
              </Dialog>
            </Grid>
          </Grid>
          <Grid item alignSelf='center'>
            <PersonIcon sx={{ height: '10rem', width: '3rem' }} />
          </Grid>
          <Grid item alignSelf='center'>
            {
              ` ${topPlayers.player_info[player][0].primaryPosition.abbreviation}`
            }
          </Grid>
          <Grid item alignSelf='center'>
            {
              data[0].teams.teams.find(team => (topPlayers.player_info[player][0].currentTeam.id == team.id)).abbreviation + ' ' + data[0].teams.teams.find(team => (topPlayers.player_info[player][0].currentTeam.id == team.id)).clubName
            }
          </Grid>
          <Grid item alignSelf='center'>
          </Grid>
        </Grid>
      </Card>
    </div>

  )
}
