//credits to https://codepen.io/ykadosh/pen/ZEJLapj
import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { IconButton } from '@mui/material';
import {TiChevronLeftOutline, TiChevronRightOutline} from 'https://cdn.skypack.dev/react-icons/ti';
import useStore from '../store'


export default function Carousel({children}) {
    const [active, setActive] = React.useState(0);
    const count = React.Children.count(children);
    const MAX_VISIBILITY = 3
    return (
      <div className='carousel'>
        {active > 0 && <div className='nav left' onClick={() => setActive(i => i - 1)}><IconButton><ArrowBackIosNewIcon/></IconButton></div>}
        {React.Children.map(children, (child, i) => (
          <div className='card-container' style={{
              '--active': i === active ? 1 : 0,
              '--offset': (active - i) / 3,
              '--direction': Math.sign(active - i),
              '--abs-offset': Math.abs(active - i) / 3,
              'opacity': Math.abs(active - i) >= MAX_VISIBILITY ? '0' : '1',
              'display': Math.abs(active - i) > MAX_VISIBILITY ? 'none' : 'block',
            }}>
            {child}
          </div>
        ))}
        {active < count - 1 && <div className='nav right' onClick={() => setActive(i => i + 1)}><IconButton><ArrowForwardIosIcon/></IconButton></div>}
      </div>
    )
}
