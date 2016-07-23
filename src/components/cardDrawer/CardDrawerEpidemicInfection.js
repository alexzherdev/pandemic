import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import Card from '../Card';
import { cardType } from '../../constants/propTypes';


export default class CardDrawerEpidemicInfection extends React.Component {
  static propTypes = {
    infectionCard: cardType.isRequired,
    getInfectionDeck: PropTypes.func.isRequired,
    getInfectionDiscard: PropTypes.func.isRequired,
    onAnimationComplete: PropTypes.func.isRequired
  }

  componentDidMount() {
    const infectionDeck = this.props.getInfectionDeck();
    $(infectionDeck).addClass('empty');
    const { deckCopy } = this.refs;
    const src = $(deckCopy).offset();
    const deckOffset = $(infectionDeck).offset();
    const animation = deckCopy.animate([
      { transform: `translate(${deckOffset.left - src.left}px, ${deckOffset.top - src.top}px) scale(0.2)` },
      { transform: `translate(0, 0) scale(1)` }
    ], {
      duration: 500,
      fill: 'forwards'
    });
    animation.onfinish = () => {
      const { front } = this.refs;
      const { bottomCard } = this.refs;
      $(bottomCard).offset($(front).offset()).removeClass('hide');
      const frontSlide = front.animate([
        { transform: 'translateX(0)' }, { transform: 'translateX(150px)' }
      ], {
        duration: 500,
        fill: 'forwards'
      });
      frontSlide.onfinish = () => {
        const cardFlip = bottomCard.animate([
          { transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }
        ], {
          duration: 500,
          fill: 'forwards'
        });
        cardFlip.onfinish = () => {
          const infectionDiscard = this.props.getInfectionDiscard();
          const discardOffset = $(findDOMNode(infectionDiscard)).offset();
          const cardSrc = $(bottomCard).offset();
          const returnCard = bottomCard.animate([
            { transform: `translate(0, 0) scale(1) rotateY(180deg)` },
            { transform: `translate(${discardOffset.left - cardSrc.left - bottomCard.offsetWidth}px, ${discardOffset.top - cardSrc.top}px) scale(0.2) rotateY(180deg)` }
          ], {
            delay: 500,
            duration: 500,
            fill: 'forwards'
          });
          returnCard.onfinish = () => {
            this.props.onAnimationComplete();
            $(infectionDeck).removeClass('empty');
          };
          const frontOffset = $(front).offset();
          const slideLength = 150;
          front.animate([
            { transform: `translate(${slideLength}px, 0) scale(1)` },
            { transform: `translate(${deckOffset.left - frontOffset.left + slideLength}px, ${deckOffset.top - frontOffset.top}px) scale(0.2)` }
          ], {
            delay: 500,
            duration: 500,
            fill: 'forwards'
          });
        };
      };
    };
  }

  render() {
    return (
      <div className="card-drawer">
        <div
          ref="bottomCard"
          className="card flipper hide absolute">
          <div
            className="card infection-deck front" />
          <Card {...this.props.infectionCard} className="back" />
        </div>
        <div
          ref="deckCopy"
          className="card deck-copy">
          <div
            ref="front"
            className="card infection-deck" />
        </div>
      </div>
    );
  }
}
