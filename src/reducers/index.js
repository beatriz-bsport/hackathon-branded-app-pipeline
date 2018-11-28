// @flow

import { combineReducers } from 'redux';

import authReducers from './auth';
import offerReducers from './offer';
import bookingReducers from './booking';
import activityReducers from './activity';
import metaActivityReducers from './meta-activity';
import statsReducers from './stats';
import coachReducers from './coach';
import memberReducer from './member';
import paymentPackReducers from './paymentPack';
import establishmentReducers from './establishment';
import categoryReducers from './category';
import invoiceReducers from './invoice';
import paymentReducers from './payment';
import consumerReducers from './consumer';
import snackbarReducer from './snackbar.reducers';
import refreshReducer from './refresh';
import searchReducer from './search.reducers';
import companiesReducers from './companies.reducers';
import marketplaceReducer from './marketplace';
import shopReducer from './shop';

const rootReducer = combineReducers({
  payment: paymentReducers,
  consumer: consumerReducers,
  auth: authReducers,
  establishment: establishmentReducers,
  offer: offerReducers,
  booking: bookingReducers,
  activity: activityReducers,
  metaActivity: metaActivityReducers,
  stats: statsReducers,
  coach: coachReducers,
  member: memberReducer,
  paymentPack: paymentPackReducers,
  category: categoryReducers,
  invoice: invoiceReducers,
  snackbar: snackbarReducer,
  refresh: refreshReducer,
  search: searchReducer,
  companies: companiesReducers,
  marketplace: marketplaceReducer,
  shop: shopReducer,
});

export default (state, action) => {
  const newState = action.type === 'DISCONNECT' ? { nav: state.nav } : state;
  return rootReducer(newState, action);
};
