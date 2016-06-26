import React from 'react';

import TopBar from './TopBar';
import Map from './Map';
import TeamPanel from './TeamPanel';
import BottomBar from './BottomBar';


export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.onPlayerMoved = this.onPlayerMoved.bind(this);
  }

  onPlayerMoved(playerId, destinationId) {
    this.refs.map.getWrappedInstance().transitionPlayerMove(playerId, destinationId);
  }

  render() {
    return (
      <div className="game">
        <TopBar />
        <TeamPanel />
        <BottomBar onPlayerMoved={this.onPlayerMoved} />
        <Map ref="map"/>
      </div>
    );
  }
}
