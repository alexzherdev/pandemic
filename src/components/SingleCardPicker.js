import React, { PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';

import { cardProps } from '../constants/propTypes';


const SingleCardPicker = ({ title, hand, onCardPicked }) =>
  <Panel header={title} className="card-picker single-card-picker">
    {hand.map((o) =>
      <Button
        className={`card ${o.cardType}-${o.id}`}
        id={o.id}
        key={o.id}
        onClick={partial(onCardPicked, o.cardType, o.id, o.playerId)} />
    )}
  </Panel>;

SingleCardPicker.propTypes = {
  hand: PropTypes.arrayOf(
    PropTypes.shape(
      Object.assign({
        playerId: PropTypes.string
      },
      cardProps)
    ).isRequired
  ).isRequired,
  onCardPicked: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default SingleCardPicker;
