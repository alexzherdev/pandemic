import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import { partial } from 'lodash';

import { getPlayers, getPlayerHand, getCurrentPlayer } from '../selectors';
import TeamPlayerHand from '../components/TeamPlayerHand';
import { playerType } from '../constants/propTypes';


class TeamPanel extends React.Component {
  static propTypes = {
    players: PropTypes.arrayOf(playerType.isRequired).isRequired,
    getPlayerHand: PropTypes.func.isRequired,
    currentPlayer: playerType.isRequired
  }

  render() {
    return (
      <Panel className="team-panel">
        {this.props.players.map((p) =>
          <TeamPlayerHand
            key={p.id}
            player={p}
            hand={this.props.getPlayerHand(p.id)}
            isCurrent={this.props.currentPlayer.id === p.id} />
        )}
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  players: getPlayers(state), getPlayerHand: partial(getPlayerHand, state), currentPlayer: getCurrentPlayer(state)
});

export default connect(mapStateToProps)(TeamPanel);
