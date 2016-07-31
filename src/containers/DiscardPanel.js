import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Glyphicon, Tabs, Tab } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import CardList from '../components/CardList';
import { getPlayerDiscard, getInfectionDiscard } from '../selectors';
import { cardType } from '../constants/propTypes';


class DiscardPanel extends React.Component {
  static propTypes = {
    playerDiscard: PropTypes.arrayOf(cardType.isRequired).isRequired,
    infectionDiscard: PropTypes.arrayOf(cardType.isRequired).isRequired
  }

  constructor(props) {
    super(props);
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  state = {
    showDrawer: false
  }

  toggleDrawer() {
    this.setState({ showDrawer: !this.state.showDrawer });
  }

  render() {
    const { playerDiscard, infectionDiscard } = this.props;
    let items;
    if (this.state.showDrawer) {
      items = [
        <Button
          key="button"
          onClick={this.toggleDrawer}
          bsStyle="warning">
          <Glyphicon glyph="chevron-up" />
        </Button>,

          <Tabs
            key="tabs"
            defaultActiveKey={2}
            id="discard-tabs"
            className="discard-tabs">
            <Tab
              eventKey={1}
              title={<span className="player-discard" />}>
              {!!playerDiscard.length &&
                <CardList cards={playerDiscard} />
              }
              {!playerDiscard.length &&
                <div className="empty">Player Discard is empty.</div>
              }
            </Tab>
            <Tab
              eventKey={2}
              title={<span className="infection-discard" />}>
              {!!infectionDiscard.length &&
                <CardList cards={infectionDiscard} />
              }
              {!infectionDiscard.length &&
                <div className="empty">Infection Discard is empty.</div>
              }
            </Tab>
          </Tabs>];

    } else {
      items = (
        <Button
          onClick={this.toggleDrawer}
          bsStyle="warning">
          Discard<br/> <Glyphicon glyph="chevron-down" />
        </Button>
      );
    }
    return (
      <ReactCSSTransitionGroup
        transitionName="fade"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
        className={classnames(['discard-drawer', { 'open': this.state.showDrawer }])}>
       {items}
      </ReactCSSTransitionGroup>
    );
  }
}

const mapStateToProps = (state) => ({
  playerDiscard: getPlayerDiscard(state),
  infectionDiscard: getInfectionDiscard(state)
});

export default connect(mapStateToProps)(DiscardPanel);
