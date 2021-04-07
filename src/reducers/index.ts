import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';
import authReducers from './auth';
import statsReducers from './stats';
import categoryReducers from '../libs/category/reducers';
import paymentReducers from './payment';
import consumerReducers from '../libs/consumer-space/reducers';
import snackbarReducer from './snackbar.reducers';
import backgroundDialogReducer from './backgroundDialog.reducers';
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
import marketingNotification from '../libs/marketing/reducers';
import dashboardSettings from '../libs/dashboard/reducers';
import marketplace from '../libs/marketplace/reducers';
import zoomAppReducers from '../libs/zoom-app/reducers';
import reportGenerationState from '../libs/reporting/reducers';

import { reducer } from '../resources';

import { PrivateServiceState } from '../libs/private-service/types';
import { CoachState } from '../libs/associated-coach/types';
import { BackgroundTaskState } from '../libs/background-task/types';
import { BookingsState } from '../libs/booking/types';
import { CashBookState } from '../libs/cashbook/types';
import { CheckoutState } from '../libs/checkout/types';
import { MailState } from '../libs/communication/types';
import { CompanyState } from '../libs/company/types';
import { ConsumerPaymentPackState } from '../libs/consumer-payment-pack/types';
import { MetaActivityState } from '../libs/meta-activity/types';
import { PlaylistState } from '../libs/playlist/types';
import { VideoState } from '../libs/video/types';
import { CategoryState } from '../libs/category/types';
import { MemberState } from '../libs/member/types';
import { MarketplaceSettingState } from '../libs/marketplace/types';
import { MembershipState } from '../libs/membership/types';
import { ConsumerState } from '../libs/consumer-space/types';
import { ThemeState } from '../libs/theme/types';
import { RoleState } from '../libs/role/types';

import actionTypes from '../actions/auth.types';

const rootReducer = (history: any) =>
  combineReducers({
    '@api': reducer,
    reports: reportGenerationState,
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
    backgroundDialog: backgroundDialogReducer,
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
    marketingNotification,
    dashboardSettings,
    marketplace,
    zoomApp: zoomAppReducers,
  });

export type RootState = {
  router: ReturnType<typeof connectRouter>;
  paymentRules: any;
  payment: any;
  auth: any;
  establishment: any;
  stats: any;
  invoice: any;
  paymentBackend: any;
  snackbar: any;
  search: any;
  companies: any;
  shop: any;
  subscription: any;
  alerting: any;
  tag: any;
  order: any;
  waitingList: any;
  coupon: any;
  emailTemplate: any;
  relationship: any;
  network: any;
  login: any;
  smartList: any;
  paymentCombo: any;
  reminder: any;
  offer: any;
  webhook: any;
  notificationRule: any;
  partnership: any;
  activeCampaign: any;
  event: any;
  platformBilling: any;
  marketingNotification: any;
  dashboardSettings: any;
  paymentPack: any;
  role: RoleState;
  theme: ThemeState;
  consumer: ConsumerState;
  membership: MembershipState;
  marketplace: MarketplaceSettingState;
  member: MemberState;
  category: CategoryState;
  video: VideoState;
  playlist: PlaylistState;
  metaActivity: MetaActivityState;
  consumerPaymentPack: ConsumerPaymentPackState;
  company: CompanyState;
  communication: MailState;
  checkout: CheckoutState;
  cashbook: CashBookState;
  booking: BookingsState;
  coach: CoachState;
  privateService: PrivateServiceState;
  backgroundTask: BackgroundTaskState;
  zoomApp: any;
};

export default (history: any) => (state: any, action: any) => {
  const newState = state;
  if (action.type === actionTypes.DISCONNECT) {
    return rootReducer(history)(undefined, action);
  }
  return rootReducer(history)(newState, action);
};
