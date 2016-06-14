import React from 'react';
import { connect } from 'react-redux';

import cities from '../constants/cities';
import PlayersLayer from '../components/map/PlayersLayer';
import LocationsLayer from '../components/map/LocationsLayer';

class Map extends React.Component {
  render() {
    const { map } = this.props;

    return (
      <div className="map">
        <LocationsLayer locations={map.locations} cities={cities} availableCities={this.props.availableCities} />
        <PlayersLayer players={this.props.players} playersLocations={map.playersLocations} locations={map.locations} />
      </div>
    );
  }
}

const mapStateToProps = ({ map, players, currentMove }) => {
  return { map, players, availableCities: currentMove.availableCities };
};


export default connect(mapStateToProps)(Map);
