import React from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import { partial, sortBy } from 'lodash';

import { getPlayers, getPlayerHand, getCurrentPlayer } from '../selectors';
import TeamPlayerHand from '../components/TeamPlayerHand';


class TeamPanel extends React.Component {
  sortHand(hand) {
    return sortBy(hand, ['cardType', 'color', 'name']);
  }

  render() {
    return (
      <Panel className="team-panel">
        {this.props.players.map((p) =>
          <TeamPlayerHand
            key={p.id}
            player={p}
            hand={this.sortHand(this.props.getPlayerHand(p.id))}
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
