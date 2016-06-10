import React from 'react';
import { connect } from 'react-redux';
import { partial } from 'lodash';

import { playEventInit } from '../actions/cardActions';
import { getEventsInHands } from '../selectors';


class Events extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.events.map((c) =>
          <button key={c.id} onClick={partial(this.props.dispatch, playEventInit(c.playerId, c.id))}>{c.name}</button>)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    events: getEventsInHands(state)
  };
};

export default connect(mapStateToProps)(Events);
