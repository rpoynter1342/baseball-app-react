//credits to https://codepen.io/ykadosh/pen/ZEJLapj
import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'; // Grid version 1
import useStore from '../store'
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip'
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import LastSevenGroup from './LastSevenGroup';
import RealTimeUpdates from './RealTimeUpdates'
import LiveGameCard from './LiveGameCard';
import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

export default function Carousel() {
    const [active, setActive] = React.useState(0);
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
    const MAX_VISIBILITY = 3
    const count = data[0].schedule.dates[7].games.length
    const [liveGames, setLiveGames] = React.useState({});

// ...



    React.useEffect(() => {
      const games = [717952, 717957]
      const callLiveGame = () => {
        data[0].schedule.dates[7].games.forEach(game => {
          if (game.status.abstractGameState == 'Live') {

              socket.emit('get game data', game.gamePk, () => {
                console.log(`socketing ${game.gamePk}`)
              });
           
              
            
          }
        })
      }
      
      const liveInterval = setInterval(callLiveGame, 3000)

      socket.on('game data response', function(gameData) {
        const gamePk = Object.keys(gameData)[0]; // Get the gamePk from the keys of the gameData object
        setLiveGames(prevGames => ({
          ...prevGames,
          [gamePk]: gameData[gamePk] // Use the gamePk as the key and get the corresponding game data
        }));
      });

      
    }, [socket])
    
    // console.log(liveGames)
    return (
      <div className='carousel'>
        {active > 0 && <div className='nav left' onClick={() => setActive(i => i - 1)}><IconButton><ArrowBackIosNewIcon/></IconButton></div>}
        
          
          {
            data[0].schedule.dates[7].games.map((game, i) => {
              
              const idHome = game.teams.home.team.id
              const idAway = game.teams.away.team.id
              // console.log(game)
              return (
                <LiveGameCard game={game} liveGames={liveGames} i={i} idHome={idHome} idAway={idAway} active={active}/>
              )
            })
          }
        {active < count - 1 && <div className='nav right' onClick={() => setActive(i => i + 1)}><IconButton><ArrowForwardIosIcon/></IconButton></div>}
      </div>
    )
}
