import React from 'react'
import { useParams } from 'react-router'
import SkeletonLoad from "../Components/SkeletonLoad";
import Box from "@mui/material/Box";
import RosterStatsTable from '../Components/RosterStatsTable';
import useStore from '../store'

export default function Team() {
  const data = useStore(state => state.mainData)

  // const data = useStore(state => state.mainData)
  // const setMainData = useStore(state => state.setMainData)

  const { key } = useParams()


  const curTeam = data[0].teams.find(team => {
    return team.Key == key
  })



  async function fetchRoster() {
    // main_home needs: teams, standings, news
    try {
        const response = await fetch(`http://127.0.0.1:4444/roster?key=${key}`);
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData)
        setTeamData(jsonData)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
  }



  React.useEffect(() => {
    fetchRoster()
  }, []);
  if (teamData.length == 0) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <SkeletonLoad />
      </Box>
    )
  }
  return (
    <>
        <RosterStatsTable roster={teamData.roster} stats={teamData.stats}/>
    </>
  )
}
