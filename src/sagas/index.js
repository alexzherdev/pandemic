import { watchActionsLeft, watchMoveInit, watchShareInit, watchCureInit, watchBuildStation } from './actionSagas';
import { watchTreatEradication, watchCureEradication } from './diseaseSagas';
import { watchCreateQuickGame, watchVictory, watchInfectionRateDefeat, watchOutbreaksDefeat,
  watchDealCards } from './globalSagas';
import { watchEvents } from './eventSagas';
import { watchMedicMove, watchContPlannerInit, watchDispatcherMove, watchCureDisease } from './roleSagas';


export default function* rootSaga() {
  yield [
    watchCreateQuickGame(),
    watchDealCards(),
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
    watchMedicMove(),
    watchContPlannerInit(),
    watchDispatcherMove(),
    watchCureDisease()
  ];
}
