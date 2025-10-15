import { buildById } from "@bsport/store-base";

import { CommunicationObjectKey } from "#src/constants";
import { communicationStore } from "#src/store";
import type { CampaignSummary, CommunicationSent } from "#src/types";

export const setCampaignSummary = ({
  campaignSummary,
  objectType,
  objectId,
}: {
  campaignSummary: CampaignSummary;
  objectType: CommunicationObjectKey;
  objectId: number;
}) => {
  communicationStore.setState((state) => {
    const stringifiedKey = String(objectType);
    const stringifiedObjectId = String(objectId);

    // For now we are calculating email opening rate here
    // as we don't have a backend way to do it
    // We might want to move this logic to the backend later and there is a ticket to monitor this :
    // https://linear.app/bsport/issue/CDP-1013/communication-update-campaign-summary-endpoint-to-compute-some-stats
    const emailOpeningRate =
      campaignSummary.total_recipients > 0
        ? (campaignSummary.total_read / campaignSummary.total_recipients) * 100
        : 0;

    return {
      campaignSummaries: {
        ...state.campaignSummaries,
        [stringifiedKey]: {
          ...state.campaignSummaries[stringifiedKey],
          [stringifiedObjectId]: {
            ...campaignSummary,
            emailOpeningRate,
          },
        },
      },
    };
  });
};

/**
 * Fills the Zustand store with paginated CommunicationSent data
 *
 * @param key - The communication object key to organize data by
 * @param objectId - The ID of the object (e.g., member_id, smartlist_id)
 * @param response - The paginated response containing CommunicationSent data
 * @param append - Whether to append to existing data (for pagination) or replace it
 */
export const setCommunicationSentList = ({
  communications,
  page,
  count,
  objectType,
  objectId,
}: {
  communications: CommunicationSent[];
  page: number;
  count: number;
  objectType: string;
  objectId: string | number;
}) => {
  communicationStore.setState((state) => {
    const stringifiedKey = String(objectType);
    const stringifiedObjectId = String(objectId);

    const existingData =
      state.communications[stringifiedKey]?.[stringifiedObjectId];
    const existingDataById = Array.isArray(existingData?.byId)
      ? existingData.byId
      : [];
    const newData = [...existingDataById, ...communications];

    return {
      communications: {
        ...state.communications,
        [stringifiedKey]: {
          ...state.communications[stringifiedKey],
          [stringifiedObjectId]: {
            byId: buildById<CommunicationSent>({
              initial:
                state.communications[stringifiedKey]?.[stringifiedObjectId]
                  ?.byId || {},
              newItems: newData,
            }),
            page,
            count,
            ids: newData.map((item) => item.id),
          },
        },
      },
    };
  });
};
