import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { partial, isEmpty, isNull, assign } from 'lodash';

import * as mapActions from '../actions/mapActions';
import * as diseaseActions from '../actions/diseaseActions';
import * as cardActions from '../actions/cardActions';
import { getCurrentCityId, canBuildStation, canTreatColor, getDiseaseStatus, canCureDisease,
  getPlayerHand, getPlayerOverHandLimit } from '../selectors';

import MoveCityPicker from '../components/MoveCityPicker';
import DiscardOverLimitPicker from '../components/DiscardOverLimitPicker';


class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.onDiscardCardPicked = this.onDiscardCardPicked.bind(this);
  }

  onDiscardCardPicked(cardType, id) {
    if (cardType === 'city') {
      this.props.actions.discardFromHand('city', this.props.playerToDiscard, id);
    }
  }

  render() {
    const { availableCities } = this.props.currentMove;
    const { playerToDiscard } = this.props;
    return (
      <div className="actions">
        {!isEmpty(availableCities) &&
          <MoveCityPicker
            availableCities={availableCities}
            currentCityId={this.props.currentCityId}
            moveToCity={this.props.actions.moveToCity}
            moveCancel={this.props.actions.moveCancel} />}
        {!isNull(playerToDiscard) &&
          <DiscardOverLimitPicker
            hand={this.props.getPlayerHand(playerToDiscard)}
            playerId={playerToDiscard}
            onCardPicked={this.onDiscardCardPicked} />}
        <button onClick={partial(this.props.actions.moveInit, 0)}>Move</button>
        <button onClick={partial(this.props.actions.buildStation, this.props.currentCityId)} disabled={!this.props.canBuildStation}>Station</button>
        {['red', 'blue', 'yellow', 'black'].map((color) =>
          <span key={color}>
            <button onClick={partial(this.props.actions.treatDisease, this.props.currentCityId, color)}
              disabled={!this.props.canTreatColor(color)}>
              Treat {this.props.getDiseaseStatus(color) !== 'active' ? 'all ' : ''}{color}
            </button>
            <button onClick={partial(this.props.actions.cureDisease, color)}disabled={!this.props.canCureDisease(color)}>Cure {color}</button>
          </span>
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { currentMove: state.currentMove, currentCityId: getCurrentCityId(state), canBuildStation: canBuildStation(state),
    canTreatColor: partial(canTreatColor, state), getDiseaseStatus: partial(getDiseaseStatus, state),
    canCureDisease: partial(canCureDisease, state), getPlayerHand: partial(getPlayerHand, state),
    playerToDiscard: getPlayerOverHandLimit(state) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(assign({}, mapActions, diseaseActions, cardActions), dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
