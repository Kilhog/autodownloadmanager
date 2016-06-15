import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootReducer from '../reducers';
import mySaga from '../sagas';
import thunk from 'redux-thunk';

export default function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware, thunk),
    initialState,
    window.devToolsExtension ? window.devToolsExtension() : undefined
  );

  sagaMiddleware.run(mySaga);

  if(module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
