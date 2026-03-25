import { DASHBOARD_TYPES } from "./constants";

export type DashboardType =
  (typeof DASHBOARD_TYPES)[keyof typeof DASHBOARD_TYPES];

export type FetchPresignedUrlParams = {
  dashboardType: DashboardType;
};

export type PresignedUrlResponse = {
  presigned_url?: string;
  embed_url?: string;
};
