// @flow
import { combineReducers } from 'redux';
import marketPlaceReducers from 'bsport-saas/src/libs/marketplace/reducers';

const rootReducer = combineReducers({
  marketplacev2: marketPlaceReducers,
});

export default (state: any, action: any) => rootReducer(state, action);
