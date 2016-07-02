import React from 'react';


export default class PlayersLayer extends React.Component {
  transitionPlayerMove(playerId, coords, callback) {
    const playerEl = document.getElementById('player-' + playerId);
    const anim = playerEl.animate([
      { left: playerEl.style.left, top: playerEl.style.top, opacity: 1},
      { left: playerEl.style.left, top: playerEl.style.top, opacity: .01, offset: .49 },
      { left: coords[1] + 'px', top: coords[0] + 'px', opacity: .01, offset: .5 },
      { left: coords[1] + 'px', top: coords[0] + 'px', opacity: 1 }
    ], 1000);
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
