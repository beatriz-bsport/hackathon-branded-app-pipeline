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
    return {};
  }
  const paginatedState = communicationSentByKey[stringifiedCampaignId];
  if (!paginatedState) {
    return {};
  }
  return paginatedState.byId;
};
