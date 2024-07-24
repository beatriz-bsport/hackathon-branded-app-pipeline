import type { Establishment } from '#src/libs/establishment/types';

export type WellhubGym = {
  uuid: string;
  are_webhooks_configured: boolean;
  company: number;
  establishments: Establishment[];
  gym_id: number;
  gym_name: string;
  products: any[]; //TODO: Type this properly
};
