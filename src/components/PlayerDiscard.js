import React from 'react';
import classnames from 'classnames';

import { cardType } from '../constants/propTypes';


export default class PlayerDiscard extends React.Component {
  static propTypes = {
    discardTop: cardType
  }

  render() {
    const card = this.props.discardTop;
    const classes = ['card', 'deck-icon', 'player-discard',
      { 'empty': !card }];
    if (card) {
      classes.push(`${card.cardType} ${card.cardType}-${card.id}`);
    }
    return (
      <span
        className={classnames(classes)} />
    );
  }
}
