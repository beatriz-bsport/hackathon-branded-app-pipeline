import {
  buildUrlParams,
  deleteAuth,
  getAuth,
  postAuth,
  putAuth,
} from '#src/http';

import type { OfferSaas } from '#src/libs/offer/types';
import type {
  PaginatedResponse,
  ReworkedPaginationResponse,
} from '#src/state/types';
import type { PaginationFilterParams } from '#src/libs/types';
import type {
  FetchWellhubProductsResponse,
  GymAvailabilityQueryParams,
  GymAvailabilityResponse,
  WellhubGym,
  WellhubGymUpsert,
  WellhubGymUpsertPayload,
} from '#src/libs/wellhub/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export const getGymAvailability = (params: GymAvailabilityQueryParams) => {
  return getAuth<GymAvailabilityResponse>(
    `${API_V1_URI}/wellhub/wellhub-gym/gym-id-availability/${buildUrlParams(
      params,
    )}`,
  );
};

export const createWellhubGym = (data: WellhubGymUpsertPayload) => {
  return postAuth<WellhubGymUpsert>(`${API_V1_URI}/wellhub/wellhub-gym/`, data);
};

export const fetchWellhubGyms = () => {
  return getAuth<PaginatedResponse<WellhubGym>>(
    `${API_V1_URI}/wellhub/wellhub-gym/`,
  );
};

export const getWellhubGym = (wellhubGymUuid: string) => {
  return getAuth<WellhubGym>(
    `${API_V1_URI}/wellhub/wellhub-gym/${wellhubGymUuid}/`,
  );
};

export const updateWellhubGym = (
  wellhubGymUuid: string,
  data: WellhubGymUpsertPayload,
) => {
  return putAuth<WellhubGymUpsert>(
    `${API_V1_URI}/wellhub/wellhub-gym/${wellhubGymUuid}/`,
    data,
  );
};

export const deleteWellhubGym = (wellhubGymUuid: string) => {
  return deleteAuth<void>(
    `${API_V1_URI}/wellhub/wellhub-gym/${wellhubGymUuid}/`,
  );
};

export const configureWellhubGymWebhooks = (wellhubGymUuid: string) => {
  return putAuth<WellhubGym>(
    `${API_V1_URI}/wellhub/wellhub-gym/${wellhubGymUuid}/configure-webhooks/`,
  );
};

export const fetchWellhubProducts = () => {
  return getAuth<FetchWellhubProductsResponse>(
    `${API_V1_URI}/wellhub/wellhub-gym/get-products-by-wellhub-gym/`,
  );
};

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
