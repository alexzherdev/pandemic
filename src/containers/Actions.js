import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import classnames from 'classnames';

import * as actions from '../actions/mapActions';


class Actions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showDriveOptions: false };
  }

  getDriveOptions() {
    const options = [];
    this.props.state.map.matrix[this.props.state.map.players[0]].forEach((v, i) => {
      if (v === 1) {
        options.push(i);
      }
    });
    return options;
  }

  render() {
    return (
      <div className="actions">
        <div className={classnames({ 'hide' : !this.state.showDriveOptions })}>
          {this.getDriveOptions().map((o) =>
            <button key={o} onClick={_.partial(this.props.actions.requestDrive, 0, o)}>{o}</button>
          )}
        </div>
        <button onClick={() => { this.setState({ showDriveOptions: true }); }}>Drive</button>
        <button>Direct</button>
        <button>Charter</button>
        <button>Shuttle</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { state };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
