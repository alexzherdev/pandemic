import React from 'react';


const Card = ({ cardType, id, className }) =>
  <div className={`card ${cardType} ${cardType}-${id} ${className}`}></div>;

export default Card;
