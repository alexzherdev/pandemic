import React from 'react';
import { forOwn } from 'lodash';

import Cubes from './Cubes';


const CubesLayer = ({ locations }) => {
  const cubes = [];

  forOwn(locations, (loc, id) => {
    cubes.push(<Cubes key={id} location={loc} />);
  });
  return (
    <div>
      {cubes}
    </div>
  );
};

export default CubesLayer;
