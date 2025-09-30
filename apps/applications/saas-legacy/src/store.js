// @flow

import thunk from 'redux-thunk';
// import * as Sentry from '@sentry/react';
import { createStore, applyMiddleware, compose } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { routerMiddleware } from 'connected-react-router';
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';
import createCompressor from 'redux-persist-transform-compress';
import history from './history';
import networkErrorMiddleWare from './libs/network/redux-middleware';
import { analyticsMiddleware } from './components/analytics/mixpanel/middleware';
import { meiroAnalyticsMiddleware } from './components/analytics/meiro/middleware';

import createRootReducer from './reducers/index';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'paymentPack',
    'category',
    'refresh',
    'marketplace',
    'theme',
    'membership',
    'userPreference',
  ],
  stateReconciler: seamlessImmutableReconciler,
  transforms: [createCompressor(seamlessImmutableTransformCreator({}))],
};

export default function initStore(initialState: Object = {}) {
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
        analyticsMiddleware,
        meiroAnalyticsMiddleware,
      ),
    ),
  );
  const persistor = persistStore(store);

  // $FlowFixMe
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return { store, persistor, history };
}
