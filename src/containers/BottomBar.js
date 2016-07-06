import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Panel } from 'react-bootstrap';
import { partial, isEmpty } from 'lodash';
import classnames from 'classnames';

import Actions from './Actions';
import SingleCardPicker from '../components/SingleCardPicker';
import CityPicker from '../components/CityPicker';
import MultiCardPicker from '../components/MultiCardPicker';
import PlayerPicker from '../components/PlayerPicker';
import DiseasePicker from '../components/DiseasePicker';
import Hand from './Hand';
import { getPlayerToDiscard, getPlayerHand, getTreatableDiseases, canTreatAllOfColor, canTreatAll,
  getCurrentCityId, getCurrentPlayer, isDispatcher, getPlayers, getEventsInHands, getInfectionDiscard } from '../selectors';
import * as mapActions from '../actions/mapActions';
import * as cardActions from '../actions/cardActions';
import * as diseaseActions from '../actions/diseaseActions';
import * as globalActions from '../actions/globalActions';


class BottomBar extends React.Component {
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
      this.props.actions.discardFromHand('city', this.props.playerToDiscard, id);
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
    this.props.actions.discardFromHand('city', this.props.currentPlayer.id, id);
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

  onResPopCardPicked(id) {
    this.props.actions.resPopRemoveCard(id);
  }

  onResPopUsed() {
    this.props.actions.playEventInit(this.props.currentMove.resPop.suggestOwner, 'res_pop');
  }

  onContinueTurn() {
    this.props.actions.continueTurn();
  }

  render() {
    const { playerToDiscard, players, treatableDiseases, infectionDiscard } = this.props;
    const { shareCandidates, curingDisease, airlift, opsMoveAbility, contPlannerEvents,
      availableCities, govGrantCities, resPop } = this.props.currentMove;
    let content;
    if (playerToDiscard !== null) {
      content = (
        <SingleCardPicker
          hand={this.props.getPlayerHand(playerToDiscard)}
          onCardPicked={this.onDiscardCardPicked} />
      );
    } else if (!isEmpty(shareCandidates)) {
      content = (
        <PlayerPicker
          players={shareCandidates}
          onPlayerPicked={this.onShareCandidatePicked}
          onCancel={this.props.actions.shareCardsCancel} />
      );
    } else if (!isEmpty(curingDisease)) {
      content = (
        <MultiCardPicker
          cards={curingDisease.cards}
          countNeeded={this.props.cardsNeededToCure}
          onSubmit={this.onCureCardsPicked}
          onCancel={this.props.actions.cureDiseaseCancel} />
      );
    } else if (!isEmpty(airlift) && !airlift.playerId) {
      content = (
        <PlayerPicker
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
          diseases={Object.keys(treatableDiseases)}
          onDiseasePicked={this.onTreatColorPicked} />
      );
    } else if (!isEmpty(this.state.dispatcherPlayers)) {
      content = (
        <PlayerPicker
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
        <CityPicker
          cities={infectionDiscard}
          onSubmit={this.onResPopCardPicked} />
      );
    } else if (resPop.suggestOwner) {
      content = (
        <div>
          <Button onClick={this.onResPopUsed}>Use res pop</Button>
          <Button onClick={this.onContinueTurn}>Continue</Button>
        </div>
      );
    } else {
      content = ([
        <Hand key="hand" />,
        <Actions
          key="actions"
          onShowTreatColors={this.onShowTreatColors}
          onTreatColorPicked={this.onTreatColorPicked}
          onMoveInit={this.onMoveInit}
          onPlayEventClicked={this.chooseEvent} />
      ]);
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
  getPlayerHand: partial(getPlayerHand, state),
  treatableDiseases: getTreatableDiseases(state),
  canTreatAll: canTreatAll(state),
  canTreatAllOfColor: partial(canTreatAllOfColor, state),
  isDispatcher: isDispatcher(state),
  players: getPlayers(state),
  events: getEventsInHands(state),
  infectionDiscard: getInfectionDiscard(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, mapActions, cardActions, diseaseActions, globalActions), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
