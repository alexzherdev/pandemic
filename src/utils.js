import { map } from './styles';


export function getLocationOrigin(loc) {
  return { top: loc.coords[0] - 16, left: loc.coords[1] - 16 };
}

export function getCubeOrigin(loc) {
  return { top: loc.coords[0] - 12, left: loc.coords[1] - 12 };
}

export function splitPath([x1, y1], [x2, y2]) {
  const SPLIT_PATH_HEURISTIC = 300;

  if (x1 < SPLIT_PATH_HEURISTIC && x2 > map.width - SPLIT_PATH_HEURISTIC) {
    return [
      [[x1, y1], [-(map.width - x2), y2]],
      [[map.width + x1, y1], [x2, y2]]
    ];
  } else if (x2 < SPLIT_PATH_HEURISTIC && x1 > map.width - SPLIT_PATH_HEURISTIC) {
    return [
      [[x1, y1], [map.width + x2, y2]],
      [[-(map.width - x1), y1], [x2, y2]]
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

export function constrainCubeMovement([xIn, yIn], [xOut, yOut]) {
  const DELTA = 24;
  let newX;
  if (xOut < 0) {
    newX = -DELTA;
  } else if (xOut > map.width) {
    newX = map.width + DELTA;
  }
  const newY = (yOut - yIn) / (xOut - xIn) * newX + yIn - xIn * (yOut - yIn) / (xOut - xIn);
  return [newX, newY];
}
