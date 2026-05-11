import { createAction } from 'redux-actions';
import { fetchOffersMissingWellhubProduct as fetchOffersMissingWellhubProductAPI } from '#src/libs/wellhub/api';

import type { OfferSaas } from '#src/libs/offer/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type {
  Dispatch,
  OptionCallback,
  ReworkedPaginationResponse,
} from '#src/state/types';

export const fetchOffersMissingWellhubProductActions = {
  isLoading: createAction<boolean>('WELLHUB/OFFER_MISSING_PRODUCT/IS_LOADING'),
  error: createAction<Error | null>('WELLHUB/OFFER_MISSING_PRODUCT/ERROR'),
  success: createAction<ReworkedPaginationResponse<OfferSaas>>(
    'WELLHUB/OFFER_MISSING_PRODUCT/SUCCESS',
  ),
};

export function fetchOffersMissingWellhubProduct(
  params: PaginationFilterParams,
  options?: OptionCallback<ReworkedPaginationResponse<OfferSaas>>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchOffersMissingWellhubProductActions.isLoading(true));
    dispatch(fetchOffersMissingWellhubProductActions.error(null));

    try {
      const response = await fetchOffersMissingWellhubProductAPI(params);
      dispatch(fetchOffersMissingWellhubProductActions.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(fetchOffersMissingWellhubProductActions.error(err));
      options?.onError?.();
    }

    dispatch(fetchOffersMissingWellhubProductActions.isLoading(false));
  };
}
