import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type AutomatedCampaign,
  CommunicationKind,
  EventKind,
  automatedCampaignsQueryOptions,
} from "@bsport/api-cdp";

import type { SmsAutomationEventValue } from "#src/pages/AutomationSmsCreationPage/types";
import { fetch } from "#src/utils/fetch";

type AutomatedCampaignSelector<Data> = (
  automatedCampaigns: AutomatedCampaign[],
) => Data;

export const selectDisabledSmsAutomationEventKinds = (
  automatedCampaigns: AutomatedCampaign[],
): ReadonlySet<SmsAutomationEventValue> => {
  return automatedCampaigns.reduce<Set<SmsAutomationEventValue>>(
    (eventKinds, campaign) => {
      if (campaign.communication_kind !== CommunicationKind.SMS) {
        return eventKinds;
      }

      if (campaign.event_kind === EventKind.JOIN) {
        eventKinds.add(`${EventKind.JOIN}`);
      }

      if (campaign.event_kind === EventKind.LEAVE) {
        eventKinds.add(`${EventKind.LEAVE}`);
      }

      return eventKinds;
    },
    new Set(),
  );
};

export const useAutomatedCampaignsSuspenseQuery = <TData = AutomatedCampaign[]>(
  smartlistId: string,
  select?: AutomatedCampaignSelector<TData>,
) => {
  return useSuspenseQuery({
    ...automatedCampaignsQueryOptions(fetch, smartlistId),
    select,
  });
};

export const useDisabledSmsAutomationEventKindsSuspenseQuery = (
  smartlistId: string,
) => {
  return useAutomatedCampaignsSuspenseQuery(
    smartlistId,
    selectDisabledSmsAutomationEventKinds,
  );
};
