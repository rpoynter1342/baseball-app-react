import {create} from 'zustand'

import {devtools, persist} from 'zustand/middleware'

import Players from './Pages/Players'
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import Player from './Pages/Player'
import WhatshotIcon from '@mui/icons-material/Whatshot';
import Team from './Pages/Team'
import Home from "./Pages/Home";
import HomeIcon from "@mui/icons-material/Home";
import TopPlayers from './Pages/TopPlayers';
import StarIcon from '@mui/icons-material/Star';
import Teams from './Pages/Teams';
import GroupsIcon from '@mui/icons-material/Groups';
import CurrentGames from './Pages/CurrentGames';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Fantasy from './Pages/Fantasy';
import Following from './Pages/Following'
import AddIcon from '@mui/icons-material/Add';
import BookmarkIcon from '@mui/icons-material/Bookmark';
const store = (set) => ({
    user: {},
    setUser: data => {
        set(state => ({
            user: data
        }))
    },
    currentGamesData: {},
    setCurrentGamesData: data => {
        set(state => ({
            currentGamesData: data
        }))
    },
    storedJwt: {},
    setStoredJwt: data => {
        set(state => ({
            storedJwt: data
        }))
    },
    isLoggedIn: false,
    setIsLoggedIn: bool => {
        set(state => ({
            isLoggedIn: bool
        }))
    },
    mainData: [],
    setMainData: (data) => {
                    set(state => ({
                        mainData: [data]
                    }))
                },
    curTeamRoster: [],
    setCurTeamRoster: (data) => {
        set(state => ({
            curTeamRoster: [data]
        }))
    },
    pages: [
        { name: 'Home', path: '/', element: <Home />, icon: <HomeIcon /> },
        { name: 'Top Players', path: '/top', element: <TopPlayers />, icon: <WhatshotIcon /> },
        { name: 'All Players', path: '/players', element: <Players />, icon: <SportsBaseballIcon /> },
        { name: 'Teams', path: '/teams', element: <Teams />, icon: <GroupsIcon /> },
        { name: 'Current Games', path: '/curGames', element: <CurrentGames />, icon: <NotificationsActiveIcon /> },
        { name: 'Favorites', path: '/favorites', element: <Following />, icon: <BookmarkIcon /> },
        { name: 'Fantasy', path: '/fantasy', element: <Fantasy />, icon: <AddIcon /> }
      ],
    
      hiddenPages: [
        { name: 'Team', path: '/team/:key', element: <Team /> },
        { name: 'Player', path: '/player/:key', element: <Player /> },
      ],

      teamLogos: {
        "teams": {
            "LAD": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Los_Angeles_Dodgers_Logo.svg",
            "CIN": "https://upload.wikimedia.org/wikipedia/commons/0/01/Cincinnati_Reds_Logo.svg",
            "TOR": "https://upload.wikimedia.org/wikipedia/en/b/ba/Toronto_Blue_Jays_logo.svg",
            "PIT": "https://upload.wikimedia.org/wikipedia/commons/8/81/Pittsburgh_Pirates_logo_2014.svg",
            "KC": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Kansas_City_Royals.svg/800px-Kansas_City_Royals.svg.png",
            "CHC": "https://upload.wikimedia.org/wikipedia/commons/8/80/Chicago_Cubs_logo.svg",
            "CLE": "https://upload.wikimedia.org/wikipedia/en/a/a9/Guardians_winged_%22G%22.svg",
            "TB": "https://upload.wikimedia.org/wikipedia/en/c/c6/Tampa_Bay_Rays.svg",
            "PHI": "https://upload.wikimedia.org/wikipedia/en/f/f0/Philadelphia_Phillies_%282019%29_logo.svg",
            "SEA": "https://upload.wikimedia.org/wikipedia/en/6/6d/Seattle_Mariners_logo_%28low_res%29.svg",
            "AZ": "https://upload.wikimedia.org/wikipedia/en/5/54/Arizona_Diamondbacks_logo_%28low_res%29.svg",
            "SF": "https://upload.wikimedia.org/wikipedia/en/5/58/San_Francisco_Giants_Logo.svg",
            "CWS": "https://upload.wikimedia.org/wikipedia/commons/c/c1/Chicago_White_Sox.svg",
            "DET": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Detroit_Tigers_logo.svg",
            "NYM": "https://upload.wikimedia.org/wikipedia/en/7/7b/New_York_Mets.svg",
            "BAL": "https://upload.wikimedia.org/wikipedia/en/7/75/Baltimore_Orioles_cap.svg",
            "MIN": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Minnesota_Twins_Insignia.svg",
            "LAA": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Los_Angeles_Angels_of_Anaheim.svg",
            "MIA": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Marlins_team_logo.svg/800px-Marlins_team_logo.svg.png",
            "COL": "https://upload.wikimedia.org/wikipedia/commons/3/31/Colorado_Rockies_logo.svg",
            "OAK": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Oakland_A%27s_logo.svg",
            "BOS": "https://upload.wikimedia.org/wikipedia/en/6/6d/RedSoxPrimary_HangingSocks.svg",
            "ATL": "https://upload.wikimedia.org/wikipedia/en/f/f2/Atlanta_Braves.svg",
            "TEX": "https://upload.wikimedia.org/wikipedia/en/4/41/Texas_Rangers.svg",
            "NYY": "https://upload.wikimedia.org/wikipedia/commons/2/25/NewYorkYankees_PrimaryLogo.svg",
            "HOU": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Houston-Astros-Logo.svg",
            "STL": "https://upload.wikimedia.org/wikipedia/en/9/9d/St._Louis_Cardinals_logo.svg",
            "MIL": "https://upload.wikimedia.org/wikipedia/en/b/b8/Milwaukee_Brewers_logo.svg",
            "SD": "https://upload.wikimedia.org/wikipedia/commons/e/e2/SD_Logo_Brown.svg",
            "WSH": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Washington_Nationals_logo.svg"
        }
    },
      
})

const useStore = create(store)

export default useStore