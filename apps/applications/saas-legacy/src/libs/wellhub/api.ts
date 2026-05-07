import { buildUrlParams, getAuth } from '#src/http';

import type { OfferSaas } from '#src/libs/offer/types';
import type { ReworkedPaginationResponse } from '#src/state/types';
import type { PaginationFilterParams } from '#src/libs/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export const fetchOffersMissingWellhubProduct = (
  params: PaginationFilterParams,
) => {
  const hasParams = Object.keys(params).length > 0;

  return getAuth<ReworkedPaginationResponse<OfferSaas>>(
    `${API_V1_URI}/partnership/wellhub/offers/${buildUrlParams(
      hasParams ? params : null,
    )}`,
  );
};
