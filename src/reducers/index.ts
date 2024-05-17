import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';
import activeCampaign from '#libs/active-campaign/reducers';
import alertingReducer from '#libs/alerting/reducers';
// @ts-expect-error
import authReducers from './auth';
import backgroundDialogReducer from '#libs/background-dialog/reducers';
import backgroundTaskReducers from '#libs/background-task/reducers';
import bookingReducers from '#libs/booking/reducers';
import broadcastChannelReducers from '#libs/broadcast-channel/reducers';
import cashBookReducers from '#libs/cashbook/reducers';
import categoryReducers from '#libs/category/reducers';
import checkoutReducers from '#libs/checkout/reducers';
import ClockinReducer from '#libs/clock-in/reducers';
import CoachPaymentRuleReducer from '#libs/coach-payment-rules/reducers';
import coachReducers from '#libs/associated-coach/reducers';
// @ts-expect-error
import communicationReducers from '#libs/communication/reducers/reducers';
import communicationV2Reducers from '#libs/communication-v2/reducers';
import company from '#libs/company/reducers';
import consumerPaymentPackReducers from '#libs/consumer-payment-pack/reducers';
import consumerReducers from '#libs/consumer-space/reducers';
import consumerReducersReworked from '#libs/consumer-space/reducersReworked';
import couponReducers from '#libs/coupon/reducers';
import CustomFormReducer from '#libs/custom-form/reducers';
// @ts-expect-error
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
// @ts-expect-error
import login from '#libs/login/reducers';
import marketingNotification from '#libs/marketing/reducers';
import marketplace from '#libs/marketplace/reducers';
import memberReducer from '#libs/member/reducers';
import membership from '#libs/membership/reducers';
import metaActivityReducers from '#libs/meta-activity/reducers';
// @ts-expect-error
import network from '#libs/network/reducers';
import notificationRule from '#libs/notification-rule/reducers';
import offer from '#libs/offer/reducers';
import orderReducers from '#libs/order/reducers';
import partnership from '#libs/partnership/reducers';
// @ts-expect-error
import paymentBackend from '#libs/payment/reducers';
import paymentCombo from '#libs/payment-combo/reducers';
import paymentPack from '#libs/payment-packs/reducers';
import performanceTracking from '#libs/performance-tracking/reducers';
// @ts-expect-error
import platformBilling from '#libs/platform-billing/reducers';
import playlist from '#libs/playlist/reducers';
import plugin from '#libs/plugin/reducers';
import pollReducers from '#libs/sign-up-form/reducers';
import privateService from '#libs/private-service/reducers';
import QuickbooksAppReducer from '#libs/quickbooks/reducers';
// @ts-expect-error
import relationship from '#libs/relationship/reducers';
// @ts-expect-error
import reminder from '#libs/reminder/reducers';
import replacementRequestReducer from '#libs/replacement-request/reducers';
import reportingReducer from '#libs/reporting/reducers';
import roleReducers from '#libs/role/reducers';
// @ts-expect-error
import searchReducer from './search.reducers';
import settingsReducer from '#libs/settings/reducers';
import shopReducer from '#libs/shop/reducers';
import shopReworkedReducer from '#libs/shop/reducersReworked';
import smartListReducer from '#libs/smart-list/reducers';
import snackbarReducer from '#libs/snackbar/reducers';
import spotSchedulingReducers from '#libs/spot-scheduling/reducers';
import statsReducers from '#libs/statistics/reducers';
// @ts-expect-error
import subscriptionReducer from '#libs/subscription/reducers';
import tagReducers from '#libs/tag/reducers';
import themeReducers from '#libs/theme/reducers';
import userPreference from '#libs/user-preference/reducers';
import video from '#libs/video/reducers';
import waitingListReducers from '#libs/waiting-list/reducers';
// @ts-expect-error
import webhook from '#libs/webhook/reducers';
import zoomAppReducers from '#libs/zoom-app/reducers';
import terminalReducers from '#libs/terminal/reducers';
import datatypeFilteringReducers from '#libs/datatype-filtering/reducers';
import tutorialReducers from '#libs/platform-tutorial/reducers';
import CadenceReducers from '#libs/sequential_marketing/reducers';
import exportableComponentsReducers from '#libs/exportable-components/reducers';
import quicksaleReducers from '#libs/quicksale/reducers';
import referralReducers from '#libs/referral/reducers';
import accessControlReducers from '#libs/access-control/reducers';
import communicationSentGroupConfigReducers from '#libs/communication/reducers/communication-sent-group-config-reducers';
import objectSearchReducers from '#libs/fuzzy-search/reducers';

import type { AlertingState } from '#libs/alerting/types';
import type { BackgroundDialogState } from '#libs/background-dialog/types';
import type { BackgroundTaskState } from '#libs/background-task/types';
import type { BookingsState } from '#libs/booking/types';
import type { BroadcastChannelState } from '#libs/broadcast-channel/types';
import type { CashBookState } from '#libs/cashbook/types';
import type { CategoryState } from '#libs/category/types';
import type { CheckoutState } from '#libs/checkout/types';
import type { ClockInState } from '#libs/clock-in/types';
import type { CoachPaymentRuleState } from '#libs/coach-payment-rules/types';
import type { CoachState } from '#libs/associated-coach/types';
import type { CommunicationState } from '#libs/communication-v2/types';
import type { CompanyState } from '#libs/company/types';
import type { ConsumerPaymentPackState } from '#libs/consumer-payment-pack/types';
import type {
  ConsumerState,
  ConsumerStateReworked,
} from '#libs/consumer-space/types';
import type { CouponState } from '#libs/coupon/types';
import type { CustomFormState } from '#libs/custom-form/types';
import type { EmailTemplateState } from '#libs/email-editor/types';
import type { EstablishmentState } from '#libs/establishment/types';
import type { EventState } from '#libs/event/types';
import type { ExpenseState } from '#libs/expense/types';
import type { FranchiseState } from '#libs/franchise/types';
import type { GiftcardState } from '#libs/giftcard/types';
import type { GroupOfferState } from '#libs/group-offer/types';
import type { InstalmentPaymentState } from '#libs/instalment-payment-configuration/types';
import type {
  MailState,
  CommunicationSentGroupConfigState,
} from '#libs/communication/types';
import type { MarketingNotificationState } from '#libs/marketing/types';
import type { MarketplaceSettingState } from '#libs/marketplace/types';
import type { MembershipState } from '#libs/membership/types';
import type { MemberState } from '#libs/member/types';
import type { MetaActivityState } from '#libs/meta-activity/types';
import type { NotificationRuleState } from '#libs/notification-rule/types';
import type { OfferState } from '#libs/offer/types';
import type { OrderState } from '#libs/order/types';
import type { PartnershipState } from '#libs/partnership/types';
import type { PerformanceTrackingState } from '#libs/performance-tracking/types';
import type { PlaylistState } from '#libs/playlist/types';
import type { PluginState } from '#libs/plugin/types';
import type { PollState } from '#libs/sign-up-form/types';
import type { PrivateServiceState } from '#libs/private-service/types';
import type { QuickbooksState } from '#libs/quickbooks/types';
import type { ReportingState } from '#libs/reporting/types';
import type { RoleState } from '#libs/role/types';
import type { SettingsState } from '#libs/settings/types';
import type { SmartListState } from '#libs/smart-list/types';
import type { SnackbarState } from '#libs/snackbar/types';
import type { SpotSchedulingState } from '#libs/spot-scheduling/types';
import type { TagState } from '#libs/tag/types';
import type { ThemeState } from '#libs/theme/types';
import type { UserPreference } from '#libs/user-preference/types';
import type { VideoState } from '#libs/video/types';
import type { TerminalState } from '#libs/terminal/types';
// @ts-expect-error
import actionTypes from '../actions/auth.types';
import type { LevelState } from '#libs/level/types';
import type { DatatypeFilteringState } from '#libs/datatype-filtering/types';
import type { TutorialState } from '#libs/platform-tutorial/types';
import type { ReplacementRequestState } from '#libs/replacement-request/types';
import type { PaymentComboState } from '#libs/payment-combo/types';
import type { SequentialMarketingState } from '#libs/sequential_marketing/types';
import type { WaitingListState } from '#libs/waiting-list/types';
import type { InvoiceState } from '#libs/invoice/types';
import type { ExportableComponentsState } from '#libs/exportable-components/types';
import type { QuicksaleState } from '#libs/quicksale/types';
import type { SubscriptionState } from '#libs/subscription/types';
import type { ReferralState } from '#libs/referral/types';
import type { ZoomAppState } from '#libs/zoom-app/types';
import type { ShopState, ShopStateReworked } from '#libs/shop/types';
import type { AccessControlState } from '#libs/access-control/types';
import type { PaymentBackendState } from '#libs/payment/types';
import type { ActiveCampaignState } from '#libs/active-campaign/types';
import type { PaymentPackState } from '#libs/payment-packs/types';
import type { SearchState } from '#libs/fuzzy-search/types';

const rootReducer = (history: any) =>
  combineReducers({
    reports: reportingReducer,
    router: connectRouter(history),
    communication: communicationReducers,
    communicationV2: communicationV2Reducers,
    checkout: checkoutReducers,
    clockIn: ClockinReducer,
    coachPaymentRules: CoachPaymentRuleReducer,
    consumer: consumerReducers,
    consumerReworked: consumerReducersReworked,
    auth: authReducers,
    establishment: establishmentReducers,
    booking: bookingReducers,
    metaActivity: metaActivityReducers,
    stats: statsReducers,
    coach: coachReducers,
    member: memberReducer,
    communicationSentGroupConfig: communicationSentGroupConfigReducers,
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
    shopReworked: shopReworkedReducer,
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
    datatypeFiltering: datatypeFilteringReducers,
    tutorial: tutorialReducers,
    replacementRequest: replacementRequestReducer,
    cadence: CadenceReducers,
    exportableComponents: exportableComponentsReducers,
    quicksale: quicksaleReducers,
    referral: referralReducers,
    accessControl: accessControlReducers,
    broadcastChannel: broadcastChannelReducers,
    objectSearch: objectSearchReducers,
  });

export type RootState = {
  router: ReturnType<typeof connectRouter>;
  accessControl: AccessControlState;
  activeCampaign: ActiveCampaignState;
  alerting: AlertingState;
  auth: any;
  backgroundDialog: BackgroundDialogState;
  backgroundTask: BackgroundTaskState;
  booking: BookingsState;
  broadcastChannel: BroadcastChannelState;
  cashbook: CashBookState;
  category: CategoryState;
  checkout: CheckoutState;
  clockIn: ClockInState;
  coach: CoachState;
  coachPaymentRules: CoachPaymentRuleState;
  communication: MailState;
  communicationV2: CommunicationState;
  company: CompanyState;
  consumer: ConsumerState;
  consumerReworked: ConsumerStateReworked;
  consumerPaymentPack: ConsumerPaymentPackState;
  coupon: CouponState;
  customForm: CustomFormState;
  dashboardSettings: any;
  emailTemplate: EmailTemplateState;
  establishment: EstablishmentState;
  event: EventState;
  expense: ExpenseState;
  franchise: FranchiseState;
  communicationSentGroupConfig: CommunicationSentGroupConfigState;
  groupOffer: GroupOfferState;
  giftcard: GiftcardState;
  instalmentPayment: InstalmentPaymentState;
  invoice: InvoiceState;
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
  order: OrderState;
  partnership: PartnershipState;
  paymentBackend: PaymentBackendState;
  paymentCombo: PaymentComboState;
  paymentPack: {
    [key: string]: any;
    massExtension: PaymentPackState['massExtension'];
  };
  paymentRules: any;
  performanceTracking: PerformanceTrackingState;
  platformBilling: any;
  playlist: PlaylistState;
  plugin: PluginState;
  poll: PollState;
  privateService: PrivateServiceState;
  quickbooks: QuickbooksState;
  quicksale: QuicksaleState;
  referral: ReferralState;
  relationship: any;
  reminder: any;
  replacementRequest: ReplacementRequestState;
  reports: ReportingState;
  role: RoleState;
  search: any;
  settings: SettingsState;
  shop: ShopState;
  shopReworked: ShopStateReworked;
  smartList: SmartListState;
  snackbar: SnackbarState;
  spotScheduling: SpotSchedulingState;
  stats: any;
  subscription: SubscriptionState;
  tutorial: TutorialState;
  tag: TagState;
  theme: ThemeState;
  userPreference: UserPreference;
  video: VideoState;
  waitingList: WaitingListState;
  webhook: any;
  zoomApp: ZoomAppState;
  terminal: TerminalState;
  datatypeFiltering: DatatypeFilteringState;
  cadence: SequentialMarketingState;
  exportableComponents: ExportableComponentsState;
  objectSearch: SearchState;
};

export default (history: any) => (state: any, action: any) => {
  const newState = state;
  if (action.type === actionTypes.DISCONNECT) {
    return rootReducer(history)(undefined, action);
  }

  if (action.type === actionTypes.RESET_STORE) {
    return rootReducer(history)(
      // @ts-expect-error
      {
        router: state.router,
        auth: state.auth,
        theme: state.theme,
      },
      action,
    );
  }

  return rootReducer(history)(newState, action);
};
