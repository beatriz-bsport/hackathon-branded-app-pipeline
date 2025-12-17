// @ts-expect-error
import { ReminderState } from '#src/libs/reminder/types';
import { PerformanceTrackingState } from '#src/libs/performance-tracking/types';
import { ClockInState } from '#src/libs/clock-in/types';
// @ts-expect-error
import { AuthAction } from './auth/types';

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
// @ts-expect-error
import { SearchAction, SearchState } from './search/types';
import { ThemeState } from '../libs/theme/types';
import { EstablishmentState } from '../libs/establishment/types';
import { CouponState } from '../libs/coupon/types';
import { LoginState } from '../libs/login/types';
import { PrivateServiceState } from '../libs/private-service/types';
import { PaymentComboState } from '../libs/payment-combo/types';
import { MembershipState } from '../libs/membership/types';
import { CompanyState } from '../libs/company/types';
import { NotificationRuleState } from '../libs/notification-rule/types';
import { MarketingNotificationState } from '../libs/marketing/types';
import { PartnershipState } from '#src/libs/classpass/types';
import { DashboardSettingsState } from '../libs/dashboard/types';
import { RelationshipState } from '../libs/relationship/types';

import { BackgroundTaskState } from '../libs/background-task/types';
import { RootState } from '../reducers';
import type { AxiosError } from 'axios';

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
  count: number;
  page: number;
};
export type ErrorAndLoading = {
  loading: boolean;
  error?: Error;
};

export type ReworkedPaginationResponse<T> = {
  current_page: number; // The current page number
  total_pages: number; // Total number of pages available
  total_count: number; // Total number of items across all pages
  next_page: number | null; // The next page number, or null if there is no next page
  previous_page: number | null; // The previous page number, or null if there is no previous page
  results: T[]; // Array of results for the current page
  page_size: number; // The size of the current page
};

export type OptionCallback<T = void, CustomError = Error | AxiosError> = {
  onSuccess?: (args?: T) => void;
  onError?: (error?: CustomError) => void;
};

export type CustomErrorActionCallback = {
  customErrorAction: () => void;
};

export type OptionBackgroundCallback<
  T = void,
  U = undefined,
  CustomBackgroundError = Error,
> = {
  onSuccess?: (args?: T) => void;
  onError?: (error?: Error) => void;
  onBackgroundSuccess?: (args?: U) => void;
  onBackgroundError?: (error?: CustomBackgroundError) => void;
};

export type OptionPaginatedCallback<T = void> = {
  onSuccess?: (args?: PaginatedResponse<T>) => void;
  onError?: (error?: Error) => void;
};

export type KeyedCallbacks<KeyEnum extends number> = {
  [key in KeyEnum]?: () => void;
};

export type OptionCallBackWithKeyedCallbacks<
  T = void,
  KeyedCallBackEnum extends number = number,
> = OptionCallback<T> & KeyedCallbacks<KeyedCallBackEnum>;

export type APIPollOptionCallback<T = void> = {
  onPollSuccess?: (args?: T) => void;
  onPollError?: (error?: Error) => void;
};
