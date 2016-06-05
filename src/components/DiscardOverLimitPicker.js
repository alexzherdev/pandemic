import React from 'react';
import { partial } from 'lodash';


const DiscardOverLimitPicker = ({ hand, onCardPicked }) =>
  <div>
    {hand.map((o) =>
      <button key={o.id} onClick={partial(onCardPicked, o.cardType, o.id)}>{o.name}</button>
    )}
  </div>;

export default DiscardOverLimitPicker;
