// @flow
import type { MarketPlaceState } from '../libs/marketplace/types';

export type Dispatch = (action: *) => any;
export type State = {
  marketplacev2: MarketPlaceState,
};
