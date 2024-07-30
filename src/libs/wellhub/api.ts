import {
  API_V1_URI,
  buildUrlParams,
  deleteAuth,
  getAuth,
  postAuth,
  putAuth,
} from '#src/http';

import type { PaginatedResponse } from '#src/state/types';
import type {
  GymAvailabilityQueryParams,
  GymAvailabilityResponse,
  WellhubGym,
  WellhubGymUpsert,
  WellhubGymUpsertPayload,
} from '#src/libs/wellhub/types';

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
