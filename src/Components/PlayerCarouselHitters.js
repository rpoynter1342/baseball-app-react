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
import HitterPlayerCards from './HitterPlayerCards';
import io from 'socket.io-client';
const socket = io.connect("http://localhost:4444/")

export default function PlayerCarouselHitters({topPlayers}) {
    const [active, setActive] = React.useState(0);
    const data = useStore(state => state.mainData)
    const logos = useStore(state => state.teamLogos)
    const currentGamesData = useStore(state => state.currentGamesData)
    const setCurrentGamesData = useStore(state => state.setCurrentGamesData)
    const MAX_VISIBILITY = 3
    const count = Object.keys(topPlayers['player_info']).length
    const [liveGames, setLiveGames] = React.useState({});
    // const [active, setActive] = React.useState(0);

    return (
     
            <div className='player-carousel'>
                
                    {Object.keys(topPlayers['player_info']).map((player, i) => {
                        return(
                            <React.Fragment key={player}>
                                {active > 0 && <div className='nav left' onClick={() => setActive(i => i - 1)}><IconButton><ArrowBackIosNewIcon/></IconButton></div>}
                                    <HitterPlayerCards  i={i} active={active} topPlayers={topPlayers} player={player}/>
                                {active < count - 1 && <div className='nav right' onClick={() => setActive(i => i + 1)}><IconButton><ArrowForwardIosIcon/></IconButton></div>}
                            </React.Fragment>
                            
                        )
                    })}
                
            </div>
        
    )
}
