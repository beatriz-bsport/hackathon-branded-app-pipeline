// @flow
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import marketPlaceReducers from 'bsport-saas/src/libs/marketplace/reducers';
import shopReducers from 'bsport-saas/src/libs/shop/reducers';
import themeReducers from 'bsport-saas/src/libs/theme/reducers';
import authReducers from 'bsport-saas/src/reducers/auth';
import paymentReducers from 'bsport-saas/src/reducers/payment';

const rootReducer = combineReducers({
  marketplacev2: marketPlaceReducers,
  payment: paymentReducers,
  shop: shopReducers,
  theme: themeReducers,
  auth: authReducers,
  routerReducer,
});

export default (state: any, action: any) => rootReducer(state, action);
