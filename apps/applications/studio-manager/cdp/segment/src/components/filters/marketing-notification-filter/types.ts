import type {
  CreateMarketingNotificationFilterPayload,
  UpdateMarketingNotificationFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";
import type { CombineModeOption, ConsentOption } from "./constants";

export type MarketingNotificationFilterFormValue = {
  id?: number;
  smartlist: number;
  smsFilterActive: boolean;
  smsConsent: ConsentOption;
  emailFilterActive: boolean;
  emailConsent: ConsentOption;
  combineMode: CombineModeOption;
  isV2: boolean;
};

export type MarketingNotificationFilterCreatePayload =
  CreateMarketingNotificationFilterPayload;

export type MarketingNotificationFilterDirtyPatchPayload =
  UpdateMarketingNotificationFilterPayload;

export type MarketingNotificationFilterCardProps =
  SegmentFilterCardProps<MarketingNotificationFilterFormValue>;
