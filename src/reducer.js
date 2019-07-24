// @flow
import { combineReducers } from 'redux';
import marketPlaceReducers from './libs/marketplace/reducers';

const rootReducer = combineReducers({
  marketPlaceReducers,
});

export default (state: any, action: any) => rootReducer(state, action);
