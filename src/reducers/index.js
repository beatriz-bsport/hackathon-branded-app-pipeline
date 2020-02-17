// @flow

import { combineReducers } from 'redux';

import authReducers from './auth';
import statsReducers from './stats';
import categoryReducers from './category';
import invoiceReducers from './invoice';
import paymentReducers from './payment';
import consumerReducers from './consumer';
import snackbarReducer from './snackbar.reducers';
import refreshReducer from './refresh';
import searchReducer from './search.reducers';
import network from '../libs/network/reducers';
import companiesReducers from './companies.reducers';
import establishmentReducers from '../libs/establishment/reducers';
import shopReducer from '../libs/shop/reducers';
import paymentRulesReducer from '../libs/payment-rules/reducers';
import workshopActivityReducer from '../libs/meta-activity/reducers/workshop-activity';
import metaActivityReducers from '../libs/meta-activity/reducers/meta-activity';
import subscriptionReducer from '../libs/subscription/reducers';
import alertingReducer from '../libs/alerting/reducers';
import memberReducer from '../libs/member/reducers';
import bookingReducers from '../libs/booking/reducers';
import tagReducers from '../libs/tag/reducers';
import orderReducers from '../libs/order/reducers';
import marketplacev2Reducer from '../libs/marketplace/reducers';
import coachReducers from '../libs/associated-coach/reducers';
import waitingListReducers from '../libs/waiting-list/reducers';
import themeReducers from '../libs/theme/reducers';
import roleReducers from '../libs/role/reducers';
import checkoutReducers from '../libs/checkout/reducers';
import communicationReducers from '../libs/communication/reducers';
import couponReducers from '../libs/coupon/reducers';
import relationship from '../libs/relationship/reducers';
import login from '../libs/login/reducers';
import paymentPack from '../libs/payment-packs/reducers';
import privateService from '../libs/private-service/reducers';
import smartListReducer from '../libs/smart-list/reducers';
import emailTemplateReducer from '../libs/email-editor/reducers';
import paymentCombo from '../libs/payment-combo/reducers';
import consumerPaymentPackReducers from '../libs/consumer-payment-pack/reducers';
import reminder from '../libs/reminder/reducers';
import membership from '../libs/membership/reducers';
import company from '../libs/company/reducers';
import offer from '../libs/offer/reducers';

import type { State, Action } from '../state/types';

import { reducer } from '../resources';

const rootReducer = combineReducers({
  '@api': reducer,
  communication: communicationReducers,
  checkout: checkoutReducers,
  paymentRules: paymentRulesReducer,
  payment: paymentReducers,
  consumer: consumerReducers,
  auth: authReducers,
  establishment: establishmentReducers,
  booking: bookingReducers,
  metaActivity: metaActivityReducers,
  stats: statsReducers,
  coach: coachReducers,
  member: memberReducer,
  paymentPack,
  consumerPaymentPack: consumerPaymentPackReducers,
  category: categoryReducers,
  invoice: invoiceReducers,
  snackbar: snackbarReducer,
  refresh: refreshReducer,
  search: searchReducer,
  companies: companiesReducers,
  shop: shopReducer,
  workshopActivity: workshopActivityReducer,
  subscription: subscriptionReducer,
  alerting: alertingReducer,
  tag: tagReducers,
  order: orderReducers,
  marketplacev2: marketplacev2Reducer,
  waitingList: waitingListReducers,
  theme: themeReducers,
  role: roleReducers,
  coupon: couponReducers,
  emailTemplate: emailTemplateReducer,
  relationship,
  network,
  login,
  privateService,
  smartList: smartListReducer,
  paymentCombo,
  reminder,
  membership,
  company,
  offer,
});

export default (state: State, action: Action) => {
  const newState = action.type === 'DISCONNECT' ? {} : state;
  return rootReducer(newState, action);
};
