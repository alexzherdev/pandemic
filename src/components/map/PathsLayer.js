import React from 'react';

import Path from './Path';


const PathsLayer = ({ paths }) => {
  return (
    <div>
      {paths.map((path, i) => <Path key={`path-${i}`} path={path} />)}
    </div>
  );
};

export default PathsLayer;
