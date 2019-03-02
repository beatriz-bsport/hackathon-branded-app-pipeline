// @flow

/* eslint-disable no-underscore-dangle */

import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';

import reducers from './reducers';

const transformerConfig = {};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'activity',
    'metaActivity',
    'workshopActivity',
    'booking',
    'offer',
    'stats',
    'category',
    'paymentPack',
    'establishment',
    'coach',
    'member',
    'category',
    'invoice',
    'refresh',
    'search',
    'marketplace',
    'shop',
    'paymentRules',
  ],
  stateReconciler: seamlessImmutableReconciler,
  transforms: [seamlessImmutableTransformCreator(transformerConfig)],
};

export default function initStore(initialState: Object = {}) {
  const rootReducer = persistReducer(persistConfig, reducers);
  const history = createBrowserHistory();
  const routerMiddlewareWithHistory = routerMiddleware(history);
  // prettier-ignore
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    connectRouter(history)(rootReducer),
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
