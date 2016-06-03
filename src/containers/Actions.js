import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { partial, map } from 'lodash';
import classnames from 'classnames';

import * as actions from '../actions/mapActions';
import { getCurrentCityId } from '../selectors';


class Actions extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="actions">
        <div>
          {map(this.props.currentMove.availableCities, (o, id) =>
            <button key={id} onClick={partial(this.props.actions.moveToCity, 0, this.props.currentCityId, id, o.source)}>{o.name}</button>
          )}
        </div>
        <button onClick={partial(this.props.actions.moveInit, 0)}>Move</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { currentMove: state.currentMove, currentCityId: getCurrentCityId(state) };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
