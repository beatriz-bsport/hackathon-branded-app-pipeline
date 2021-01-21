import { AuthAction } from './auth/types';
import { PaymentRulesState } from '../libs/payment-rules/types';
import { StatsState } from './stats/types';
import { CoachState } from '../libs/associated-coach/types';
import { SubscriptionState } from '../libs/subscription/types';
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

import { BackgroundTaskState } from '../libs/background-task/types';
import { RootState } from '../reducers';

export type State = {
  paymentRules: PaymentRulesState;
  stats: StatsState;
  coach: CoachState;
  search: SearchState;
  subscription: SubscriptionState;
  nav: any; // TODO TYPES
  paymentPack: PaymentPackState;
  member: MemberState;
  booking: BookingsState;
  order: OrderState;
  tag: TagState;
  shop: ShopState;
  theme: ThemeState;
  establishment: EstablishmentState;
  checkout: CheckoutState;
  coupon: CouponState;
  login: LoginState;
  privateService: PrivateServiceState;
  paymentCombo: PaymentComboState;
  reminder: ReminderState;
  membership: MembershipState;
  company: CompanyState;
  notificationRule: NotificationRuleState;
  partnership: PartnershipState;
  backgroundTask: BackgroundTaskState;
  marketingNotification: MarketingNotificationState;
  dashboardSettings: DashboardSettingsState;
};
export type Action = SearchAction | AuthAction;

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => RootState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

export type ErrorAndLoading = {
  loading: boolean;
  error?: Error;
};

export type OptionCallback<T = void> = {
  onSuccess?: (args?: T) => void;
  onError?: (error?: Error) => void;
};
