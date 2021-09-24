import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';
import activeCampaign from '../libs/active-campaign/reducers';
import alertingReducer from '../libs/alerting/reducers';
import authReducers from './auth';
import backgroundDialogReducer from './backgroundDialog.reducers';
import backgroundTaskReducers from '../libs/background-task/reducers';
import bookingReducers from '../libs/booking/reducers';
import cashBookReducers from '../libs/cashbook/reducers';
import categoryReducers from '../libs/category/reducers';
import checkoutReducers from '../libs/checkout/reducers';
import CoachPaymentRuleReducer from '../libs/coach-payment-rules/reducers';
import coachReducers from '../libs/associated-coach/reducers';
import communicationReducers from '../libs/communication/reducers';
import companiesReducers from './companies.reducers';
import company from '../libs/company/reducers';
import consumerPaymentPackReducers from '../libs/consumer-payment-pack/reducers';
import consumerReducers from '../libs/consumer-space/reducers';
import couponReducers from '../libs/coupon/reducers';
import dashboardSettings from '../libs/dashboard/reducers';
import emailTemplateReducer from '../libs/email-editor/reducers';
import establishmentReducers from '../libs/establishment/reducers';
import event from '../libs/event/reducers';
import franchiseReducers from '../libs/franchise/reducers';
import invoiceReducers from '../libs/invoice/reducers';
import login from '../libs/login/reducers';
import marketingNotification from '../libs/marketing/reducers';
import marketplace from '../libs/marketplace/reducers';
import memberReducer from '../libs/member/reducers';
import membership from '../libs/membership/reducers';
import metaActivityReducers from '../libs/meta-activity/reducers';
import network from '../libs/network/reducers';
import notificationRule from '../libs/notification-rule/reducers';
import offer from '../libs/offer/reducers';
import orderReducers from '../libs/order/reducers';
import partnership from '../libs/partnership/reducers';
import paymentBackend from '../libs/payment/reducers';
import paymentCombo from '../libs/payment-combo/reducers';
import paymentPack from '../libs/payment-packs/reducers';
import paymentReducers from './payment';
import paymentRulesReducer from '../libs/payment-rules/reducers';
import platformBilling from '../libs/platform-billing/reducers';
import playlist from '../libs/playlist/reducers';
import privateService from '../libs/private-service/reducers';
import relationship from '../libs/relationship/reducers';
import reminder from '../libs/reminder/reducers';
import reportGenerationState from '../libs/reporting/reducers';
import roleReducers from '../libs/role/reducers';
import searchReducer from './search.reducers';
import shopReducer from '../libs/shop/reducers';
import smartListReducer from '../libs/smart-list/reducers';
import snackbarReducer from './snackbar.reducers';
import spotSchedulingReducers from '../libs/spot-scheduling/reducers';
import statsReducers from './stats';
import subscriptionReducer from '../libs/subscription/reducers';
import tagReducers from '../libs/tag/reducers';
import themeReducers from '../libs/theme/reducers';
import video from '../libs/video/reducers';
import waitingListReducers from '../libs/waiting-list/reducers';
import webhook from '../libs/webhook/reducers';
import zoomAppReducers from '../libs/zoom-app/reducers';

import pollReducers from '../libs/sign-up-form/reducers';
import CustomFormReducer from '../libs/custom-form/reducers';
import { reducer } from '../resources';

import { BackgroundTaskState } from '../libs/background-task/types';
import { BookingsState } from '../libs/booking/types';
import { CashBookState } from '../libs/cashbook/types';
import { CategoryState } from '../libs/category/types';
import { CheckoutState } from '../libs/checkout/types';
import { CoachPaymentRuleState } from '../libs/coach-payment-rules/types';
import { CoachState } from '../libs/associated-coach/types';
import { CompanyState } from '../libs/company/types';
import { ConsumerPaymentPackState } from '../libs/consumer-payment-pack/types';
import { ConsumerState } from '../libs/consumer-space/types';
import { CouponState } from '../libs/coupon/types';
import { CustomFormState } from '../libs/custom-form/types';
import { EmailTemplateState } from '../libs/email-editor/types';
import { EstablishmentState } from '../libs/establishment/types';
import { FranchiseState } from '../libs/franchise/types';
import { MailState } from '../libs/communication/types';
import { MarketingNotificationState } from '../libs/marketing/types';
import { MarketplaceSettingState } from '../libs/marketplace/types';
import { MembershipState } from '../libs/membership/types';
import { MemberState } from '../libs/member/types';
import { MetaActivityState } from '../libs/meta-activity/types';
import { NotificationRuleState } from '../libs/notification-rule/types';
import { OfferState } from '../libs/offer/types';
import { PlaylistState } from '../libs/playlist/types';
import { PollState } from '../libs/sign-up-form/types';
import { PrivateServiceState } from '../libs/private-service/types';
import { RoleState } from '../libs/role/types';
import { SmartListState } from '../libs/smart-list/types';
import { SpotSchedulingState } from '../libs/spot-scheduling/types';
import { TagState } from '../libs/tag/types';
import { ThemeState } from '../libs/theme/types';
import { VideoState } from '../libs/video/types';
import actionTypes from '../actions/auth.types';

const rootReducer = (history: any) =>
  combineReducers({
    '@api': reducer,
    reports: reportGenerationState,
    router: connectRouter(history),
    communication: communicationReducers,
    checkout: checkoutReducers,
    paymentRules: paymentRulesReducer,
    coachPaymentRules: CoachPaymentRuleReducer,
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
    franchise: franchiseReducers,
    video,
    playlist,
    platformBilling,
    cashbook: cashBookReducers,
    backgroundTask: backgroundTaskReducers,
    marketingNotification,
    dashboardSettings,
    marketplace,
    poll: pollReducers,
    zoomApp: zoomAppReducers,
    spotScheduling: spotSchedulingReducers,
    customForm: CustomFormReducer,
  });

export type RootState = {
  router: ReturnType<typeof connectRouter>;
  activeCampaign: any;
  alerting: any;
  auth: any;
  backgroundTask: BackgroundTaskState;
  booking: BookingsState;
  cashbook: CashBookState;
  category: CategoryState;
  checkout: CheckoutState;
  coach: CoachState;
  coachPaymentRules: CoachPaymentRuleState;
  communication: MailState;
  companies: any;
  company: CompanyState;
  consumer: ConsumerState;
  consumerPaymentPack: ConsumerPaymentPackState;
  coupon: CouponState;
  customForm: CustomFormState;
  dashboardSettings: any;
  emailTemplate: EmailTemplateState;
  establishment: EstablishmentState;
  event: any;
  franchise: FranchiseState;
  invoice: any;
  login: any;
  marketingNotification: MarketingNotificationState;
  marketplace: MarketplaceSettingState;
  member: MemberState;
  membership: MembershipState;
  metaActivity: MetaActivityState;
  network: any;
  notificationRule: NotificationRuleState;
  offer: OfferState;
  order: any;
  partnership: any;
  payment: any;
  paymentBackend: any;
  paymentCombo: any;
  paymentPack: any;
  paymentRules: any;
  platformBilling: any;
  playlist: PlaylistState;
  poll: PollState;
  privateService: PrivateServiceState;
  relationship: any;
  reminder: any;
  role: RoleState;
  search: any;
  shop: any;
  smartList: SmartListState;
  snackbar: any;
  spotScheduling: SpotSchedulingState;
  stats: any;
  subscription: any;
  tag: TagState;
  theme: ThemeState;
  video: VideoState;
  waitingList: any;
  webhook: any;
  zoomApp: any;
};

export default (history: any) => (state: any, action: any) => {
  const newState = state;
  if (action.type === actionTypes.DISCONNECT) {
    return rootReducer(history)(undefined, action);
  }
  return rootReducer(history)(newState, action);
};
