export function getLocationOrigin(loc) {
  return { top: loc.coords[0] - 16, left: loc.coords[1] - 16 };
}

export function getCubeOrigin(loc) {
  return { top: loc.coords[0] - 12, left: loc.coords[1] - 12 };
}
