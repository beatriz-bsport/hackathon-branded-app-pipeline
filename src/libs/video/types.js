// @flow

export type VideoPurchase = {
  id: number,
  date_created: string,
  member_id: number,
  member: any,
};

export type VideoView = {
  id: number,
  date_created: string,
  member_id: number,
  member: any,
};

export type VideoAnalyticsData = {
  id: number,
  video: number,
  nb_views_total: number,
  nb_views_last_week: number,
  nb_distinct_viewers: number,
};
