import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'react-bootstrap';

import { createQuickGameInit, createCustomGameInit } from '../actions/globalActions';
import QuickGame from '../components/setup/QuickGame';
import CustomGame from '../containers/CustomGame';
import Footer from '../components/setup/Footer';


class Setup extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onQuickGameClicked = this.onQuickGameClicked.bind(this);
    this.onQuickNumberOfPlayersPicked = this.onQuickNumberOfPlayersPicked.bind(this);
    this.onCustomGameClicked = this.onCustomGameClicked.bind(this);
    this.onCustomGameComplete = this.onCustomGameComplete.bind(this);
    this.showMenu = this.showMenu.bind(this);
  }

  state = {
    mode: null
  }

  onQuickGameClicked() {
    this.setState({ mode: 'quick' });
  }

  onCustomGameClicked() {
    this.setState({ mode: 'custom' });
  }

  onQuickNumberOfPlayersPicked(n) {
    this.props.dispatch(createQuickGameInit(n));
  }

  onCustomGameComplete(players, difficulty) {
    this.props.dispatch(createCustomGameInit(players, difficulty));
  }

  showMenu() {
    this.setState({ mode: null });
  }

  render() {
    return (
      <div className="setup">
        <div className="container">
          <h1 className="text-danger">Epidemic</h1>
          {this.state.mode === null &&
            <div className="menu">
              <Button bsSize="large" onClick={this.onQuickGameClicked}>Quick Start</Button>
              <Button bsSize="large" onClick={this.onCustomGameClicked}>Custom Game</Button>
            </div>
          }
          {this.state.mode === 'quick' &&
            <QuickGame
              onNumberOfPlayersPicked={this.onQuickNumberOfPlayersPicked}
              onBackClicked={this.showMenu} />
          }
          {this.state.mode === 'custom' &&
            <CustomGame
              onComplete={this.onCustomGameComplete}
              onBackClicked={this.showMenu} />
          }
        </div>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect()(Setup));
