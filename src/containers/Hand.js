import React from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import { getCurrentPlayerHand } from '../selectors';


class Hand extends React.Component {
  render() {
    const renderCard = (card) =>
      <Card key={card.id} name={card.cardType === 'epidemic' ? card.name : this.props.cities[card.id].name} />;
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
    cities: state.cities,
    cardsDrawn: state.currentMove.cardsDrawn
  };
};

export default connect(mapStateToProps)(Hand);
