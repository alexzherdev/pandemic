import React from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import { getCurrentPlayerHand } from '../selectors';
import { sortHand } from '../utils';


class Hand extends React.Component {
  render() {
    const items = this.props.hand.map((card) =>
      <Card key={card.id} cardType={card.cardType} id={card.id} />);
    return (
      <div className="hand">
        {items}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hand: sortHand(getCurrentPlayerHand(state))
  };
};

export default connect(mapStateToProps)(Hand);
