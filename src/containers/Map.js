import React from 'react';
import { connect } from 'react-redux';

import PlayersLayer from '../components/map/PlayersLayer';
import LocationsLayer from '../components/map/LocationsLayer';

class Map extends React.Component {
  render() {
    const { map } = this.props;

    return (
      <div className="map">
        <LocationsLayer locations={map.locations} cities={this.props.cities} availableCities={this.props.availableCities} />
        <PlayersLayer players={this.props.players} playersLocations={map.playersLocations} locations={map.locations} />
      </div>
    );
  }
}

const mapStateToProps = ({ map, players, cities, currentMove }) => {
  return { map, players, cities, availableCities: currentMove.availableCities };
};


export default connect(mapStateToProps)(Map);
