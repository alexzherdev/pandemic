import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { playerType } from '../../constants/propTypes';


export default class CardDrawerDealing extends React.Component {
  static propTypes = {
    isDealingEpidemicCards: PropTypes.bool.isRequired,
    difficulty: PropTypes.number.isRequired,
    playerIndex: PropTypes.number,
    newPlayerDealing: PropTypes.bool,
    cardsDealtCount: PropTypes.number,
    getPlayerDeck: PropTypes.func,
    players: PropTypes.arrayOf(playerType.isRequired).isRequired,
    startingEpidemicInsertion: PropTypes.bool,
    onDealCardsInitComplete: PropTypes.func,
    onDealCardsComplete: PropTypes.func,
    onInsertEpidemicCardsComplete: PropTypes.func
  }

  componentDidMount() {
    const { dealDeck } = this.refs;
    const playerDeck = this.props.getPlayerDeck();
    const playerDeckOffset = $(playerDeck).offset();
    const src = $(dealDeck).offset();
    const anim = dealDeck.animate([
      { transform: `translate(${playerDeckOffset.left - src.left}px,
        ${playerDeckOffset.top - src.top}px) scale(0.2)` },
      { transform: `translate(0, 0) scale(1)` }
    ], {
      duration: 500,
      fill: 'forwards'
    });
    $(playerDeck).addClass('empty');
    $(dealDeck).removeClass('invisible');
    anim.onfinish = this.props.onDealCardsInitComplete;
  }

  componentDidUpdate() {
    const { dealDeck, dealCard } = this.refs;
    const { playerIndex, newPlayerDealing } = this.props;
    const deckOffset = $(dealDeck).offset();

    if (newPlayerDealing && playerIndex !== null) {
      const { cardsDealtCount, players } = this.props;

      $(dealCard).offset(deckOffset).removeClass('hide');

      let cardsLeftToDeal = cardsDealtCount;

      const animateFn = () => {
        const animation = dealCard.animate([
          { transform: 'translate(0, 0)' },
          { transform: `translate(${window.innerWidth - deckOffset.left}px,
            ${playerIndex / players.length * window.innerHeight - deckOffset.top}px)`}
        ], {
          duration: 200
        });
        cardsLeftToDeal--;
        animation.onfinish = cardsLeftToDeal > 0 ? animateFn : this.props.onDealCardsComplete;
      };
      animateFn();
    } else if (this.props.startingEpidemicInsertion) {
      this.epidemics.forEach((el, i) => {
        const cardOffset = $(el).offset();
        setTimeout(function(offset, j) {
          const animation = el.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${deckOffset.left - offset.left}px,
              ${deckOffset.top - offset.top}px)`, opacity: 0 }
          ], {
            duration: 300,
            fill: 'forwards'
          });

          if (j === this.epidemics.length - 1) {
            animation.onfinish = () => {
              setTimeout(() => {
                const playerDeck = this.props.getPlayerDeck();
                const playerDeckOffset = $(playerDeck).offset();
                const src = $(this.refs.dealDeck).offset();
                const anim = this.refs.dealDeck.animate([
                  { transform: `translate(0, 0) scale(1)` },
                  { transform: `translate(${playerDeckOffset.left - src.left}px, ${playerDeckOffset.top - src.top}px) scale(0.2)` }
                ], {
                  duration: 500,
                  fill: 'forwards'
                });
                anim.onfinish = () => {
                  $(playerDeck).removeClass('empty');
                  this.props.onInsertEpidemicCardsComplete();
                };
              }, 500);
            };
          }
        }.bind(this, cardOffset, i), 300 * (i + 1));
      });
    }
  }

  render() {
    this.epidemics = [];
    const { isDealingEpidemicCards, difficulty, playerIndex } = this.props;
    const items = isDealingEpidemicCards ? [
      <div
        key="dealDeck"
        ref="dealDeck"
        className="card player-deck" />,
      <div
        key="epidemics"
        className="epidemics">
        {Array(difficulty).fill().map((_, i) =>
          <div
            key={i}
            ref={(el) => el !== null && this.epidemics.push(el)}
            className="card epidemic" />)
        }
      </div>
    ] : [
      <div
        key="dealDeck"
        ref="dealDeck"
        className={classnames(['card', 'player-deck', { 'invisible': playerIndex === null }])} />,
      playerIndex !== null &&
        <div
          key="dealCard"
          ref="dealCard"
          className="card player-deck dealing hide" />
    ];
    return (
      <div className="card-drawer">
        {items}
      </div>
    );
  }
}
