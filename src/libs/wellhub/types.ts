import type { Establishment } from '#src/libs/establishment/types';
import { GymAvailabilityReasonCodes } from '#src/libs/wellhub/constants';

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

export type GymAvailabilityReason = (typeof GymAvailabilityReasonCodes)[number];

export type GymAvailabilityResponse = {
  gym_id: number;
  is_available: boolean;
  reason_code: GymAvailabilityReason;
  reason_text: string;
};

export type WellhubGymUpsertPayload = {
  gym_id: number;
  establishments: number[];
};
