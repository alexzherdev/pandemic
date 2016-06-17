import React from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';

import { allDiseases, getPlayerDeckCount, getInfectionRate } from '../selectors';


class TopBar extends React.Component {
  render() {
    return (
      <Panel className="top-bar">
        <span className="player-deck">
          <span className="top-icon player-deck-icon" />
          <span>{this.props.playerDeckCount}</span>
        </span>
        {allDiseases().map((c) =>
          <span key={c}>
            <span className={`top-icon cube-icon-${c}`} />
            <span>{this.props.cubesLeft[c]}</span>
          </span>
        )}

        <span>
          <span className="top-icon stations-icon" />
          <span>{this.props.stationsLeft}</span>
        </span>

        <span>
          <span className="top-icon infection-rate-icon" />
          <span>{this.props.infectionRate}</span>
        </span>

        <span>
          <span className="top-icon outbreaks-icon" />
          <span>{this.props.outbreaks}</span>
        </span>

        <span className="top-icon infection-deck-icon" />
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  cubesLeft: state.cubesLeft, stationsLeft: state.stationsLeft, playerDeckCount: getPlayerDeckCount(state),
  infectionRate: getInfectionRate(state), outbreaks: state.outbreaks
});

export default connect(mapStateToProps)(TopBar);
