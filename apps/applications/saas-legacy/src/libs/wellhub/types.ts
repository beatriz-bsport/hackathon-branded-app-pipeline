import { GymAvailabilityReasonCode } from '#src/libs/wellhub/constants';

import type { ErrorAndLoading } from '#src/libs/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { OfferREST } from '#src/libs/offer/types';
import type { ReworkedPaginationResponse } from '#src/state/types';

export type WellhubGym = {
  uuid: string;
  are_webhooks_configured: boolean;
  company: number;
  establishments: Establishment[];
  gym_id: number;
  gym_name: string;
  products: WellhubProduct[];
};

export type WellhubGymUpsert = {
  uuid: string;
  are_webhooks_configured: boolean;
  company: number;
  establishments: number[];
  gym_id: number;
  gym_name: string;
  products: WellhubProduct[];
};

export type GymAvailabilityQueryParams = { gym_id: number };

export type GymAvailabilityResponse = {
  gym_id: number;
  is_available: boolean;
  reason_code: GymAvailabilityReasonCode;
  reason_text: string;
  wellhub_gym_uuid: string | null;
};

export type WellhubGymUpsertPayload = {
  gym_id: number;
  establishments: number[];
  disabled?: boolean;
};

export type WellhubState = {
  allUuids: string[];
  byUuid: { [uuid: string]: WellhubGym };
  gymAvailability: ErrorAndLoading & {
    record: { [gym_id: number]: GymAvailabilityResponse };
  };
  offersMissingProduct: ErrorAndLoading & {
    data: ReworkedPaginationResponse<OfferREST>;
  };
} & ErrorAndLoading;

export type WellhubProductId = number;

export type WellhubProduct = {
  product_id: WellhubProductId;
  name: string;
  virtual: boolean;
  updated_at: string;
};

export type WellhubProductOption = {
  label: string;
  value: WellhubProductId;
};

export type ProductsByWellhubGymUuid = {
  [uuid: string]: WellhubProduct[];
};

export type FetchWellhubProductsResponse = {
  products_by_wellhub_gym: ProductsByWellhubGymUuid;
};

export type WellhubProductSelectionFormValues = {
  modifyRecursively: boolean;
  selectedSimilarOffers: number[];
  wellhubProductId: WellhubProductId | null;
};
