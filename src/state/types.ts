import { AuthAction } from './auth/types';
import { PaymentRulesState } from '../libs/payment-rules/types';
import { StatsState } from './stats/types';
import { CoachState } from '../libs/associated-coach/types';
import { SubscriptionState } from '../libs/subscription/types';
import { TutorialState } from '../libs/platform-tutorial/types';
import { MemberState } from '../libs/member/types';
import { PaymentPackState } from '../libs/payment-packs/types';
import { BookingsState } from '../libs/booking/types';
import { TagState } from '../libs/tag/types';
import { OrderState } from '../libs/order/types';
import { ShopState } from '../libs/shop/types';
import { CheckoutState } from '../libs/checkout/types';
import { SearchState, SearchAction } from './search/types';
import { ThemeState } from '../libs/theme/types';
import { EstablishmentState } from '../libs/establishment/types';
import { CouponState } from '../libs/coupon/types';
import { LoginState } from '../libs/login/types';
import { PrivateServiceState } from '../libs/private-service/types';
import { PaymentComboState } from '../libs/payment-combo/types';
import { ReminderState } from '../libs/reminder/types';
import { MembershipState } from '../libs/membership/types';
import { CompanyState } from '../libs/company/types';
import { NotificationRuleState } from '../libs/notification-rule/types';
import { MarketingNotificationState } from '../libs/marketing/types';
import { PartnershipState } from '../libs/partnership/types';
import { DashboardSettingsState } from '../libs/dashboard/types';
import { RelationshipState } from '../libs/relationship/types';

import { BackgroundTaskState } from '../libs/background-task/types';
import { RootState } from '../reducers';
import { PerformanceTrackingState } from '#libs/performance-tracking/types';
import { ClockInState } from '#libs/clock-in/types';

export type State = {
  backgroundTask: BackgroundTaskState;
  booking: BookingsState;
  checkout: CheckoutState;
  clockIn: ClockInState;
  coach: CoachState;
  company: CompanyState;
  coupon: CouponState;
  dashboardSettings: DashboardSettingsState;
  establishment: EstablishmentState;
  login: LoginState;
  marketingNotification: MarketingNotificationState;
  member: MemberState;
  membership: MembershipState;
  nav: any; // TODO TYPES
  notificationRule: NotificationRuleState;
  order: OrderState;
  partnership: PartnershipState;
  paymentCombo: PaymentComboState;
  paymentPack: PaymentPackState;
  paymentRules: PaymentRulesState;
  performanceTracking: PerformanceTrackingState;
  privateService: PrivateServiceState;
  relationship: RelationshipState;
  reminder: ReminderState;
  search: SearchState;
  shop: ShopState;
  stats: StatsState;
  subscription: SubscriptionState;
  tag: TagState;
  theme: ThemeState;
  tutorial: TutorialState;
};
export type Action = SearchAction | AuthAction;

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => RootState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
export type PaginatedResponse<T = void> = {
  links: { next: number | null; previous: number | null };
  next_page: number | null;
  results: Array<T>;
};
export type ErrorAndLoading = {
  loading: boolean;
  error?: Error;
};

export type OptionCallback<T = void> = {
  onSuccess?: (args?: T) => void;
  onError?: (error?: Error) => void;
};

export type OptionBackgroundCallback = {
  onSuccess?: () => void;
  onError?: (error?: Error) => void;
  onBackgroundSuccess?: () => void;
  onBackgroundError?: () => void;
};

export type OptionPaginatedCallback<T = void> = {
  onSuccess?: (args?: PaginatedResponse<T>) => void;
  onError?: (error?: Error) => void;
};
