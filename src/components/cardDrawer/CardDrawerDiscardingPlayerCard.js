import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import CardWrapper from '../CardWrapper';
import { cardType } from '../../constants/propTypes';


export default class CardDrawerDiscardingPlayerCard extends React.Component {
  static propTypes = {
    card: cardType.isRequired,
    getPlayerDiscard: PropTypes.func.isRequired,
    isCurrentPlayerDiscarding: PropTypes.bool.isRequired,
    onAnimationComplete: PropTypes.func.isRequired
  }

  componentDidMount() {
    const card = findDOMNode(this.refs.card);
    card.addEventListener('animationend', (e) => {
      if (e.animationName === this.getAnimationName()) {
        const playerDiscard = findDOMNode(this.props.getPlayerDiscard());
        const src = $(card).offset();
        const discardOffset = $(playerDiscard).offset();

        const animation = card.animate([
          { transform: `translate(0, 0) scale(1)` },
          { transform: `translate(${discardOffset.left - src.left}px, ${discardOffset.top - src.top}px) scale(0.2)` }
        ], {
          duration: 500,
          fill: 'forwards'
        });
        animation.onfinish = this.props.onAnimationComplete;
      }
    });
  }

  getAnimationName() {
    return this.props.isCurrentPlayerDiscarding ? 'fadeInUp' : 'fadeInRightBig';
  }

  render() {
    return (
      <div className="card-drawer">
        <CardWrapper
          ref="card"
          className={`animated ${this.getAnimationName()}`}
          {...this.props.card} />
      </div>
    );
  }
}
