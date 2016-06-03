import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Map extends React.Component {
  render() {
    const map = this.props.map;
    const locations = [];
    _.forOwn(this.props.cities, (c, id) => {
      locations.push(<span className="city" key={id} style={{top: map.locations[id][0], left: map.locations[id][1]}}>{c.name}</span>);
    });
    const players = [];
    _.forOwn(this.props.players, (p, id) => {
      const loc = map.locations[map.players[id]];
      players.push(<span className="player" key={id} style={{top: loc[0], left: loc[1]}}>{p.name}</span>);
    });
    return (
      <div className="map">
        {locations}
        {players}
      </div>
    );
  }
}

const mapStateToProps = ({ map, players, cities }) => {
  return { map, players, cities };
};


export default connect(mapStateToProps)(Map);
