import React from 'react'
import Player from './Player'
export default function PlayerList({players}) {
  return (
    <div>
        {
            players.map(player => {
                return <Player player={player} />
            })
        }
    </div>
  )
}
