import { takeEvery } from 'redux-saga';


function* checkDrive() {
}

function* watchDrive() {
  yield* takeEvery('PLAYER_DRIVE_REQUEST', checkDrive);
}

export default function* rootSaga() {
  yield [
    watchDrive()
  ];
}
