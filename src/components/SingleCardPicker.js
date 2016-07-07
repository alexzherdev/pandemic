import React from 'react';
import { Button } from 'react-bootstrap';
import { partial } from 'lodash';


const SingleCardPicker = ({ hand, onCardPicked }) =>
  <div>
    {hand.map((o) =>
      <Button
        className={`card ${o.cardType}-${o.id}`}
        id={o.id}
        key={o.id}
        onClick={partial(onCardPicked, o.cardType, o.id, o.playerId)}></Button>
    )}
  </div>;

export default SingleCardPicker;
