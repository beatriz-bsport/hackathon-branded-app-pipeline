// @flow

import type { AuthAction } from './auth/types';
import type { PaymentRulesState } from '../libs/payment-rules/types';
import type { StatsState } from './stats/types';
import type { CoachState } from '../libs/associated-coach/types';
import type { SubscriptionState } from '../libs/subscription/types';
import type { MemberState } from '../libs/member/types';
import type { PaymentPackState } from '../libs/payment-packs/types';
import type { BookingsState } from '../libs/booking/types';
import type { TagState } from '../libs/tag/types';
import type { OrderState } from '../libs/order/types';
import type { ShopState } from '../libs/shop/types';
import type { MarketPlaceState } from '../libs/marketplace/types';
import type { CheckoutState } from '../libs/checkout/types';
import type { SearchState, SearchAction } from './search/types';
import type { ThemeState } from '../libs/theme/types';
import type { EstablishmentState } from '../libs/establishment/types';
import type { CouponState } from '../libs/coupon/types';
import type { LoginState } from '../libs/login/types';
import type { PrivateServiceState } from '../libs/private-service/types';
import type { PaymentComboState } from '../libs/payment-combo/types';
import type { ReminderState } from '../libs/reminder/types';

export type State = {
  paymentRules: PaymentRulesState,
  stats: StatsState,
  coach: CoachState,
  search: SearchState,
  subscription: SubscriptionState,
  nav: NavigationState,
  paymentPack: PaymentPackState,
  member: MemberState,
  booking: BookingsState,
  order: OrderState,
  tag: TagState,
  shop: ShopState,
  marketplacev2: MarketPlaceState,
  theme: ThemeState,
  establishment: EstablishmentState,
  checkout: CheckoutState,
  coupon: CouponState,
  login: LoginState,
  privateService: PrivateServiceState,
  paymentCombo: PaymentComboState,
  reminder: ReminderState,
};
export type Action = SearchAction | AuthAction;

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;

export type OptionCallback = {
  onSuccess?: (any) => void,
  onError?: (?Error) => void,
};
