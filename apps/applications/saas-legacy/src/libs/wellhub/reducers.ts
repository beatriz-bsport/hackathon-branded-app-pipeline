import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';

import { fetchOffersMissingWellhubProductActions } from '#src/libs/wellhub/actions';

import type { OfferSaas } from '#src/libs/offer/types';
import type { PaginatedResponse } from '#src/state/types';
import type { WellhubState } from '#src/libs/wellhub/types';
import { WELLHUB_OFFER_DEFAULT_PAGE_SIZE } from './constants';

export type ImmutableWellhubState = Immutable.Immutable<WellhubState>;

export const initialWellhubState: ImmutableWellhubState =
  Immutable<WellhubState>({
    offersMissingProduct: {
      loading: false,
      error: null,
      data: {
        current_page: 1,
        next_page: null,
        page_size: WELLHUB_OFFER_DEFAULT_PAGE_SIZE,
        previous_page: null,
        results: [],
        total_count: 0,
        total_pages: 0,
      },
    },
  });

export default handleActions<ImmutableWellhubState, any>(
  {
    [fetchOffersMissingWellhubProductActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['offersMissingProduct', 'loading'], payload);
    },
    [fetchOffersMissingWellhubProductActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['offersMissingProduct', 'error'], payload);
    },
    [fetchOffersMissingWellhubProductActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<OfferSaas> },
    ) => {
      return state.setIn(['offersMissingProduct', 'data'], payload);
    },
  },
  initialWellhubState,
);
