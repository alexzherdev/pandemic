import React, { PropTypes } from 'react';
import { flatten } from 'lodash';
import classnames from 'classnames';

import Card from '../Card';
import CardWrapper from '../CardWrapper';
import { cardType } from '../../constants/propTypes';


export default class CardDrawerDrawingPlayerCards extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(cardType).isRequired,
    startingDraw: PropTypes.bool.isRequired,
    onEpidemicHandle: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onAnimationStart = this.onAnimationStart.bind(this);
  }

  onAnimationStart(cardType, id, e) {
    if (e.animationName === 'flash') {
      setTimeout(() => {
        this.props.onEpidemicHandle(cardType, id);
      }, 3000);
    }
  }

  render() {
    const { cards, startingDraw } = this.props;
    const items = flatten(cards.map((c, i) => {
      if (c.handling || !startingDraw) {
        return (
          <CardWrapper
            key={c.id}
            {...c}
            className={classnames({
              'move-to-hand': c.handling && c.cardType !== 'epidemic',
              'animated flash': c.cardType === 'epidemic'
            })}
            onAnimationStart={this.onAnimationStart} />
        );
      } else {
        return (
          <div className="card invisible" key={`flip-${c.id}-${i}`}>
            <div className="card front player-deck" />
            <Card
              {...c}
              className="back" />
          </div>
        );
      }
    }));

    return (
      <div className="card-drawer">
        {items}
      </div>
    );
  }
}
