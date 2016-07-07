import React from 'react';


const Card = ({ cardType, id }) =>
  <div className={`card ${cardType} ${cardType}-${id}`}></div>;

export default Card;
