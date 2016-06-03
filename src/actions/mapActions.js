import * as types from '../constants/actionTypes';

export function requestDrive(playerId, location) {
  return { type: types.PLAYER_DRIVE_REQUEST, playerId, location };
}
