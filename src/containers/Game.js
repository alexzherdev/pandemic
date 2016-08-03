import React, { PropTypes } from 'react';
import { Button, Popover } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty, partial } from 'lodash';
import classnames from 'classnames';
const Preload = require('react-preload').Preload;

import TopBar from './TopBar';
import Map from './Map';
import TeamPanel from '../components/TeamPanel';
import LoadingScreen from '../components/LoadingScreen';
import BottomBar from './BottomBar';
import CardLayer from './CardLayer';
import DiscardPanel from './DiscardPanel';
import ContinueOverlay from '../components/overlays/ContinueOverlay';
import EpidemicOverlay from '../components/overlays/EpidemicOverlay';
import NewTurnOverlay from '../components/overlays/NewTurnOverlay';
import DefeatMessage from '../components/overlays/DefeatMessage';
import VictoryMessage from '../components/overlays/VictoryMessage';
import DiseaseStatus from '../components/overlays/DiseaseStatus';
import IntroDialog from '../components/IntroDialog';
import StateReporter from './StateReporter';
import * as mapActions from '../actions/mapActions';
import * as globalActions from '../actions/globalActions';
import { getPlayers, getCurrentCityId, getPlayerCityId, getPlayerHand,
  getInitialInfectedCity, getDefeatMessage, isEpidemicInProgress, getContinueMessage,
  getCureInProgress, getCurrentPlayer } from '../selectors';
import { playerProps, playerType } from '../constants/propTypes';
import { IMAGES_TO_PRELOAD } from '../utils';


const HINT_STORAGE_KEY = 'DOUBLE_CLICK_HINT_DISMISSED';

class Game extends React.Component {
  static propTypes = {
    currentMove: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(
      PropTypes.shape({
        ...playerProps,
        cityId: PropTypes.string.isRequired
      })
    ),
    currentPlayerId: PropTypes.string,
    currentPlayer: playerType,
    currentCityId: PropTypes.string,
    getPlayerCityId: PropTypes.func.isRequired,
    getPlayerHand: PropTypes.func.isRequired,
    status: PropTypes.oneOf(['prepare', 'playing', 'defeat', 'victory']).isRequired,
    initialInfectedCity: PropTypes.string,
    defeatMessage: PropTypes.string,
    continueMessage: PropTypes.object,
    isEpidemicInProgress: PropTypes.bool.isRequired,
    cureInProgress: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    ['onCityClicked', 'onCityDoubleClicked', 'onIntroClosed', 'onDoubleClickHintClosed'].forEach((meth) => {
      this[meth] = this[meth].bind(this);
    });
  }

  state = {
    showIntro: true,
    initialInfectedCity: null,
    isNewTurn: false,
    doubleClickHintDismissed: !!localStorage.getItem(HINT_STORAGE_KEY)
  }

  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, () =>
      'Do you want to leave the game?');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.initialInfectedCity !== nextProps.initialInfectedCity) {
      this.setState({ initialInfectedCity: nextProps.initialInfectedCity });
    }
    this.setState({ isNewTurn: this.props.currentPlayerId !== nextProps.currentPlayerId });
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

  onIntroClosed() {
    this.setState({ showIntro: false });
    this.props.actions.dealCardsInit();
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

  onDoubleClickHintClosed() {
    localStorage.setItem(HINT_STORAGE_KEY, 'true');
    this.setState({ doubleClickHintDismissed: true });
  }

  render() {
    const { status, defeatMessage, isEpidemicInProgress, players, getPlayerHand, currentPlayerId,
      continueMessage, cureInProgress } = this.props;
    return (
      <Preload
        loadingIndicator={<LoadingScreen />}
        images={IMAGES_TO_PRELOAD}
        autoResolveDelay={30000}
        resolveOnError={true}
        mountChildren={true}>
        <div className={classnames(['game modal-container animated fadeIn', { 'epidemic' : isEpidemicInProgress }])}>
          <StateReporter />
          {status === 'playing' && !this.state.doubleClickHintDismissed &&
            <Popover
              className="double-click-hint"
              placement="bottom"
              positionLeft={10}
              positionTop={0}
              title={
                <div>
                  Hint
                  <Button
                    bsStyle="link"
                    onClick={this.onDoubleClickHintClosed}>&times;</Button>
                </div>
              }>
              You can double-click on a neighbor city to drive to it.
            </Popover>
          }
          <DiscardPanel />
          <TopBar />
          {status !== 'prepare' &&
            <BottomBar />
          }
          <Map
            ref="map"
            onCityClicked={this.onCityClicked}
            onCityDoubleClicked={this.onCityDoubleClicked}
            initialInfectedCity={this.state.initialInfectedCity} />
          {status !== 'prepare' &&
            <TeamPanel
              players={players}
              getPlayerHand={getPlayerHand}
              currentPlayerId={currentPlayerId} />
          }
          <CardLayer
            map={this.refs.map && this.refs.map.getWrappedInstance()}
            initialInfectedCity={this.state.initialInfectedCity} />
          {status === 'prepare' && this.state.showIntro &&
            <IntroDialog
              players={players}
              container={this}
              onClosed={this.onIntroClosed} />
          }
          {continueMessage &&
            <ContinueOverlay
              message={continueMessage.message}
              onContinue={partial(this.props.dispatch, continueMessage.action)} />
          }
          {status === 'defeat' &&
            <div className="overlay defeat-overlay" />
          }
          {status === 'defeat' &&
            <DefeatMessage message={defeatMessage} />
          }
          {status === 'victory' &&
            <VictoryMessage />
          }
          {cureInProgress &&
            <DiseaseStatus
              color={cureInProgress}
              status="cured"
              onAnimationComplete={this.props.actions.animationCureDiseaseComplete} />
          }
          {isEpidemicInProgress &&
            <EpidemicOverlay onAnimationComplete={this.props.actions.continueTurn} />
          }
          {this.state.isNewTurn &&
            <NewTurnOverlay player={this.props.currentPlayer} />
          }
        </div>
      </Preload>
    );
  }
}

const mapStateToProps = (state) => ({
  currentMove: state.currentMove,
  players: getPlayers(state),
  currentPlayerId: state.currentMove.player,
  currentCityId: getCurrentCityId(state),
  getPlayerCityId: partial(getPlayerCityId, state),
  getPlayerHand: partial(getPlayerHand, state),
  status: state.status,
  initialInfectedCity: getInitialInfectedCity(state),
  defeatMessage: getDefeatMessage(state),
  continueMessage: getContinueMessage(state),
  isEpidemicInProgress: isEpidemicInProgress(state),
  cureInProgress: getCureInProgress(state),
  currentPlayer: getCurrentPlayer(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...mapActions, ...globalActions }, dispatch),
  dispatch
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));
