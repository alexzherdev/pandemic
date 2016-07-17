import React, { PropTypes } from 'react';
import classnames from 'classnames';

import Card from '../components/Card';
import { cardProps, diseaseType } from '../constants/propTypes';


const Hand = ({ hand }) => {
  const items = hand.map((card) =>
    <Card
      key={card.id}
      cardType={card.cardType}
      id={card.id}
      className={classnames({ 'invisible': card.handling })} />);
  return (
    <div className="hand">
      {items}
    </div>
  );
};

Hand.propTypes = {
  hand: PropTypes.arrayOf(PropTypes.shape({
    ...cardProps,
    name: PropTypes.string,
    color: diseaseType
  }).isRequired).isRequired
};

export default Hand;
