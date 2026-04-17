import { createStore } from "zustand/vanilla";

import { PaginatedState, bindStore } from "@bsport/store-base";

import type {
  CampaignSummaryState,
  CommunicationRecipient,
  CommunicationRecipientWithMemberData,
  CommunicationSent,
} from "#src/types/models";

export interface CommunicationState {
  campaignSummaries: {
    [objectType: string]: {
      [objectId: string]: CampaignSummaryState;
    };
  };
  communications: {
    [objectType: string]: {
      [objectId: string]: PaginatedState<CommunicationSent>;
    };
  };
  recipients: {
    [communicationId: number]: PaginatedState<CommunicationRecipient>;
  };
  recipientsWithMemberData: {
    [
      campaignUuid: string
    ]: PaginatedState<CommunicationRecipientWithMemberData>;
  };
}

export const communicationStore = createStore<CommunicationState>()(() => ({
  campaignSummaries: {},
  communications: {},
  recipients: {},
  recipientsWithMemberData: {},
}));

export const useCommunicationStore = bindStore(communicationStore);
