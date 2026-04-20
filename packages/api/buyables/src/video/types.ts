import type { URLParams } from "@bsport/store-base";

import type { VideoProvider } from "./constants";

export enum VideoStatusEnum {
  created = 100,
  processing = 200,
  processed = 400,
  error = 0,
}

/**
 * Model: Video
 *
 * Mirrors the legacy VOD video shape used by `/vod/video/`.
 */
export type Video<S = number, C = number> = {
  id: number;
  duration_second: number;
  name: string;
  description: string;
  coaches: C[];
  cover_main: string;
  level: number;
  SCT: S;
  status: VideoStatusEnum;
  date_created: string;
  credit_price: number;
  company: number;
  manager_only: boolean;
  provider_identifier: VideoProvider;
  provider_identifier_defined_by_user: boolean;
  rental_days: number;
};

/**
 * Query parameters for listing VOD videos by id (`id__in`).
 */
export type FetchVideosByIdsParams = {
  id__in: number[];
  page_size: number;
} & URLParams;
