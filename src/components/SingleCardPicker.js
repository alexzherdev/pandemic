import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';


const SingleCardPicker = ({ title, hand, onCardPicked }) =>
  <Panel header={title} className="card-picker single-card-picker">
    {hand.map((o) =>
      <Button
        className={`card ${o.cardType}-${o.id}`}
        id={o.id}
        key={o.id}
        onClick={partial(onCardPicked, o.cardType, o.id, o.playerId)}></Button>
    )}
  </Panel>;

export default SingleCardPicker;
