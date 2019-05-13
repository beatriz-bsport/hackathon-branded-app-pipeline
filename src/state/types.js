// @flow

import type { AuthAction } from './auth/types';
import type { PaymentRulesState } from '../libs/payment-rules/types';
import type { StatsState } from './stats/types';
import type { CoachesState } from './coaches/types';
import type { SubscriptionState } from '../libs/subscription/types';
import type { SearchState, SearchAction } from './search/types';

export type State = {
  paymentRules: PaymentRulesState,
  stats: StatsState,
  coach: CoachesState,
  search: SearchState,
  subscription: SubscriptionState,
  nav: NavigationState,
};
export type Action = SearchAction | AuthAction;

export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
export type GetState = () => State;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
