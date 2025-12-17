import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';

import accessControlReducers from '#src/libs/access-control/reducers';
import activeCampaign from '#src/libs/active-campaign/reducers';
import alertingReducer from '#src/libs/alerting/reducers';
import backgroundDialogReducer from '#src/libs/background-dialog/reducers';
import backgroundTaskReducers from '#src/libs/background-task/reducers';
import bookingReducers from '#src/libs/booking/reducers';
import broadcastChannelReducers from '#src/libs/broadcast-channel/reducers';
import CadenceReducers from '#src/libs/sequential_marketing/reducers';
import cashBookReducers from '#src/libs/cashbook/reducers';
import categoryReducers from '#src/libs/category/reducers';
import checkoutReducers from '#src/libs/checkout/reducers';
import ClockinReducer from '#src/libs/clock-in/reducers';
import CoachPaymentRuleReducer from '#src/libs/coach-payment-rules/reducers';
import coachReducers from '#src/libs/associated-coach/reducers';
// @ts-expect-error
import communicationReducers from '#src/libs/communication/reducers/reducers';
import communicationSentGroupConfigReducers from '#src/libs/communication/reducers/communication-sent-group-config-reducers';
import communicationV2Reducers from '#src/libs/communication-v2/reducers';
import company from '#src/libs/company/reducers';
import consumerPaymentPackReducers from '#src/libs/consumer-payment-pack/reducers';
import consumerReducers from '#src/libs/consumer-space/reducers';
import consumerReducersReworked from '#src/libs/consumer-space/reducersReworked';
import couponReducers from '#src/libs/coupon/reducers';
import CustomFormReducer from '#src/libs/custom-form/reducers';
// @ts-expect-error
import dashboardSettings from '#src/libs/dashboard/reducers';
import datatypeFilteringReducers from '#src/libs/datatype-filtering/reducers';
import deleteObjectReducers from '#src/libs/delete-object/reducers';
import emailTemplateReducer from '#src/libs/email-editor/reducers';
import establishmentReducers from '#src/libs/establishment/reducers';
import event from '#src/libs/event/reducers';
import expense from '#src/libs/expense/reducers';
import exportableComponentsReducers from '#src/libs/exportable-components/reducers';
import franchiseReducers from '#src/libs/franchise/reducers';
import giftcard from '#src/libs/giftcard/reducers';
import groupOfferReducer from '#src/libs/group-offer/reducers';
import instalmentPayment from '#src/libs/instalment-payment-configuration/reducers';
import invoiceReducers from '#src/libs/invoice/reducers';
import levelReducer from '#src/libs/level/reducers';
// @ts-expect-error
import login from '#src/libs/login/reducers';
import marketingNotification from '#src/libs/marketing/reducers';
import marketplace from '#src/libs/marketplace/reducers';
import memberReducer from '#src/libs/member/reducers';
import membership from '#src/libs/membership/reducers';
import metaActivityReducers from '#src/libs/meta-activity/reducers';
import network from '#src/libs/network/reducers';
import notificationRule from '#src/libs/notification-rule/reducers';
import objectSearchReducers from '#src/libs/fuzzy-search/reducers';
import offer from '#src/libs/offer/reducers';
import orderReducers from '#src/libs/order/reducers';
import partnership from '#src/libs/classpass/reducers';
// @ts-expect-error
import paymentBackend from '#src/libs/payment/reducers';
import paymentModule from '#src/libs/payment/payment-module-revamped/reducers';
import paymentCombo from '#src/libs/payment-combo/reducers';
import paymentPack from '#src/libs/payment-packs/reducers';
import paymentPackReworked from '#src/libs/payment-packs/reducersReworked';
import performanceTracking from '#src/libs/performance-tracking/reducers';
// @ts-expect-error
import platformBilling from '#src/libs/platform-billing/reducers';
import playlist from '#src/libs/playlist/reducers';
import pollReducers from '#src/libs/sign-up-form/reducers';
import privateService from '#src/libs/private-service/reducers';
import QuickbooksAppReducer from '#src/libs/quickbooks/reducers';
import quicksaleReducers from '#src/libs/quicksale/reducers';
import referralReducers from '#src/libs/referral/reducers';
// @ts-expect-error
import relationship from '#src/libs/relationship/reducers';
// @ts-expect-error
import reminder from '#src/libs/reminder/reducers';
import replacementRequestReducer from '#src/libs/replacement-request/reducers';
import reportingReducer from '#src/libs/reporting/v1/reducers';
import reportingReducerV2 from '#src/libs/reporting/v2/reducers';
import roleReducers from '#src/libs/role/reducers';
import settingsReducer from '#src/libs/settings/reducers';
import shopReducer from '#src/libs/shop/reducers';
import shopReworkedReducer from '#src/libs/shop/reducersReworked';
import smartListReducer from '#src/libs/smart-list/reducers';
import snackbarReducer from '#src/libs/snackbar/reducers';
import spotSchedulingReducers from '#src/libs/spot-scheduling/reducers';
import statsReducers from '#src/libs/statistics/reducers';
// @ts-expect-error
import subscriptionReducer from '#src/libs/subscription/reducers';
import tagReducers from '#src/libs/tag/reducers';
import terminalReducers from '#src/libs/terminal/reducers';
import themeReducers from '#src/libs/theme/reducers';
import tutorialReducers from '#src/libs/platform-tutorial/reducers';
import userPreference from '#src/libs/user-preference/reducers';
import video from '#src/libs/video/reducers';
import waitingListReducers from '#src/libs/waiting-list/reducers';
// @ts-expect-error
import webhook from '#src/libs/webhook/reducers';
import wellhubReducers from '#src/libs/wellhub/reducers';
import zoomAppReducers from '#src/libs/zoom-app/reducers';

import type { AccessControlState } from '#src/libs/access-control/types';
import type { ActiveCampaignState } from '#src/libs/active-campaign/types';
import type { AlertingState } from '#src/libs/alerting/types';
import type { BackgroundDialogState } from '#src/libs/background-dialog/types';
import type { BackgroundTaskState } from '#src/libs/background-task/types';
import type { BookingsState } from '#src/libs/booking/types';
import type { BroadcastChannelState } from '#src/libs/broadcast-channel/types';
import type { CashBookState } from '#src/libs/cashbook/types';
import type { CategoryState } from '#src/libs/category/types';
import type { CheckoutState } from '#src/libs/checkout/types';
import type { ClockInState } from '#src/libs/clock-in/types';
import type { CoachPaymentRuleState } from '#src/libs/coach-payment-rules/types';
import type { CoachState } from '#src/libs/associated-coach/types';
import type {
  CommunicationSentGroupConfigState,
  MailState,
} from '#src/libs/communication/types';
import type { CommunicationState } from '#src/libs/communication-v2/types';
import type { CompanyState } from '#src/libs/company/types';
import type { ConsumerPaymentPackState } from '#src/libs/consumer-payment-pack/types';
import type {
  ConsumerState,
  ConsumerStateReworked,
} from '#src/libs/consumer-space/types';
import type { CouponState } from '#src/libs/coupon/types';
import type { CustomFormState } from '#src/libs/custom-form/types';
import type { DatatypeFilteringState } from '#src/libs/datatype-filtering/types';
import type { EmailTemplateState } from '#src/libs/email-editor/types';
import type { EstablishmentState } from '#src/libs/establishment/types';
import type { EventState } from '#src/libs/event/types';
import type { ExpenseState } from '#src/libs/expense/types';
import type { ExportableComponentsState } from '#src/libs/exportable-components/types';
import type { FranchiseState } from '#src/libs/franchise/types';
import type { GiftcardState } from '#src/libs/giftcard/types';
import type { GroupOfferState } from '#src/libs/group-offer/types';
import type { InstalmentPaymentState } from '#src/libs/instalment-payment-configuration/types';
import type { InvoiceState } from '#src/libs/invoice/types';
import type { LevelState } from '#src/libs/level/types';
import type { MarketingNotificationState } from '#src/libs/marketing/types';
import type { MarketplaceSettingState } from '#src/libs/marketplace/types';
import type { MembershipState } from '#src/libs/membership/types';
import type { MemberState } from '#src/libs/member/types';
import type { MetaActivityState } from '#src/libs/meta-activity/types';
import type { NotificationRuleState } from '#src/libs/notification-rule/types';
import type { OfferState } from '#src/libs/offer/types';
import type { OrderState } from '#src/libs/order/types';
import type { PartnershipState } from '#src/libs/classpass/types';
import type { PaymentBackendState } from '#src/libs/payment/types';
import type { PaymentComboState } from '#src/libs/payment-combo/types';
import type { PaymentModuleState } from '#src/libs/payment/payment-module-revamped/types';
import type {
  PaymentPackState,
  PaymentPackStateReworked,
} from '#src/libs/payment-packs/types';
import type { PerformanceTrackingState } from '#src/libs/performance-tracking/types';
import type { PlaylistState } from '#src/libs/playlist/types';
import type { PollState } from '#src/libs/sign-up-form/types';
import type { PrivateServiceState } from '#src/libs/private-service/types';
import type { QuickbooksState } from '#src/libs/quickbooks/types';
import type { QuicksaleState } from '#src/libs/quicksale/types';
import type { ReferralState } from '#src/libs/referral/types';
import type { ReplacementRequestState } from '#src/libs/replacement-request/types';
import type {
  ReportingState,
  ReportingStateV2,
} from '#src/libs/reporting/common/types';
import type { RoleState } from '#src/libs/role/types';
import type { SearchState } from '#src/libs/fuzzy-search/types';
import type { SequentialMarketingState } from '#src/libs/sequential_marketing/types';
import type { SettingsState } from '#src/libs/settings/types';
import type { ShopState, ShopStateReworked } from '#src/libs/shop/types';
import type { SmartListState } from '#src/libs/smart-list/types';
import type { SnackbarState } from '#src/libs/snackbar/types';
import type { SpotSchedulingState } from '#src/libs/spot-scheduling/types';
import type { SubscriptionState } from '#src/libs/subscription/types';
import type { TagState } from '#src/libs/tag/types';
import type { TerminalState } from '#src/libs/terminal/types';
import type { ThemeState } from '#src/libs/theme/types';
import type { TutorialState } from '#src/libs/platform-tutorial/types';
import type { UserPreference } from '#src/libs/user-preference/types';
import type { VideoState } from '#src/libs/video/types';
import type { WaitingListState } from '#src/libs/waiting-list/types';
import type { WellhubState } from '#src/libs/wellhub/types';
import type { ZoomAppState } from '#src/libs/zoom-app/types';
import { authActionTypes } from '#src/actions/constants';
// @ts-expect-error
import searchReducer from './search.reducers';
// @ts-expect-error
import authReducers from './auth';
import type { DeleteObjectState } from '#src/libs/delete-object/types';
import type { AuthState } from '#src/libs/types';

const rootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    accessControl: accessControlReducers,
    activeCampaign,
    alerting: alertingReducer,
    auth: authReducers,
    backgroundDialog: backgroundDialogReducer,
    backgroundTask: backgroundTaskReducers,
    booking: bookingReducers,
    broadcastChannel: broadcastChannelReducers,
    cadence: CadenceReducers,
    cashbook: cashBookReducers,
    category: categoryReducers,
    checkout: checkoutReducers,
    clockIn: ClockinReducer,
    coach: coachReducers,
    coachPaymentRules: CoachPaymentRuleReducer,
    communication: communicationReducers,
    communicationSentGroupConfig: communicationSentGroupConfigReducers,
    communicationV2: communicationV2Reducers,
    company,
    consumer: consumerReducers,
    consumerPaymentPack: consumerPaymentPackReducers,
    consumerReworked: consumerReducersReworked,
    coupon: couponReducers,
    customForm: CustomFormReducer,
    dashboardSettings,
    datatypeFiltering: datatypeFilteringReducers,
    deleteObject: deleteObjectReducers,
    emailTemplate: emailTemplateReducer,
    establishment: establishmentReducers,
    event,
    expense,
    exportableComponents: exportableComponentsReducers,
    franchise: franchiseReducers,
    giftcard,
    groupOffer: groupOfferReducer,
    instalmentPayment,
    invoice: invoiceReducers,
    level: levelReducer,
    login,
    marketingNotification,
    marketplace,
    member: memberReducer,
    membership,
    metaActivity: metaActivityReducers,
    network,
    notificationRule,
    objectSearch: objectSearchReducers,
    offer,
    order: orderReducers,
    partnership,
    paymentBackend,
    paymentModule,
    paymentCombo,
    paymentPack,
    paymentPackReworked,
    performanceTracking,
    platformBilling,
    playlist,
    poll: pollReducers,
    privateService,
    quickbooks: QuickbooksAppReducer,
    quicksale: quicksaleReducers,
    referral: referralReducers,
    relationship,
    reminder,
    replacementRequest: replacementRequestReducer,
    reports: reportingReducer,
    reportsV2: reportingReducerV2,
    role: roleReducers,
    search: searchReducer,
    settings: settingsReducer,
    shop: shopReducer,
    shopReworked: shopReworkedReducer,
    smartList: smartListReducer,
    snackbar: snackbarReducer,
    spotScheduling: spotSchedulingReducers,
    stats: statsReducers,
    subscription: subscriptionReducer,
    tag: tagReducers,
    terminal: terminalReducers,
    theme: themeReducers,
    tutorial: tutorialReducers,
    userPreference,
    video,
    waitingList: waitingListReducers,
    webhook,
    wellhub: wellhubReducers,
    zoomApp: zoomAppReducers,
  });

export type RootState = {
  router: ReturnType<typeof connectRouter>;
  accessControl: AccessControlState;
  activeCampaign: ActiveCampaignState;
  alerting: AlertingState;
  auth: AuthState;
  backgroundDialog: BackgroundDialogState;
  backgroundTask: BackgroundTaskState;
  booking: BookingsState;
  broadcastChannel: BroadcastChannelState;
  cadence: SequentialMarketingState;
  cashbook: CashBookState;
  category: CategoryState;
  checkout: CheckoutState;
  clockIn: ClockInState;
  coach: CoachState;
  coachPaymentRules: CoachPaymentRuleState;
  communication: MailState;
  communicationSentGroupConfig: CommunicationSentGroupConfigState;
  communicationV2: CommunicationState;
  company: CompanyState;
  consumer: ConsumerState;
  consumerPaymentPack: ConsumerPaymentPackState;
  consumerReworked: ConsumerStateReworked;
  coupon: CouponState;
  customForm: CustomFormState;
  dashboardSettings: any;
  datatypeFiltering: DatatypeFilteringState;
  deleteObject: DeleteObjectState;
  emailTemplate: EmailTemplateState;
  establishment: EstablishmentState;
  event: EventState;
  expense: ExpenseState;
  exportableComponents: ExportableComponentsState;
  franchise: FranchiseState;
  giftcard: GiftcardState;
  groupOffer: GroupOfferState;
  instalmentPayment: InstalmentPaymentState;
  invoice: InvoiceState;
  level: LevelState;
  login: any;
  marketingNotification: MarketingNotificationState;
  marketplace: MarketplaceSettingState;
  member: MemberState;
  membership: MembershipState;
  metaActivity: MetaActivityState;
  network: any;
  notificationRule: NotificationRuleState;
  objectSearch: SearchState;
  offer: OfferState;
  order: OrderState;
  partnership: PartnershipState;
  paymentModule: PaymentModuleState;
  paymentBackend: PaymentBackendState;
  paymentCombo: PaymentComboState;
  paymentPack: {
    [key: string]: any;
    massExtension: PaymentPackState['massExtension'];
    universalPaymentPackTemplate: PaymentPackState['universalPaymentPackTemplate'];
  };
  paymentPackReworked: PaymentPackStateReworked;
  paymentRules: any;
  performanceTracking: PerformanceTrackingState;
  platformBilling: any;
  playlist: PlaylistState;
  poll: PollState;
  privateService: PrivateServiceState;
  quickbooks: QuickbooksState;
  quicksale: QuicksaleState;
  referral: ReferralState;
  relationship: any;
  reminder: any;
  replacementRequest: ReplacementRequestState;
  reports: ReportingState;
  reportsV2: ReportingStateV2;
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
  tag: TagState;
  terminal: TerminalState;
  theme: ThemeState;
  tutorial: TutorialState;
  userPreference: UserPreference;
  video: VideoState;
  waitingList: WaitingListState;
  webhook: any;
  wellhub: WellhubState;
  zoomApp: ZoomAppState;
};

export default (history: any) => (state: any, action: any) => {
  const newState = state;
  if (action.type === authActionTypes.DISCONNECT) {
    return rootReducer(history)(undefined, action);
  }

  if (action.type === authActionTypes.RESET_STORE) {
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
