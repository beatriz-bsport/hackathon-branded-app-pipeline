import type { URLParams } from "@bsport/store-base";

/**
 * Aggregate analytics returned by `/vod/video_analytics/:videoId/`.
 */
export type VideoAnalytics = {
  id: number;
  video: number;
  nb_views_total: number;
  nb_views_last_week: number;
  nb_distinct_viewers: number;
};

/**
 * Per-member analytics entry returned by
 * `/vod/video_analytics/:videoId/get_analytics_per_member/`.
 */
export type VideoAnalyticsPerMember = {
  member: number;
  nb_views_total: number;
  nb_views_last_week: number;
  nb_distinct_viewers: number;
};

/**
 * Query parameters for listing video analytics per member.
 */
export type FetchVideoAnalyticsPerMemberParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
} & URLParams;
