import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { invertBy, reduce, partial, find, isEmpty } from 'lodash';

import cities from '../constants/cities';
import { playerType, cityType } from '../constants/propTypes';
import PlayersLayer from '../components/map/PlayersLayer';
import LocationsLayer from '../components/map/LocationsLayer';
import PathsLayer from '../components/map/PathsLayer';
import CubesLayer from '../components/map/CubesLayer';
import * as mapActions from '../actions/mapActions';
import * as globalActions from '../actions/globalActions';
import { isDriveAvailable } from '../selectors';
import { getCubeOrigin } from '../utils';
import * as styles from '../styles';


class Map extends React.Component {
  static propTypes = {
    onCityClicked: PropTypes.func.isRequired,
    onCityDoubleClicked: PropTypes.func.isRequired,

    map: PropTypes.object.isRequired,
    players: PropTypes.objectOf(playerType.isRequired).isRequired,
    currentMove: PropTypes.object.isRequired,
    availableCities: PropTypes.objectOf(cityType).isRequired,
    currentPlayerId: PropTypes.string.isRequired,
    isDriveAvailable: PropTypes.func.isRequired,
    initialInfectedCity: PropTypes.string,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  transitionPlayerMove(playerId, destinationId, fireCompleteAction = false) {
    this.refs.players.transitionPlayerMove(playerId, this.props.map.locations[destinationId].coords,
      fireCompleteAction && this.props.actions.animationMoveComplete);
  }

  calculatePaths() {
    const paths = [];
    const { matrix, locations } = this.props.map;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < i; j++) {
        if (matrix[i][j] === 1) {
          const begin = locations[i].coords;
          const end = locations[j].coords;
          paths.push([begin.slice().reverse(), end.slice().reverse()]);
        }
      }
    }

    return paths;
  }

  calculatePlayersPositions() {
    const playersByCity = invertBy(this.props.map.playersLocations);
    return reduce(playersByCity, (acc, players, cityId) => {
      const playersToIterate = [...players];
      const currentPlayerIndex = players.indexOf(this.props.currentPlayerId);
      if (currentPlayerIndex >= 0) {
        playersToIterate.splice(currentPlayerIndex, 1);
        playersToIterate.unshift(this.props.currentPlayerId);
      }
      const cityCoords = this.props.map.locations[cityId].coords;
      const playerCoords = playersToIterate.map((id, i) => ({ id, coords: [cityCoords[0], cityCoords[1] + i * 4]}));
      playerCoords.reverse();
      return acc.concat(playerCoords);
    }, []);
  }

  render() {
    const { map, availableCities, players, currentPlayerId, isDriveAvailable } = this.props;
    const { govGrantCities, airlift, outbreak: { infectingCube }, actionsLeft } = this.props.currentMove;

    const playersPositions = this.calculatePlayersPositions();
    const paths = this.calculatePaths();
    const citiesToSelect = find([availableCities, govGrantCities, airlift && airlift.cities], (c) => !isEmpty(c));

    let origin, destination, color;
    if (!isEmpty(infectingCube)) {
      origin = getCubeOrigin(map.locations[infectingCube.originId]),
        destination = getCubeOrigin(map.locations[infectingCube.cityId]),
        color = infectingCube.color;
    }
    return (
      <div
        className="map"
        style={styles.map}>
        <PathsLayer paths={paths} />
        <LocationsLayer
          locations={map.locations}
          cities={cities}
          availableCities={citiesToSelect}
          onCityClicked={this.props.onCityClicked}
          onCityDoubleClicked={this.props.onCityDoubleClicked}
          isDriveAvailable={isDriveAvailable}
          initialInfectedCity={this.props.initialInfectedCity} />
        <PlayersLayer
          ref="players"
          players={players}
          playersPositions={playersPositions}
          currentPlayerId={currentPlayerId} />
        <CubesLayer
          locations={map.locations}
          infectingCube={isEmpty(infectingCube) ? undefined : { origin, destination, color }}
          infectNeighborCallback={partial(this.props.actions.animationInfectNeighborComplete,
            infectingCube.cityId, infectingCube.originId, infectingCube.color)} />
        {actionsLeft === 0 && <div className="mask" />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { map: state.map, players: state.players, currentMove: state.currentMove,
    availableCities: state.currentMove.availableCities, currentPlayerId: state.currentMove.player,
    isDriveAvailable: partial(isDriveAvailable, state) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...mapActions, ...globalActions }, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Map);
