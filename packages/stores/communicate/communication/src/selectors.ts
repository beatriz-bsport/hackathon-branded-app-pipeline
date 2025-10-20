import { CommunicationObjectKey } from "./constants";
import type { CommunicationState } from "./store";

export const selectCommunicationSentCampaignSummaryById = ({
  state,
  objectType,
  objectId,
}: {
  state: CommunicationState;
  objectType: CommunicationObjectKey;
  objectId: number;
}) => {
  const { campaignSummaries } = state;
  const stringifiedKey = String(objectType);
  const stringifiedCampaignId = String(objectId);

  const campaignSummaryByKey = campaignSummaries[stringifiedKey];
  if (!campaignSummaryByKey) {
    return undefined;
  }
  return campaignSummaryByKey[stringifiedCampaignId];
};

export const selectContextCampaignSummariesMap = ({
  state,
  objectType,
}: {
  state: CommunicationState;
  objectType: CommunicationObjectKey;
}) => {
  const { campaignSummaries } = state;
  const campaignSummaryByKey = campaignSummaries[objectType];
  if (!campaignSummaryByKey) {
    return undefined;
  }

  return campaignSummaryByKey;
};

/**
 * Selector to get communication sent list for a specific key and campaign ID
 *
 **/
export const selectCommunicationSentList = ({
  state,
  objectType,
  objectId,
}: {
  state: CommunicationState;
  objectType: CommunicationObjectKey;
  objectId: number | string;
}) => {
  const { communications } = state;
  const stringifiedKey = String(objectType);
  const stringifiedCampaignId = String(objectId);
  const communicationSentByKey = communications[stringifiedKey];
  if (!communicationSentByKey) {
    return [];
  }
  const paginatedState = communicationSentByKey[stringifiedCampaignId];
  if (!paginatedState) {
    return [];
  }
  const { byId, ids } = paginatedState;

  return ids.filter((id: number) => id in byId).map((id: number) => byId[id]);
};

/**
 * Selector to get communication sent list for a specific key and campaign ID
 *
 **/
export const selectCommunicationSentListCount = ({
  state,
  objectType,
  objectId,
}: {
  state: CommunicationState;
  objectType: CommunicationObjectKey;
  objectId: number | string;
}) => {
  const { communications } = state;
  const stringifiedKey = String(objectType);
  const stringifiedCampaignId = String(objectId);
  const communicationSentByKey = communications[stringifiedKey];
  if (!communicationSentByKey) {
    return 0;
  }
  const paginatedState = communicationSentByKey?.[stringifiedCampaignId];
  return paginatedState?.count ?? 0;
};

/**
 * Selector to get recipients for a specific communication sent by its ID
 */
export const selectRecipientsByCommunicationSentId = ({
  state,
  communicationSentId,
}: {
  state: CommunicationState;
  communicationSentId: number;
}) => {
  const { recipients } = state;

  return recipients?.[communicationSentId];
};

/**
 * Selector to get recipients for a specific communication sent by its ID
 */
export const selectRecipients = (state: CommunicationState) => {
  const { recipients } = state;

  return recipients;
};

/**
 * Selector to get recipients for a specific communication sent by its ID
 */
export const selectRecipientsCount = (
  state: CommunicationState,
  communicationSentId: number,
) => {
  const { recipients } = state;

  return recipients?.[communicationSentId]?.count || 0;
};
