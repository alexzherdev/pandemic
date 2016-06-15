import React from 'react';


const Path = ({ path: [[y1, x1], [y2, x2]] }) => {
  const length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  const angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  const transform = `rotate(${angle}deg)`;
  return (
    <div key={`path-${x1}${x2}${y1}${y2}`} className="path" style={{ left: x1, top: y1, width: length, transform }} />
  );
};

export default Path;
