import React from 'react';
import { forOwn, find } from 'lodash';


const LocationsLayer = ({ cities, locations, availableCities }) => {
  const items = [];
  forOwn(cities, (c, id) => {
    const isAvailable = !!find(availableCities, { id });
    items.push(
      <span
        className="city"
        key={id}
        style={{top: locations[id].coords[0], left: locations[id].coords[1], backgroundColor: c.color, fontWeight: isAvailable ? 'bold' : 'normal' }}>
          {c.name}
      </span>
    );
  });
  return (
    <div>{items}</div>
  );
};

export default LocationsLayer;
