import React, { PropTypes } from 'react';
import { forOwn, find, partial, isEmpty, pick, values } from 'lodash';

import { getLocationOrigin } from '../../utils';
import { locationType, cityType } from '../../constants/propTypes';
import DISEASES from '../../constants/diseases';


const LocationsLayer = ({ cities, locations, availableCities, onCityClicked, onCityDoubleClicked,
  isDriveAvailable }) => {
  const items = [];

  forOwn(cities, (c, id) => {
    const isAvailable = !!find(availableCities, { id });
    const loc = locations[id];
    const coords = getLocationOrigin(loc);

    const onClick = !isEmpty(availableCities) && partial(onCityClicked, id);
    const onDoubleClick = isEmpty(availableCities) && isDriveAvailable(id) && partial(onCityDoubleClicked, id);
    const counts = values(pick(loc, DISEASES));
    const maxCount = Math.max(...counts);
    items.push(
      <span
        className="city"
        key={id}
        style={coords}
        onClick={onClick}
        onDoubleClick={onDoubleClick}>

        <span className={`icon ${c.color}`} />

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
        {maxCount === 3 &&
          <span className="outbreak-warning" />
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

LocationsLayer.propTypes = {
  cities: PropTypes.objectOf(cityType.isRequired).isRequired,
  locations: PropTypes.objectOf(locationType.isRequired).isRequired,
  onCityClicked: PropTypes.func.isRequired,
  onCityDoubleClicked: PropTypes.func.isRequired,
  isDriveAvailable: PropTypes.func.isRequired,
  availableCities: PropTypes.objectOf(cityType.isRequired)
};

export default LocationsLayer;
