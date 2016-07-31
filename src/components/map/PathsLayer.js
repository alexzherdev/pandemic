import React, { PropTypes } from 'react';
import { flatten, isEmpty } from 'lodash';

import Path from './Path';
import { splitPath } from '../../utils';
import { pathType } from '../../constants/propTypes';


const PathsLayer = ({ paths, width }) => {
  function getPaths(path, index) {
    const split = splitPath(...[path[0], path[1]], width);
    if (isEmpty(split)) {
      return <Path key={index} path={path} />;
    } else {
      return [
        <Path key={`${index}-1`} path={split[0]} />,
        <Path key={`${index}-2`} path={split[1]} />
      ];
    }
  }

  return (
    <div>
      {flatten(paths.map(getPaths))}
    </div>
  );
};

PathsLayer.propTypes = {
  paths: PropTypes.arrayOf(pathType.isRequired).isRequired,
  width: PropTypes.number
};

export default PathsLayer;
