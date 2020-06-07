// @flow

/* eslint-disable no-underscore-dangle */

import thunk from 'redux-thunk';
// import * as Sentry from '@sentry/browser';
import { createStore, applyMiddleware, compose } from 'redux';
// import createSentryMiddleware from 'redux-sentry-middleware';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';
import createCompressor from 'redux-persist-transform-compress';
import networkErrorMiddleWare from './libs/network/redux-middleware';

import createRootReducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'offer',
    'paymentPack',
    'category',
    'refresh',
    'marketplace',
    'theme',
    'member',
    'membership',
  ],
  stateReconciler: seamlessImmutableReconciler,
  transforms: [createCompressor(seamlessImmutableTransformCreator({}))],
};

export default function initStore(initialState: Object = {}) {
  const history = createBrowserHistory();
  const rootReducer = persistReducer(persistConfig, createRootReducer(history));
  const routerMiddlewareWithHistory = routerMiddleware(history);
  // prettier-ignore
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(
        // createSentryMiddleware(Sentry, {}),
        thunk,
        routerMiddlewareWithHistory,
        networkErrorMiddleWare,
      ),
    ),
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
