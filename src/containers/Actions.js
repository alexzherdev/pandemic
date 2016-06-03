import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { partial, isEmpty, assign } from 'lodash';

import * as mapActions from '../actions/mapActions';
import * as diseaseActions from '../actions/diseaseActions';
import { getCurrentCityId, canBuildStation, canTreatColor, getDiseaseStatus, canCureDisease } from '../selectors';

import MoveCityPicker from '../components/MoveCityPicker';


class Actions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { availableCities } = this.props.currentMove;
    return (
      <div className="actions">
        {!isEmpty(availableCities) &&
          <MoveCityPicker
            availableCities={availableCities}
            currentCityId={this.props.currentCityId}
            moveToCity={this.props.actions.moveToCity}
            moveCancel={this.props.actions.moveCancel} />}
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
    canCureDisease: partial(canCureDisease, state) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(assign({}, mapActions, diseaseActions), dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
