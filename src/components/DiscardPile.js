import React, { PropTypes } from 'react';
import classnames from 'classnames';

import { cardType } from '../constants/propTypes';


export default class DiscardPile extends React.Component {
  static propTypes = {
    discardTop: cardType,
    className: PropTypes.string
  }

  render() {
    const card = this.props.discardTop;
    const classes = ['card', 'deck-icon', this.props.className,
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
