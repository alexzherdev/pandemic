import React, { PropTypes } from 'react';

import { playerType } from '../../constants/propTypes';


export default class PlayersLayer extends React.Component {
  static propTypes = {
    players: PropTypes.objectOf(playerType.isRequired).isRequired,
    playersPositions: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      coords: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    })).isRequired,
    currentPlayerId: PropTypes.string.isRequired
  }

  transitionPlayerMove(playerId, coords, callback) {
    const playerEl = document.getElementById('player-' + playerId);
    const anim = playerEl.animate([
      { left: playerEl.style.left, top: playerEl.style.top, opacity: 1},
      { left: playerEl.style.left, top: playerEl.style.top, opacity: .01, offset: .49 },
      { left: coords[1] + 'px', top: coords[0] + 'px', opacity: .01, offset: .5 },
      { left: coords[1] + 'px', top: coords[0] + 'px', opacity: 1 }
    ], 500);
    anim.onfinish = callback;
  }

  render() {
    const { players, playersPositions, currentPlayerId } = this.props;
    const items = [];

    playersPositions.forEach((pos) => {
      const loc = pos.coords;
      items.push(
        <span
          id={`player-${pos.id}`}
          key={pos.id}
          className={`player ${players[pos.id].role}`}
          style={{top: loc[0], left: loc[1]}}>
          {pos.id === currentPlayerId &&
            <span className="cur-player glyphicon glyphicon-triangle-bottom" />
          }
        </span>
      );
    });
    return (
      <div>
        {items}
      </div>
    );
  }
}
