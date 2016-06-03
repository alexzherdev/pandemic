import React from 'react';
import { forOwn } from 'lodash';


const PlayersLayer = ({ players, locations, playersLocations }) => {
  const items = [];
  forOwn(players, (p, id) => {
    const loc = locations[playersLocations[id]].coords;
    items.push(<span className="player" key={id} style={{top: loc[0], left: loc[1]}}>{p.name}</span>);
  });
  return (
    <div>{items}</div>
  );
};

export default PlayersLayer;
