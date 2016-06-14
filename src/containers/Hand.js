import React from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import { getCurrentPlayerHand } from '../selectors';
import cities from '../constants/cities';
import events from '../constants/events';


class Hand extends React.Component {
  render() {
    const renderCard = (card) => {
      let name;
      switch (card.cardType) {
        case 'city':
          name = cities[card.id].name;
          break;
        case 'event':
          name = events[card.id].name;
          break;
        default:
          name = card.name;
      }
      return (
        <Card key={card.id} name={name} />
      );
    };

    const items = this.props.hand.map(renderCard);
    const drawn = this.props.cardsDrawn.map(renderCard);
    return (
      <div className="hand">
        Hand: {items}
        Drawn: {drawn}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hand: getCurrentPlayerHand(state),
    cardsDrawn: state.currentMove.cardsDrawn
  };
};

export default connect(mapStateToProps)(Hand);
