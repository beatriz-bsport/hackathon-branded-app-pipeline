export interface PresignedUrlResponse {
  presigned_url?: string;
  embed_url?: string;
}

export type DashboardType =
  | "trial_analysis"
  | "recurring_revenue"
  | "booking"
  | "schedule_analysis"
  | "community_health";
