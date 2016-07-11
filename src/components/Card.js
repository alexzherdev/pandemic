import React, { PropTypes } from 'react';
import { cardProps } from '../constants/propTypes';


const Card = ({ cardType, id, className }) =>
  <div className={`card ${cardType} ${cardType}-${id} ${className}`}></div>;

Card.propTypes = {
  ...cardProps,
  className: PropTypes.string
};

export default Card;
