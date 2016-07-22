import { watchActionsLeft, watchMoveInit, watchShareInit, watchCureInit, watchBuildStation } from './actionSagas';
import { watchTreatEradication, watchCureEradication } from './diseaseSagas';
import { watchCreateQuickGame, watchCreateCustomGame, watchVictory, watchOutbreaksDefeat,
  watchDealCards } from './globalSagas';
import { watchEvents } from './eventSagas';
import { watchMedicMove, watchContPlannerInit, watchDispatcherMove, watchCureDisease } from './roleSagas';


export default function* rootSaga() {
  yield [
    watchCreateQuickGame(),
    watchCreateCustomGame(),
    watchDealCards(),
    watchMoveInit(),
    watchShareInit(),
    watchActionsLeft(),
    watchCureInit(),
    watchBuildStation(),
    watchTreatEradication(),
    watchCureEradication(),
    watchVictory(),
    watchOutbreaksDefeat(),
    watchEvents(),
    watchMedicMove(),
    watchContPlannerInit(),
    watchDispatcherMove(),
    watchCureDisease()
  ];
}
