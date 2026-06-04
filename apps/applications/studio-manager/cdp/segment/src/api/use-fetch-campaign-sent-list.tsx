import { useSuspenseQuery } from "@tanstack/react-query";

import { campaignSentListQueryOptions } from "@bsport/api-cdp/communicate";

import { fetch } from "#src/utils/fetch";
import type { PrebuiltSegmentId } from "#src/utils/prebuilt-segment";

type UseFetchCampaignSentListTarget =
  | {
      smartlistId: string;
      segmentIdentifier?: never;
    }
  | {
      segmentIdentifier: PrebuiltSegmentId;
      smartlistId?: never;
    };

type UseFetchCampaignSentListParams = UseFetchCampaignSentListTarget & {
  page: number;
  pageSize: number;
  automatedCampaignId?: number;
  onlyAutomatedCampaign?: boolean;
};

const getCampaignSentListTargetParams = (
  target: UseFetchCampaignSentListTarget,
) => {
  if (typeof target.smartlistId === "string") {
    if (!/^\d+$/.test(target.smartlistId)) {
      throw new Error("Expected smartlistId to be a valid number");
    }

    return { smartlist: Number(target.smartlistId) };
  }

  if (typeof target.segmentIdentifier === "string") {
    return { segment_identifier: target.segmentIdentifier };
  }

  throw new Error("Expected campaign sent target to be defined");
};

export const useFetchCampaignSentList = ({
  page,
  pageSize,
  automatedCampaignId,
  onlyAutomatedCampaign,
  ...target
}: UseFetchCampaignSentListParams) => {
  const targetParams = getCampaignSentListTargetParams(target);

  return useSuspenseQuery(
    campaignSentListQueryOptions(fetch, {
      ...targetParams,
      page,
      page_size: pageSize,
      automated_campaign_id: automatedCampaignId,
      no_automated_campaign: onlyAutomatedCampaign ? undefined : true,
      only_automated_campaign: onlyAutomatedCampaign,
      without_member_info: true,
    }),
  );
};
