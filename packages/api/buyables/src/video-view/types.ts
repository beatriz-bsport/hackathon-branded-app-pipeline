import type { URLParams } from "@bsport/store-base";

/**
 * Video view returned by `/vod/video_view_analytics/`.
 */
export type VideoView = {
  id: number;
  date_created: string;
  member_id: number;
};

/**
 * Query parameters for listing video views.
 */
export type FetchVideoViewsParams = {
  video_analytics__video?: number;
  member_id?: number;
  page?: number;
  page_size?: number;
  ordering?: string;
} & URLParams;
