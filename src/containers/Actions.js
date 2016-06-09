import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { partial, isEmpty, isNull, values } from 'lodash';

import * as mapActions from '../actions/mapActions';
import * as diseaseActions from '../actions/diseaseActions';
import * as cardActions from '../actions/cardActions';
import { getCurrentCityId, canBuildStation, canTreatColor, canTreatAllOfColor, canCureDisease,
  getPlayerHand, getPlayerOverHandLimit, getCurrentPlayer, canShareCards, cardsNeededToCure } from '../selectors';

import CityPicker from '../components/CityPicker';
import DiscardOverLimitPicker from '../components/DiscardOverLimitPicker';
import PlayerPicker from '../components/PlayerPicker';
import MultiCardPicker from '../components/MultiCardPicker';


class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.onDiscardCardPicked = this.onDiscardCardPicked.bind(this);
    this.onShareCandidatePicked = this.onShareCandidatePicked.bind(this);
    this.onCureCardsPicked = this.onCureCardsPicked.bind(this);
    this.onMoveCityPicked = this.onMoveCityPicked.bind(this);
    this.onGovGrantCityPicked = this.onGovGrantCityPicked.bind(this);
  }

  onDiscardCardPicked(cardType, id) {
    if (cardType === 'city') {
      this.props.actions.discardFromHand('city', this.props.playerToDiscard, id);
    } else {
      this.props.actions.playEvent(this.props.playerToDiscard, id);
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

  onMoveCityPicked(id) {
    this.props.actions.moveToCity(
      this.props.currentPlayer.id,
      this.props.currentCityId,
      id,
      this.props.currentMove.availableCities[id].source);
  }

  onGovGrantCityPicked(id) {
    this.props.actions.govGrantBuildStation(id);
  }

  render() {
    const { availableCities, shareCandidates, curingDisease, govGrantCities } = this.props.currentMove;
    const { playerToDiscard, currentPlayer } = this.props;
    return (
      <div className="actions">
        {!isNull(playerToDiscard) &&
          <DiscardOverLimitPicker
            hand={this.props.getPlayerHand(playerToDiscard)}
            playerId={playerToDiscard}
            onCardPicked={this.onDiscardCardPicked} />}
        <button
          onClick={partial(this.props.actions.moveInit, currentPlayer.id)}
          disabled={!isEmpty(availableCities)}>Move</button>
        {!isEmpty(availableCities) &&
          <CityPicker
            cities={values(availableCities)}
            onSubmit={this.onMoveCityPicked}
            onCancel={this.props.actions.moveCancel} />}
        <button
          onClick={partial(this.props.actions.buildStation, this.props.currentCityId)}
          disabled={!this.props.canBuildStation}>Station</button>
        <button
          onClick={this.props.actions.shareCardsInit}
          disabled={!this.props.canShareCards || !isEmpty(shareCandidates)}>Share</button>
        {!isEmpty(shareCandidates) &&
          <PlayerPicker
            players={shareCandidates}
            onPlayerPicked={this.onShareCandidatePicked}
            onCancel={this.props.actions.shareCardsCancel} />}
        {['red', 'blue', 'yellow', 'black'].map((color) =>
          <span key={color}>
            <button
              onClick={partial(this.props.canTreatAllOfColor(color)
                ? this.props.actions.treatAllDisease
                : this.props.actions.treatDisease, this.props.currentCityId, color)}
              disabled={!this.props.canTreatColor(color)}>
              Treat {this.props.canTreatAllOfColor(color) ? 'all ' : ''}{color}
            </button>
            <button
              onClick={partial(this.props.actions.cureDiseaseInit, color)}
              disabled={!this.props.canCureDisease(color)}>Cure {color}</button>
          </span>
        )}
        {!isEmpty(curingDisease) &&
          <MultiCardPicker
            cards={curingDisease.cards}
            countNeeded={this.props.cardsNeededToCure}
            onSubmit={this.onCureCardsPicked}
            onCancel={this.props.actions.cureDiseaseCancel} />
        }
        {!isEmpty(govGrantCities) &&
          <CityPicker
            cities={govGrantCities}
            onSubmit={this.onGovGrantCityPicked} />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { currentMove: state.currentMove, currentCityId: getCurrentCityId(state), canBuildStation: canBuildStation(state),
    canTreatColor: partial(canTreatColor, state), canTreatAllOfColor: partial(canTreatAllOfColor, state),
    canCureDisease: partial(canCureDisease, state), getPlayerHand: partial(getPlayerHand, state),
    playerToDiscard: getPlayerOverHandLimit(state), currentPlayer: getCurrentPlayer(state),
    canShareCards: canShareCards(state), cardsNeededToCure: cardsNeededToCure(state) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(Object.assign({}, mapActions, diseaseActions, cardActions), dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
