import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import storage from 'redux-persist/lib/storage';
import {
  seamlessImmutableReconciler,
  seamlessImmutableTransformCreator,
} from 'redux-persist-seamless-immutable';
import createCompressor from 'redux-persist-transform-compress';
import { persistReducer, persistStore } from 'redux-persist';

import reducer from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: seamlessImmutableReconciler,
  transforms: [createCompressor(seamlessImmutableTransformCreator({}))],
};

export default function initStore(initialState: Object = {}) {
  const history = createBrowserHistory();
  const rootReducer = persistReducer(persistConfig, reducer(history));
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const routerMiddlewareWithHistory = routerMiddleware(history);

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, routerMiddlewareWithHistory)),
  );

  persistStore(store);

  return store;
}
