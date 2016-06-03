import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { partial, isEmpty } from 'lodash';

import * as actions from '../actions/mapActions';
import { getCurrentCityId, canBuildStation } from '../selectors';

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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { currentMove: state.currentMove, currentCityId: getCurrentCityId(state), canBuildStation: canBuildStation(state) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
