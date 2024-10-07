import { GymAvailabilityReasonCode } from '#src/libs/wellhub/constants';
import type { Establishment } from '#src/libs/establishment/types';
import type { ErrorAndLoading } from '#src/libs/types';

export type WellhubGym = {
  uuid: string;
  are_webhooks_configured: boolean;
  company: number;
  establishments: Establishment[];
  gym_id: number;
  gym_name: string;
  products: any[]; //TODO: Type this properly
};

export type WellhubGymUpsert = {
  uuid: string;
  are_webhooks_configured: boolean;
  company: number;
  establishments: number[];
  gym_id: number;
  gym_name: string;
  products: any[]; //TODO: Type this properly
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
} & ErrorAndLoading;

export type WellhubProductId = number;

export type WellhubProduct = {
  product_id: WellhubProductId;
  name: string;
  updated_at: string | number; // TODO: type better
  is_live_class: boolean;
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
