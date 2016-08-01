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
import { isDriveAvailable, getInfectionCardDrawn, getEpidemicInfectionCard, isPlaying } from '../selectors';
import { getCubeOrigin, getLocationOrigin, getPathCoords } from '../utils';
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
    infectionCardDrawn: PropTypes.shape({
      id: PropTypes.string
    }),
    epidemicInfectionCard: PropTypes.shape({
      id: PropTypes.string
    }),
    isPlaying: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.onWindowResize = this.onWindowResize.bind(this);
  }

  state = {
    width: styles.map.width,
    height: styles.map.height
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isPlaying !== this.props.isPlaying) {
      setTimeout(this.onWindowResize, 0); // seems like we need to wait until dimensions are up-to-date
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  getWidth() {
    return this.state.width;
  }

  getHeight() {
    return this.state.height;
  }

  onWindowResize() {
    const { map } = this.refs;
    this.setState({ width: map.offsetWidth, height: map.offsetHeight });
  }

  transitionPlayerMove(playerId, destinationId, fireCompleteAction = false) {
    const origin = getLocationOrigin(this.props.map.locations[destinationId], this.state.width, this.state.height);
    this.refs.players.transitionPlayerMove(
      playerId,
      [origin.top, origin.left],
      fireCompleteAction && this.props.actions.animationMoveComplete);
  }

  calculatePaths() {
    const paths = [];
    const { matrix, locations } = this.props.map;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < i; j++) {
        if (matrix[i][j] === 1) {
          const begin = getPathCoords(locations[i], this.state.width, this.state.height);
          const end = getPathCoords(locations[j], this.state.width, this.state.height);
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
      const cityCoords = getLocationOrigin(this.props.map.locations[cityId], this.state.width, this.state.height);
      const playerCoords = playersToIterate.map((id, i) => ({ id, coords: [cityCoords.top, cityCoords.left + i * 4]}));
      playerCoords.reverse();
      return acc.concat(playerCoords);
    }, []);
  }

  render() {
    const { map, availableCities, players, currentPlayerId, isDriveAvailable, isPlaying } = this.props;
    const { govGrantCities, airlift, outbreak: { infectingCube }, actionsLeft } = this.props.currentMove;
    const playersPositions = this.calculatePlayersPositions();
    const paths = this.calculatePaths();
    const citiesToSelect = find([availableCities, govGrantCities, airlift && airlift.cities], (c) => !isEmpty(c));

    let origin, destination, color;
    if (!isEmpty(infectingCube)) {
      origin = getCubeOrigin(map.locations[infectingCube.originId], this.state.width, this.state.height),
        destination = getCubeOrigin(map.locations[infectingCube.cityId], this.state.width, this.state.height),
        color = infectingCube.color;
    }
    return (
      <div
        className="map"
        ref="map">
        <PathsLayer
          width={this.state.width}
          paths={paths} />
        <LocationsLayer
          locations={map.locations}
          cities={cities}
          availableCities={citiesToSelect}
          onCityClicked={this.props.onCityClicked}
          onCityDoubleClicked={this.props.onCityDoubleClicked}
          isDriveAvailable={isPlaying ? isDriveAvailable : () => false}
          infectedCity={this.props.initialInfectedCity || this.props.infectionCardDrawn.id || this.props.epidemicInfectionCard.id}
          width={this.state.width}
          height={this.state.height} />
        <PlayersLayer
          ref="players"
          players={players}
          playersPositions={playersPositions}
          currentPlayerId={(isPlaying && actionsLeft > 0) ? currentPlayerId : undefined} />
        <CubesLayer
          locations={map.locations}
          width={this.state.width}
          height={this.state.height}
          infectingCube={isEmpty(infectingCube) ? undefined : { origin, destination, color }}
          infectNeighborCallback={partial(this.props.actions.animationInfectNeighborComplete,
            infectingCube.cityId, infectingCube.originId, infectingCube.color)} />
        {actionsLeft === 0 && <div className="mask" />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  map: state.map,
  players: state.players,
  currentMove: state.currentMove,
  availableCities: state.currentMove.availableCities,
  currentPlayerId: state.currentMove.player,
  isDriveAvailable: partial(isDriveAvailable, state),
  infectionCardDrawn: getInfectionCardDrawn(state),
  epidemicInfectionCard: getEpidemicInfectionCard(state),
  isPlaying: isPlaying(state)
});

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...mapActions, ...globalActions }, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(Map);
