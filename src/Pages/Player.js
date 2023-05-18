import React from 'react'
import { useParams } from 'react-router'
import SkeletonLoad from "../Components/SkeletonLoad";
import Box from "@mui/material/Box";

export default function Player() {
  const [data, setData] = React.useState([])
  
  const { key } = useParams()




  async function fetchRoster() {
    // main_home needs: teams, standings, news
    try {
        const response = await fetch(`http://127.0.0.1:4444/player?id=${key}`);
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
  }



  React.useEffect(() => {
    fetchRoster()
  }, []);
  if (data.length == 0) {
    return (
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <SkeletonLoad />
      </Box>
    )
  }
  return (
    <div></div>
  )
}
