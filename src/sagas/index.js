import { watchActionsLeft, watchMoveInit, watchShareInit, watchCureInit } from './actionSagas';
import { watchTreatEradication, watchCureEradication } from './diseaseSagas';
import { watchVictory, watchInfectionRateDefeat, watchOutbreaksDefeat } from './globalSagas';
import { watchEvents } from './eventSagas';
import { watchMedicMove } from './roleSagas';


export default function* rootSaga() {
  yield [
    watchMoveInit(),
    watchShareInit(),
    watchActionsLeft(),
    watchCureInit(),
    watchTreatEradication(),
    watchCureEradication(),
    watchVictory(),
    watchInfectionRateDefeat(),
    watchOutbreaksDefeat(),
    watchEvents(),
    watchMedicMove()
  ];
}
