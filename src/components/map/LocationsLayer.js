import React from 'react';
import { forOwn, find, partial, isEmpty } from 'lodash';

import Cubes from './Cubes';


const LocationsLayer = ({ cities, locations, availableCities, onCityClicked, onCityDoubleClicked,
  isDriveAvailable }) => {
  const items = [];

  forOwn(cities, (c, id) => {
    const isAvailable = !!find(availableCities, { id });
    const loc = locations[id];
    const coords = { top: loc.coords[0] - 16, left: loc.coords[1] - 16 };

    const onClick = !isEmpty(availableCities) && partial(onCityClicked, id);
    const onDoubleClick = isEmpty(availableCities) && isDriveAvailable(id) && partial(onCityDoubleClicked, id);
    items.push(
      <span
        className="city"
        key={id}
        style={{...coords, fontWeight: isAvailable ? 'bold' : 'normal' }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}>

        <span className={`icon ${c.color}`} />

        <Cubes location={loc} />
        {isAvailable &&
          <span className="selection-container">
            <span className="selection" />
            <span className="selection-bg" />
          </span>
        }
        <span className="name">{c.name}</span>
        {loc.station &&
          <span
            className="station"
            onClick={onClick}
            onDoubleClick={onDoubleClick} />
        }
      </span>
    );
  });
  return (
    <div>
      {items}
    </div>
  );
};

export default LocationsLayer;
