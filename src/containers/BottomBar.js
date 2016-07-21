import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Panel } from 'react-bootstrap';
import { partial, isEmpty } from 'lodash';
import classnames from 'classnames';

import Actions from './Actions';
import SingleCardPicker from '../components/SingleCardPicker';
import MultiCardPicker from '../components/MultiCardPicker';
import PlayerPicker from '../components/PlayerPicker';
import DiseasePicker from '../components/DiseasePicker';
import ForecastBar from './ForecastBar';
import { getPlayerToDiscard, getTreatableDiseases, canTreatAllOfColor, canTreatAll,
  getCurrentCityId, getCurrentPlayer, isDispatcher, getPlayers, getEventsInHands, getInfectionDiscard,
  getPlayerHand, cardsNeededToCure, getDiscardingCard } from '../selectors';
import * as mapActions from '../actions/mapActions';
import * as cardActions from '../actions/cardActions';
import * as diseaseActions from '../actions/diseaseActions';
import * as globalActions from '../actions/globalActions';
import { playerType, playerProps, cardType, cardProps, eventCardType } from '../constants/propTypes';


class BottomBar extends React.Component {
  static propTypes = {
    currentCityId: PropTypes.string.isRequired,
    currentPlayer: playerType.isRequired,
    currentMove: PropTypes.object.isRequired,
    playerToDiscard: PropTypes.string,
    discardingCard: cardType,
    getPlayerHand: PropTypes.func.isRequired,
    treatableDiseases: PropTypes.objectOf(PropTypes.number.isRequired),
    canTreatAll: PropTypes.bool.isRequired,
    canTreatAllOfColor: PropTypes.func.isRequired,
    isDispatcher: PropTypes.bool.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
      ...playerProps,
      cityId: PropTypes.string.isRequired
    }).isRequired).isRequired,
    events: PropTypes.arrayOf(eventCardType.isRequired).isRequired,
    infectionDiscard: PropTypes.arrayOf(PropTypes.shape({
      ...cardProps,
      name: PropTypes.string.isRequired
    }).isRequired).isRequired,
    cardsNeededToCure: PropTypes.number.isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    ['onShowTreatColors', 'onTreatColorPicked', 'onDiscardCardPicked', 'onShareCandidatePicked',
      'onCureCardsPicked', 'onAirliftPlayerPicked', 'onOpsCardPicked', 'onContPlannerCardPicked',
      'onMoveInit', 'onDispatcherPlayerPicked', 'onDispatcherCancel', 'chooseEvent', 'onEventPicked',
      'onResPopCardPicked', 'onResPopUsed', 'onContinueTurn'].forEach((meth) => {
      this[meth] = this[meth].bind(this);
    });

    this.state = {
      showTreatColors: false,
      dispatcherPlayers: [],
      events: []
    };
  }

  onMoveInit() {
    if (this.props.isDispatcher) {
      this.setState({ dispatcherPlayers: this.props.players });
    } else {
      this.props.actions.moveInit(this.props.currentPlayer.id);
    }
  }

  onShowTreatColors() {
    this.setState({ showTreatColors: true });
  }

  onTreatColorPicked(color) {
    this.doTreat(color);
    this.setState({ showTreatColors: false });
  }

  doTreat(color) {
    const { treatableDiseases, canTreatAll, canTreatAllOfColor, currentCityId } = this.props;
    const shouldTreatAll = canTreatAll || canTreatAllOfColor(color);
    const count = shouldTreatAll ? treatableDiseases[color] : 1;
    this.props.actions[shouldTreatAll ? 'treatAllDisease' : 'treatDisease'](currentCityId, color, count);
  }

  onDiscardCardPicked(cardType, id) {
    if (cardType === 'city') {
      this.props.actions.discardFromHandInit('city', this.props.playerToDiscard, id);
    } else {
      this.props.actions.playEventInit(this.props.playerToDiscard, id);
    }
  }

  onShareCandidatePicked(id, share) {
    const { currentPlayer } = this.props;
    const [giver, receiver] =
      share === 'giver' ? [id, currentPlayer.id] : [currentPlayer.id, id];

    this.props.actions.shareCard(giver, receiver, this.props.currentCityId);
  }

  onCureCardsPicked(ids) {
    this.props.actions.cureDiseaseComplete(ids, this.props.currentMove.curingDisease.color);
  }

  onAirliftPlayerPicked(id) {
    this.props.actions.airliftChoosePlayer(id);
  }

  onOpsCardPicked(cardType, id) {
    this.props.actions.discardFromHandInit('city', this.props.currentPlayer.id, id);
  }

  onContPlannerCardPicked(cardType, id) {
    this.props.actions.contPlannerChooseEvent(this.props.currentPlayer.id, id);
  }

  onDispatcherPlayerPicked(id) {
    if (id === this.props.currentPlayer.id) {
      this.props.actions.moveInit(this.props.currentPlayer.id);
    } else {
      this.props.actions.dispatcherChoosePlayer(id);
    }
    this.setState({ dispatcherPlayers: [] });
  }

  onDispatcherCancel() {
    this.setState({ dispatcherPlayers: [] });
  }

  chooseEvent() {
    this.setState({ events: this.props.events });
  }

  onEventPicked(cardType, id, playerId) {
    this.setState({ events: [] });
    this.props.actions.playEventInit(playerId, id);
  }

  onResPopCardPicked(cardType, id) {
    this.props.actions.resPopRemoveCard(id);
  }

  onResPopUsed() {
    this.props.actions.playEventInit(this.props.currentMove.resPop.suggestOwner, 'res_pop');
  }

  onContinueTurn() {
    this.props.actions.continueTurn();
  }

  render() {
    const { playerToDiscard, players, treatableDiseases, infectionDiscard, cardsNeededToCure, discardingCard } = this.props;
    const { shareCandidates, curingDisease, airlift, opsMoveAbility, contPlannerEvents,
      availableCities, govGrantCities, resPop, forecastCards } = this.props.currentMove;
    let content;
    if (playerToDiscard !== null) {
      if (isEmpty(discardingCard)) {
        content = (
          <SingleCardPicker
            title="Discard a city card or play an event:"
            hand={this.props.getPlayerHand(playerToDiscard)}
            onCardPicked={this.onDiscardCardPicked} />
        );
      } else {
        content = null;
      }
    } else if (!isEmpty(shareCandidates)) {
      content = (
        <PlayerPicker
          title="Pick a player to share with:"
          players={shareCandidates}
          onPlayerPicked={this.onShareCandidatePicked}
          onCancel={this.props.actions.shareCardsCancel} />
      );
    } else if (!isEmpty(curingDisease)) {
      content = (
        <MultiCardPicker
          title={`Pick ${cardsNeededToCure} cards to cure the ${curingDisease.color} disease:`}
          cards={curingDisease.cards}
          countNeeded={cardsNeededToCure}
          onSubmit={this.onCureCardsPicked}
          onCancel={this.props.actions.cureDiseaseCancel} />
      );
    } else if (!isEmpty(airlift) && !airlift.playerId) {
      content = (
        <PlayerPicker
          title="Pick a player to move:"
          players={players}
          onPlayerPicked={this.onAirliftPlayerPicked} />
      );
    } else if (!isEmpty(opsMoveAbility.cards)) {
      content = (
        <SingleCardPicker
          hand={opsMoveAbility.cards}
          onCardPicked={this.onOpsCardPicked} />
      );
    } else if (!isEmpty(contPlannerEvents)) {
      content = (
        <SingleCardPicker
          hand={contPlannerEvents}
          onCardPicked={this.onContPlannerCardPicked} />
      );
    } else if (this.state.showTreatColors) {
      content = (
        <DiseasePicker
          title="Pick a disease to treat:"
          diseases={Object.keys(treatableDiseases)}
          onDiseasePicked={this.onTreatColorPicked} />
      );
    } else if (!isEmpty(this.state.dispatcherPlayers)) {
      content = (
        <PlayerPicker
          title="Pick a player to move:"
          players={this.state.dispatcherPlayers}
          onPlayerPicked={this.onDispatcherPlayerPicked}
          onCancel={this.onDispatcherCancel} />
      );
    } else if (!isEmpty(this.state.events)) {
      content = (
        <SingleCardPicker
          hand={this.state.events}
          onCardPicked={this.onEventPicked} />
      );
    } else if (resPop.chooseCard) {
      content = (
        <SingleCardPicker
          title="Pick a card to remove from the infection discard pile:"
          hand={infectionDiscard}
          onCardPicked={this.onResPopCardPicked} />
      );
    } else if (resPop.suggestOwner) {
      content = (
        <div>
          <Button onClick={this.onResPopUsed}>Use res pop</Button>
          <Button onClick={this.onContinueTurn}>Continue</Button>
        </div>
      );
    } else if (!isEmpty(forecastCards)) {
      content = (
        <ForecastBar
          cards={forecastCards}
          onSubmit={this.props.actions.forecastShuffle} />
      );
    } else {
      content = (
        <Actions
          key="actions"
          onShowTreatColors={this.onShowTreatColors}
          onTreatColorPicked={this.onTreatColorPicked}
          onMoveInit={this.onMoveInit}
          onPlayEventClicked={this.chooseEvent} />
      );
    }

    const classes = classnames(['bottom-bar', { 'hide': !isEmpty(availableCities) || !isEmpty(govGrantCities) }]);
    return (
      <Panel className={classes}>
        {content}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  currentCityId: getCurrentCityId(state),
  currentPlayer: getCurrentPlayer(state),
  currentMove: state.currentMove,
  playerToDiscard: getPlayerToDiscard(state),
  discardingCard: getDiscardingCard(state),
  getPlayerHand: partial(getPlayerHand, state),
  treatableDiseases: getTreatableDiseases(state),
  canTreatAll: canTreatAll(state),
  canTreatAllOfColor: partial(canTreatAllOfColor, state),
  isDispatcher: isDispatcher(state),
  players: getPlayers(state),
  events: getEventsInHands(state),
  infectionDiscard: getInfectionDiscard(state),
  cardsNeededToCure: cardsNeededToCure(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...mapActions, ...cardActions, ...diseaseActions, ...globalActions }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
