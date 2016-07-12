import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';

import { createQuickGameInit } from '../actions/globalActions';
import QuickGame from '../components/setup/QuickGame';


class Setup extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onQuickGameClicked = this.onQuickGameClicked.bind(this);
    this.onQuickNumberOfPlayersPicked = this.onQuickNumberOfPlayersPicked.bind(this);
  }

  state = {
    mode: null
  }

  onQuickGameClicked() {
    this.setState({ mode: 'quick' });
  }

  onQuickNumberOfPlayersPicked(n) {
    this.props.dispatch(createQuickGameInit(n));
  }

  render() {
    return (
      <div className="setup">
        {this.state.mode === null &&
          <div className="menu">
            <Button bsSize="large" onClick={this.onQuickGameClicked}>Quick Game</Button>
          </div>
        }
        {this.state.mode === 'quick' &&
          <QuickGame onNumberOfPlayersPicked={this.onQuickNumberOfPlayersPicked} />
        }
      </div>
    );
  }
}

export default withRouter(connect()(Setup));
