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
import createCompressor from 'redux-persist-transform-compress';

import reducers from './reducers';

const transformerConfig = { whitelist: ['invoice', 'member'] };

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
    'memberFetcher',
    'category',
    'invoice',
    'refresh',
    'search',
    'marketplace',
    'shop',
    'paymentRules',
    'alerting',
  ],
  stateReconciler: seamlessImmutableReconciler,
  transforms: [
    createCompressor(seamlessImmutableTransformCreator(transformerConfig)),
  ],
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
