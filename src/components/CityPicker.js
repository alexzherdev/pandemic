import React from 'react';
import { partial } from 'lodash';
import { Button } from 'react-bootstrap';


const CityPicker = ({ cities, onSubmit, onCancel }) =>
  <div>
    {cities.map((c) =>
      <Button key={c.id} onClick={partial(onSubmit, c.id)}>{c.name}</Button>
    )}
    <Button onClick={onCancel}>Cancel</Button>
  </div>;

export default CityPicker;
