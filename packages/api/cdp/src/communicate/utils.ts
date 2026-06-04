import type { PrebuiltSegmentId } from "#src/constants";

import type { FetchCampaignSentParams } from "./types";

type CampaignSentListTargetParams =
  | { smartlist: number }
  | { segment_identifier: PrebuiltSegmentId };

export const getCampaignSentListTargetParams = (
  params: FetchCampaignSentParams,
): CampaignSentListTargetParams => {
  if (typeof params.smartlist === "number") {
    return { smartlist: params.smartlist };
  }

  if (typeof params.segment_identifier === "string") {
    return { segment_identifier: params.segment_identifier };
  }

  throw new Error("Expected campaign sent target to be defined");
};
