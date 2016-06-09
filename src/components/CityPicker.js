import React from 'react';
import { partial } from 'lodash';


const CityPicker = ({ cities, onSubmit, onCancel }) =>
  <div>
    {cities.map((c) =>
      <button key={c.id} onClick={partial(onSubmit, c.id)}>{c.name}</button>
    )}
    <button onClick={onCancel}>Cancel</button>
  </div>;

export default CityPicker;
