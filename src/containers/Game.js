import React from 'react';

import TopBar from '../containers/TopBar';
import Map from '../containers/Map';
import Actions from '../containers/Actions';


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
        <Actions onPlayerMoved={this.onPlayerMoved} />
        <Map ref="map"/>
      </div>
    );
  }
}
