import { watchActionsLeft, watchMoveInit, watchMoveToCity, watchShareInit, watchCureInit, watchBuildStation } from './actionSagas';
import { watchTreatEradication, watchCureEradication } from './diseaseSagas';
import { watchCreateQuickGame, watchCreateCustomGame, watchVictory, watchOutbreaksDefeat,
  watchDealCards } from './globalSagas';
import { watchEvents } from './eventSagas';
import { watchMedicAirlift, watchContPlannerInit, watchDispatcherMove, watchCureDisease } from './roleSagas';


export default function* rootSaga() {
  yield [
    watchCreateQuickGame(),
    watchCreateCustomGame(),
    watchDealCards(),
    watchMoveInit(),
    watchMoveToCity(),
    watchShareInit(),
    watchActionsLeft(),
    watchCureInit(),
    watchBuildStation(),
    watchTreatEradication(),
    watchCureEradication(),
    watchVictory(),
    watchOutbreaksDefeat(),
    watchEvents(),
    watchMedicAirlift(),
    watchContPlannerInit(),
    watchDispatcherMove(),
    watchCureDisease()
  ];
}
