import { type PaginatedState, buildById } from "@bsport/store-base";

import { CommunicationObjectKey } from "#src/constants";
import { communicationStore } from "#src/store";
import type {
  CampaignSummary,
  CommunicationRecipient,
  CommunicationSent,
} from "#src/types";

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

/**
 * Fills the Zustand store with recipients data,
 * grouping recipients by their member id and assigning this record to each communication_sent id.
 * This endpoint is pretty special because we can provide a list of recipients for multiple communication_sent ids at once.
 * We don't group by objectType and objectId here because recipients are always fetched by communication_sent ids.
 *
 * @param recipients - The array of recipients
 */
export const setRecipientsList = ({
  recipients,
  page,
  count,
}: {
  recipients: CommunicationRecipient[];
  page: number;
  count: number;
}) => {
  communicationStore.setState((state) => {
    // Group recipients by communication_sent id
    const recipientsByCommunicationSent = recipients.reduce<
      Record<number, PaginatedState<CommunicationRecipient>>
    >((acc, recipient) => {
      const commSentId = recipient.communication_sent;
      const recipientId = recipient.member;

      // Get existing paginated state for this communication_sent id, or initialize
      const existingState = state.recipients?.[commSentId] || {
        byId: {},
        page,
        count,
        ids: [],
      };

      // Merge new recipient into byId
      const newById = {
        ...existingState.byId,
        [recipientId]: recipient,
      };

      // Merge ids, avoiding duplicates
      const newIds = Array.from(new Set([...existingState.ids, recipientId]));

      acc[commSentId] = {
        byId: newById,
        page,
        count,
        ids: newIds,
      };
      return acc;
    }, {});

    return {
      recipients: {
        ...state.recipients,
        ...recipientsByCommunicationSent,
      },
    };
  });
};
