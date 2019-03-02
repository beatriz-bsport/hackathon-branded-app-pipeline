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
import consumerPaymentPackReducers from './consumer-payment-pack';
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
import paymentRulesReducer from '../libs/payment-rules/reducers';
import workshopActivityReducer from './workshop-activity';

import type { State, Action } from '../state/types';

import { reducer } from '../resources';

const rootReducer = combineReducers({
  '@api': reducer,
  paymentRules: paymentRulesReducer,
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
  consumerPaymentPack: consumerPaymentPackReducers,
  category: categoryReducers,
  invoice: invoiceReducers,
  snackbar: snackbarReducer,
  refresh: refreshReducer,
  search: searchReducer,
  companies: companiesReducers,
  marketplace: marketplaceReducer,
  shop: shopReducer,
  workshopActivity: workshopActivityReducer,
});

export default (state: State, action: Action) => {
  const newState = action.type === 'DISCONNECT' ? { nav: state.nav } : state;
  return rootReducer(newState, action);
};
