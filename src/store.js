// @flow

/* eslint-disable no-underscore-dangle */

import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import immutableTransform from 'redux-persist-transform-immutable';

import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'activity',
    'metaActivity',
    'booking',
    'offer',
    'stats',
    'category',
    'paymentPack',
    'establishment',
    'coach',
    'member',
    'category',
    'transaction',
  ],
  transforms: [immutableTransform()],
};

export default function initStore(initialState: Object) {
  const rootReducer = persistReducer(persistConfig, reducers);
  const history = createHistory();
  const routerMiddlewareWithHistory = routerMiddleware(history);
  // prettier-ignore
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, routerMiddlewareWithHistory)),
  );
  const persistor = persistStore(store);

  // $FlowFixMe
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextRootReducer);
    });
  }

  return { store, persistor, history };
}
