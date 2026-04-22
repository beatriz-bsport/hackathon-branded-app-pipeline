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

/**
 * Query parameters for listing and filtering VOD videos.
 */
export type FetchVideosParams = {
  page?: number;
  page_size?: number;
  search?: string;
  company?: number;
  status?: VideoStatusEnum;
  SCT?: number;
  level?: number;
  ordering?: string;
} & URLParams;

/**
 * Payload used to create a VOD video.
 */
export type CreateVideoParams = FormData;

/**
 * Payload used to update an existing VOD video.
 */
export type UpdateVideoParams = {
  id: number;
  data: FormData;
};

/**
 * Parameters for requesting an upload instruction.
 */
export type UploadInstructionParams = {
  id: number;
  file_extension?: string;
};

/**
 * Upload instruction returned by `/vod/video/:id/upload_instruction/`.
 */
export type UploadInstruction = {
  method: string;
  url: string;
  bodyType: string;
  fields: Record<string, string>;
};
