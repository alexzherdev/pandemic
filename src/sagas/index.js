import { watchActionsLeft, watchMoveInit, watchShareInit, watchCureInit, watchBuildStation } from './actionSagas';
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
    watchBuildStation(),
    watchTreatEradication(),
    watchCureEradication(),
    watchVictory(),
    watchInfectionRateDefeat(),
    watchOutbreaksDefeat(),
    watchEvents(),
    watchMedicMove()
  ];
}
