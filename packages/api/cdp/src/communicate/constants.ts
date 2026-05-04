export const COMMUNICATION_API_V1 = "communicate/v1";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE_RECIPIENTS = 10;
export const DEFAULT_PAGE_SIZE_CAMPAIGN_SENT_LIST = 100;
export const DEFAULT_PAGE_SIZE_CAMPAIGN_SCHEDULED_LIST = 50;

export const BackgroundTaskStatus = {
  PENDING: 0,
  SUCCESS: 1,
  FAILED: 2,
} as const;

export type BackgroundTaskStatus =
  (typeof BackgroundTaskStatus)[keyof typeof BackgroundTaskStatus];
