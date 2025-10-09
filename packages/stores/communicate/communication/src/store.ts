import { createStore } from "zustand/vanilla";

import { PaginatedState, bindStore } from "@bsport/store-base";

import type { CampaignSummary, CommunicationSent } from "#src/types/models";

export interface CommunicationState {
  campaignSummaries: {
    [objectType: string]: {
      [objectId: string]: CampaignSummary;
    };
  };
  communications: {
    [objectType: string]: {
      [objectId: string]: PaginatedState<CommunicationSent>;
    };
  };
}

export const communicationStore = createStore<CommunicationState>()(() => ({
  campaignSummaries: {},
  communications: {},
}));

export const useCommunicationStore = bindStore(communicationStore);
