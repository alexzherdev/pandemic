import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Card from '../components/Card';
import { getCurrentPlayerHand } from '../selectors';
import { cardProps, diseaseType } from '../constants/propTypes';


class Hand extends React.Component {
  static propTypes = {
    hand: PropTypes.arrayOf(PropTypes.shape({
      ...cardProps,
      name: PropTypes.string,
      color: diseaseType
    }).isRequired).isRequired
  }

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
    hand: getCurrentPlayerHand(state)
  };
};

export default connect(mapStateToProps)(Hand);
