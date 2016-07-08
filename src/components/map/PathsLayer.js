import React from 'react';
import { flatten, isEmpty } from 'lodash';

import Path from './Path';
import { splitPath } from '../../utils';


const getPaths = (path, index) => {
  const split = splitPath(...[path[0], path[1]]);
  if (isEmpty(split)) {
    return <Path key={index} path={path} />;
  } else {
    return [
      <Path key={`${index}-1`} path={split[0]} />,
      <Path key={`${index}-2`} path={split[1]} />
    ];
  }
};

const PathsLayer = ({ paths }) => {
  return (
    <div>
      {flatten(paths.map(getPaths))}
    </div>
  );
};

export default PathsLayer;
