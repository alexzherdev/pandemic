import React from 'react';

import Path from './Path';


const PathsLayer = ({ paths }) => {
  return (
    <div>
      {paths.map((path) => <Path path={path} />)}
    </div>
  );
};

export default PathsLayer;
