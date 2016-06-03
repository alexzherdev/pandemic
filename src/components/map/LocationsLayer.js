import React from 'react';
import { forOwn, find } from 'lodash';


const LocationsLayer = ({ cities, locations, availableCities }) => {
  const items = [];
  forOwn(cities, (c, id) => {
    const isAvailable = !!find(availableCities, { id });
    const loc = locations[id];
    items.push(
      <span
        className="city"
        key={id}
        style={{top: loc.coords[0], left: loc.coords[1], backgroundColor: c.color, fontWeight: isAvailable ? 'bold' : 'normal' }}>
          {c.name} {loc.station && '(S)'}
      </span>
    );
  });
  return (
    <div>{items}</div>
  );
};

export default LocationsLayer;
