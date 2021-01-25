import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import reducer from './reducer';

export default function initStore(initialState: Object = {}) {
  const history = createBrowserHistory();
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const routerMiddlewareWithHistory = routerMiddleware(history);
  return createStore(
    reducer(history),
    initialState,
    composeEnhancers(applyMiddleware(thunk, routerMiddlewareWithHistory))
  );
}
