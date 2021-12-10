import { VideoProvider } from '@bsport/common/lib/master-data/video-provider';
import { ErrorAndLoading, WithPagination } from '../types';
import { Coach } from '../associated-coach/types';
import { SCT } from '../category/types';

export enum VideoStatusEnum {
  created = 100,
  processing = 200,
  processed = 400,
  error = 0,
}

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
  manager_only: boolean;
  provider_identifier: VideoProvider;
  rental_days: number;
};

export type VideoPurchase = {
  id: number;
  consumer_payment_pack: any;
  private_consumer_pass: any;
  video: any;
  member_id: number;
  date_created: string;
  available: boolean;
};

export type VideoView = {
  id: number;
  date_created: string;
  member_id: number;
};

export type VideoAnalyticsData = {
  id: number;
  video: number;
  nb_views_total: number;
  nb_views_last_week: number;
  nb_distinct_viewers: number;
};

export type VideoState = ErrorAndLoading & {
  byId: { [key: string]: Video };
  list: {
    page: number | null;
    allIds: number[];
    nextPage: number;
  };
  createOrUpdate: ErrorAndLoading;
  updateItem: ErrorAndLoading;
  search: ErrorAndLoading & {
    allIds: number[];
    nextPage: 1;
  };
  analytics: ErrorAndLoading & {
    data: VideoAnalyticsData | null;
  };
  purchase: ErrorAndLoading &
    WithPagination & {
      items: VideoPurchase[];
    };
  views: ErrorAndLoading &
    WithPagination & {
      items: VideoView[];
    };
  filterableParams: ErrorAndLoading & {
    items: {
      SCTs: SCT[];
      coaches: Coach[];
    };
  };
  playbackUrl: {
    loading: boolean;
    error: Error | null;
    byId: { [id: number]: string };
    accessDenied: boolean;
  };
};
