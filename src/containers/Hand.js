import React from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';


class Hand extends React.Component {
  render() {
    const items = this.props.hand.map((card) =>
      <Card key={card.id} name={this.props.cities[card.id].name} />
    );
    return (
      <div className="hand">{items}</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hand: state.players[0].hand,
    cities: state.cities
  };
};

export default connect(mapStateToProps)(Hand);
