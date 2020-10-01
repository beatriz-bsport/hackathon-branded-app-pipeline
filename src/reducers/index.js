// @flow

import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';
import authReducers from './auth';
import statsReducers from './stats';
import categoryReducers from './category';
import paymentReducers from './payment';
import consumerReducers from './consumer';
import snackbarReducer from './snackbar.reducers';
import searchReducer from './search.reducers';
import network from '../libs/network/reducers';
import companiesReducers from './companies.reducers';
import establishmentReducers from '../libs/establishment/reducers';
import shopReducer from '../libs/shop/reducers';
import paymentRulesReducer from '../libs/payment-rules/reducers';
import metaActivityReducers from '../libs/meta-activity/reducers';
import subscriptionReducer from '../libs/subscription/reducers';
import alertingReducer from '../libs/alerting/reducers';
import memberReducer from '../libs/member/reducers';
import bookingReducers from '../libs/booking/reducers';
import tagReducers from '../libs/tag/reducers';
import orderReducers from '../libs/order/reducers';
import coachReducers from '../libs/associated-coach/reducers';
import waitingListReducers from '../libs/waiting-list/reducers';
import themeReducers from '../libs/theme/reducers';
import roleReducers from '../libs/role/reducers';
import checkoutReducers from '../libs/checkout/reducers';
import communicationReducers from '../libs/communication/reducers';
import couponReducers from '../libs/coupon/reducers';
import relationship from '../libs/relationship/reducers';
import login from '../libs/login/reducers';
import cashBookReducers from '../libs/cashbook/reducers';
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
import webhook from '../libs/webhook/reducers';
import notificationRule from '../libs/notification-rule/reducers';
import partnership from '../libs/partnership/reducers';
import activeCampaign from '../libs/active-campaign/reducers';
import video from '../libs/video/reducers';
import playlist from '../libs/playlist/reducers';
import event from '../libs/event/reducers';
import invoiceReducers from '../libs/invoice/reducers';
import paymentBackend from '../libs/payment/reducers';
import platformBilling from '../libs/platform-billing/reducers';
import backgroundTaskReducers from '../libs/background-task/reducers';

import type { State, Action } from '../state/types';

import { reducer } from '../resources';

const rootReducer = (history) =>
  combineReducers({
    '@api': reducer,
    router: connectRouter(history),
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
    paymentBackend,
    snackbar: snackbarReducer,
    search: searchReducer,
    companies: companiesReducers,
    shop: shopReducer,
    subscription: subscriptionReducer,
    alerting: alertingReducer,
    tag: tagReducers,
    order: orderReducers,
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
    webhook,
    notificationRule,
    partnership,
    activeCampaign,
    event,
    video,
    playlist,
    platformBilling,
    cashbook: cashBookReducers,
    backgroundTask: backgroundTaskReducers,
  });

export default (history) => (state: State, action: Action) => {
  const newState = action.type === 'DISCONNECT' ? {} : state;
  return rootReducer(history)(newState, action);
};
