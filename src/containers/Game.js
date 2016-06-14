import React from 'react';

import Map from '../containers/Map';
import Hand from '../containers/Hand';
import Events from '../containers/Events';
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
        <Actions onPlayerMoved={this.onPlayerMoved} />
        <Hand />
        <Events />
        <Map ref="map"/>
      </div>
    );
  }
}
