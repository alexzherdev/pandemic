import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty, partial } from 'lodash';

import TopBar from './TopBar';
import Map from './Map';
import TeamPanel from './TeamPanel';
import BottomBar from './BottomBar';
import CardLayer from './CardLayer';
import * as mapActions from '../actions/mapActions';
import { getPlayers, getCurrentCityId, getPlayerCityId } from '../selectors';


class Game extends React.Component {
  static propTypes = {
    currentMove: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        cityId: PropTypes.string.isRequired
      })
    ),
    currentPlayerId: PropTypes.string.isRequired,
    currentCityId: PropTypes.string.isRequired,
    getPlayerCityId: PropTypes.func.isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    ['onCityClicked', 'onCityDoubleClicked'].forEach((meth) => {
      this[meth] = this[meth].bind(this);
    });
  }

  doMovePlayer(destinationId, source) {
    const { playerToMove } = this.props.currentMove;
    let playerId, originId;
    if (playerToMove) {
      playerId = playerToMove;
      originId = this.props.getPlayerCityId(playerId);
    } else {
      playerId = this.props.currentPlayerId;
      originId = this.props.currentCityId;
    }

    this.refs.map.getWrappedInstance().transitionPlayerMove(playerId, destinationId, true);
    this.props.actions.moveToCity(
      playerId,
      originId,
      destinationId,
      source);
  }

  onCityClicked(id) {
    const { availableCities, airlift, govGrantCities } = this.props.currentMove;
    if (!isEmpty(availableCities)) {
      const { source } = availableCities[id];
      this.doMovePlayer(id, source);
    } else if (!isEmpty(govGrantCities)) {
      this.props.actions.govGrantBuildStation(id);
    } else if (!isEmpty(airlift) && !isEmpty(airlift.cities)) {
      this.refs.map.getWrappedInstance().transitionPlayerMove(airlift.playerId, id);
      this.props.actions.airliftMoveToCity(airlift.playerId, id);
    }
  }

  onCityDoubleClicked(id) {
    this.doMovePlayer(id, 'drive');
  }


  render() {
    return (
      <div className="game">
        <TopBar />
        <TeamPanel />
        <BottomBar />
        <Map
          ref="map"
          onCityClicked={this.onCityClicked}
          onCityDoubleClicked={this.onCityDoubleClicked} />
        <CardLayer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentMove: state.currentMove,
  players: getPlayers(state),
  currentPlayerId: state.currentMove.player,
  currentCityId: getCurrentCityId(state),
  getPlayerCityId: partial(getPlayerCityId, state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...mapActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Game);
