import React from 'react';
import { flatten } from 'lodash';

import Path from './Path';
import { map } from '../../styles';


const SPLIT_PATH_HEURISTIC = 300;

const getPaths = (path, index) => {
  if (path[0][1] < SPLIT_PATH_HEURISTIC && path[1][1] > map.width - SPLIT_PATH_HEURISTIC) {
    return [
      <Path key={`${index}-1`} path={[path[1], [path[0][0], map.width + path[0][1]]]} />,
      <Path key={`${index}-2`} path={[[path[1][0], -(map.width - path[1][1])], path[0]]} />
    ];
  } else if (path[1][1] < SPLIT_PATH_HEURISTIC && path[0][1] > map.width - SPLIT_PATH_HEURISTIC) {
    console.log(path);
    return [
      <Path key={`${index}-1`} path={[path[0], [path[1][0], map.width + path[1][1]]]} />,
      <Path key={`${index}-2`} path={[[path[0][0], -(map.width - path[0][1])], path[1]]} />
    ];
  } else {
    return <Path key={index} path={path} />;
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
