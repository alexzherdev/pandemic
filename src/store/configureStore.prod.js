import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { stateHistoryTracker } from 'redux-state-history';

import rootReducer from '../reducers';
import rootSaga from '../sagas';


export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, initialState,
    compose(applyMiddleware(sagaMiddleware), stateHistoryTracker()));
  sagaMiddleware.run(rootSaga);
  return store;
}
