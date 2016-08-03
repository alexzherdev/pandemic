import path from 'path';

import { map } from './styles';


function getMapRatio(width, height) {
  if (width / height > map.width / map.height) {
    return height / map.height;
  } else {
    return width / map.width;
  }
}

export function mapCoords(coords, width = map.width, height = map.height) {
  const ratio = getMapRatio(width, height);
  return [coords[0] * ratio, coords[1] * ratio];
}

export function getPathCoords(loc, width = map.width, height = map.height) {
  return mapCoords(loc.coords, width, height);
}

export function getLocationOrigin(loc, width = map.width, height = map.height) {
  const ratio = getMapRatio(width, height);
  return { top: loc.coords[0] * ratio - 16, left: loc.coords[1] * ratio - 16 };
}

export function getCubeOrigin(loc, width = map.width, height = map.height) {
  const ratio = getMapRatio(width, height);
  return { top: loc.coords[0] * ratio - 12, left: loc.coords[1] * ratio - 12 };
}

export function getInfectionCardOrigin(loc, width = map.width, height = map.height) {
  const ratio = getMapRatio(width, height);
  return { top: loc.coords[0] * ratio - 16, left: loc.coords[1] * ratio + 10 };
}

export function splitPath([x1, y1], [x2, y2], width) {
  const SPLIT_PATH_HEURISTIC = 0.25;

  if (x1 < SPLIT_PATH_HEURISTIC * width && x2 > (1 - SPLIT_PATH_HEURISTIC) * width) {
    return [
      [[x1, y1], [-(width - x2), y2]],
      [[width + x1, y1], [x2, y2]]
    ];
  } else if (x2 < SPLIT_PATH_HEURISTIC * width && x1 > (1 - SPLIT_PATH_HEURISTIC) * width) {
    return [
      [[x1, y1], [width + x2, y2]],
      [[-(width - x1), y1], [x2, y2]]
    ];
  } else {
    return null;
  }
}

export function getLength([x1, y1], [x2, y2]) {
  return Math.sqrt(
    (x2 - x1) * (x2 - x1) +
    (y2 - y1) * (y2 - y1)
  );
}

export function constrainCubeMovement([xIn, yIn], [xOut, yOut], width) {
  const DELTA = 24;
  let newX;
  if (xOut < 0) {
    newX = -DELTA;
  } else if (xOut > width) {
    newX = width + DELTA;
  }
  const newY = (yOut - yIn) / (xOut - xIn) * newX + yIn - xIn * (yOut - yIn) / (xOut - xIn);
  return [newX, newY];
}

export const IMAGES_TO_PRELOAD = (function() {
  const context = require.context('./assets/images');
  return Object.freeze(
    context.keys().map((k) => path.basename(context(k)))
  );
})();
