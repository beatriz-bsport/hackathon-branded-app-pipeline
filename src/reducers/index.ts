import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';
import activeCampaign from '#libs/active-campaign/reducers';
import alertingReducer from '#libs/alerting/reducers';
import authReducers from './auth';
import backgroundDialogReducer from '#libs/background-dialog/reducers';
import backgroundTaskReducers from '#libs/background-task/reducers';
import bookingReducers from '#libs/booking/reducers';
import cashBookReducers from '#libs/cashbook/reducers';
import categoryReducers from '#libs/category/reducers';
import checkoutReducers from '#libs/checkout/reducers';
import ClockinReducer from '#libs/clock-in/reducers';
import CoachPaymentRuleReducer from '#libs/coach-payment-rules/reducers';
import coachReducers from '#libs/associated-coach/reducers';
import communicationReducers from '#libs/communication/reducers';
import company from '#libs/company/reducers';
import consumerPaymentPackReducers from '#libs/consumer-payment-pack/reducers';
import consumerReducers from '#libs/consumer-space/reducers';
import couponReducers from '#libs/coupon/reducers';
import CustomFormReducer from '#libs/custom-form/reducers';
import dashboardSettings from '#libs/dashboard/reducers';
import emailTemplateReducer from '#libs/email-editor/reducers';
import establishmentReducers from '#libs/establishment/reducers';
import event from '#libs/event/reducers';
import expense from '#libs/expense/reducers';
import franchiseReducers from '#libs/franchise/reducers';
import giftcard from '#libs/giftcard/reducers';
import groupOfferReducer from '#libs/group-offer/reducers';
import instalmentPayment from '#libs/instalment-payment-configuration/reducers';
import invoiceReducers from '#libs/invoice/reducers';
import levelReducer from '#libs/level/reducers';
import login from '#libs/login/reducers';
import marketingNotification from '#libs/marketing/reducers';
import marketplace from '#libs/marketplace/reducers';
import memberReducer from '#libs/member/reducers';
import membership from '#libs/membership/reducers';
import metaActivityReducers from '#libs/meta-activity/reducers';
import network from '#libs/network/reducers';
import notificationRule from '#libs/notification-rule/reducers';
import offer from '#libs/offer/reducers';
import orderReducers from '#libs/order/reducers';
import partnership from '#libs/partnership/reducers';
import paymentBackend from '#libs/payment/reducers';
import paymentCombo from '#libs/payment-combo/reducers';
import paymentPack from '#libs/payment-packs/reducers';
import paymentRulesReducer from '#libs/payment-rules/reducers';
import performanceTracking from '#libs/performance-tracking/reducers';
import platformBilling from '#libs/platform-billing/reducers';
import playlist from '#libs/playlist/reducers';
import plugin from '#libs/plugin/reducers';
import pollReducers from '#libs/sign-up-form/reducers';
import privateService from '#libs/private-service/reducers';
import QuickbooksAppReducer from '#libs/quickbooks/reducers';
import relationship from '#libs/relationship/reducers';
import reminder from '#libs/reminder/reducers';
import reportingReducer from '#libs/reporting/reducers';
import roleReducers from '#libs/role/reducers';
import searchReducer from './search.reducers';
import settingsReducer from '#libs/settings/reducers';
import shopReducer from '#libs/shop/reducers';
import smartListReducer from '#libs/smart-list/reducers';
import snackbarReducer from '#libs/snackbar/reducers';
import spotSchedulingReducers from '#libs/spot-scheduling/reducers';
import statsReducers from '#libs/statistics/reducers';
import subscriptionReducer from '#libs/subscription/reducers';
import tagReducers from '#libs/tag/reducers';
import themeReducers from '#libs/theme/reducers';
import userPreference from '#libs/user-preference/reducers';
import video from '#libs/video/reducers';
import waitingListReducers from '#libs/waiting-list/reducers';
import webhook from '#libs/webhook/reducers';
import zoomAppReducers from '#libs/zoom-app/reducers';
import terminalReducers from '#libs/terminal/reducers';

import { BackgroundDialogState } from '#libs/background-dialog/types';
import { BackgroundTaskState } from '#libs/background-task/types';
import { BookingsState } from '#libs/booking/types';
import { CashBookState } from '#libs/cashbook/types';
import { CategoryState } from '#libs/category/types';
import { CheckoutState } from '#libs/checkout/types';
import { ClockInState } from '#libs/clock-in/types';
import { CoachPaymentRuleState } from '#libs/coach-payment-rules/types';
import { CoachState } from '#libs/associated-coach/types';
import { CompanyState } from '#libs/company/types';
import { ConsumerPaymentPackState } from '#libs/consumer-payment-pack/types';
import { ConsumerState } from '#libs/consumer-space/types';
import { CouponState } from '#libs/coupon/types';
import { CustomFormState } from '#libs/custom-form/types';
import { EmailTemplateState } from '#libs/email-editor/types';
import { EstablishmentState } from '#libs/establishment/types';
import { ExpenseState } from '#libs/expense/types';
import { FranchiseState } from '#libs/franchise/types';
import { GiftcardState } from '#libs/giftcard/types';
import { GroupOfferState } from '#libs/group-offer/types';
import { InstalmentPaymentState } from '#libs/instalment-payment-configuration/types';
import { MailState } from '#libs/communication/types';
import { MarketingNotificationState } from '#libs/marketing/types';
import { MarketplaceSettingState } from '#libs/marketplace/types';
import { MembershipState } from '#libs/membership/types';
import { MemberState } from '#libs/member/types';
import { MetaActivityState } from '#libs/meta-activity/types';
import { NotificationRuleState } from '#libs/notification-rule/types';
import { OfferState } from '#libs/offer/types';
import { PartnershipState } from '#libs/partnership/types';
import { PerformanceTrackingState } from '#libs/performance-tracking/types';
import { PlaylistState } from '#libs/playlist/types';
import { PluginState } from '#libs/plugin/types';
import { PollState } from '#libs/sign-up-form/types';
import { PrivateServiceState } from '#libs/private-service/types';
import { QuickbooksState } from '#libs/quickbooks/types';
import { ReportingState } from '#libs/reporting/types';
import { RoleState } from '#libs/role/types';
import { SettingsState } from '#libs/settings/types';
import { SmartListState } from '#libs/smart-list/types';
import { SnackbarState } from '#libs/snackbar/types';
import { SpotSchedulingState } from '#libs/spot-scheduling/types';
import { TagState } from '#libs/tag/types';
import { ThemeState } from '#libs/theme/types';
import { UserPreference } from '#libs/user-preference/types';
import { VideoState } from '#libs/video/types';
import { TerminalState } from '#libs/terminal/types';
import actionTypes from '../actions/auth.types';
import { LevelState } from '#libs/level/types';

const rootReducer = (history: any) =>
  combineReducers({
    reports: reportingReducer,
    router: connectRouter(history),
    communication: communicationReducers,
    checkout: checkoutReducers,
    paymentRules: paymentRulesReducer,
    clockIn: ClockinReducer,
    coachPaymentRules: CoachPaymentRuleReducer,
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
    settings: settingsReducer,
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
    level: levelReducer,
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
    plugin,
    quickbooks: QuickbooksAppReducer,
    groupOffer: groupOfferReducer,
    giftcard,
    userPreference,
    performanceTracking,
    expense,
    instalmentPayment,
    terminal: terminalReducers,
  });

export type RootState = {
  router: ReturnType<typeof connectRouter>;
  activeCampaign: any;
  alerting: any;
  auth: any;
  backgroundDialog: BackgroundDialogState;
  backgroundTask: BackgroundTaskState;
  booking: BookingsState;
  cashbook: CashBookState;
  category: CategoryState;
  checkout: CheckoutState;
  clockIn: ClockInState;
  coach: CoachState;
  coachPaymentRules: CoachPaymentRuleState;
  communication: MailState;
  company: CompanyState;
  consumer: ConsumerState;
  consumerPaymentPack: ConsumerPaymentPackState;
  coupon: CouponState;
  customForm: CustomFormState;
  dashboardSettings: any;
  emailTemplate: EmailTemplateState;
  establishment: EstablishmentState;
  event: any;
  expense: ExpenseState;
  franchise: FranchiseState;
  groupOffer: GroupOfferState;
  giftcard: GiftcardState;
  instalmentPayment: InstalmentPaymentState;
  invoice: any;
  login: any;
  level: LevelState;
  marketingNotification: MarketingNotificationState;
  marketplace: MarketplaceSettingState;
  member: MemberState;
  membership: MembershipState;
  metaActivity: MetaActivityState;
  network: any;
  notificationRule: NotificationRuleState;
  offer: OfferState;
  order: any;
  partnership: PartnershipState;
  paymentBackend: any;
  paymentCombo: any;
  paymentPack: any;
  paymentRules: any;
  performanceTracking: PerformanceTrackingState;
  platformBilling: any;
  playlist: PlaylistState;
  plugin: PluginState;
  poll: PollState;
  privateService: PrivateServiceState;
  quickbooks: QuickbooksState;
  relationship: any;
  reminder: any;
  reports: ReportingState;
  role: RoleState;
  search: any;
  settings: SettingsState;
  shop: any;
  smartList: SmartListState;
  snackbar: SnackbarState;
  spotScheduling: SpotSchedulingState;
  stats: any;
  subscription: any;
  tag: TagState;
  theme: ThemeState;
  userPreference: UserPreference;
  video: VideoState;
  waitingList: any;
  webhook: any;
  zoomApp: any;
  terminal: TerminalState;
};

export default (history: any) => (state: any, action: any) => {
  const newState = state;
  if (action.type === actionTypes.DISCONNECT) {
    return rootReducer(history)(undefined, action);
  }

  if (action.type === actionTypes.RESET_STORE) {
    return rootReducer(history)(
      {
        router: state.router,
        auth: state.auth,
      },
      action,
    );
  }

  return rootReducer(history)(newState, action);
};
