import { NavigateOptions, useNavigate } from "react-router";

import { CampaignChannel, SMARTLIST_COMMUNICATION_URLS, URLS } from "#src/urls";

export const useSmartlistNavigation = () => {
  const navigate = useNavigate();
  return {
    navigateToSmartlistDetails: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(URLS.detailsPath(smartlistId), options);
    },
    navigateToSmartlistCampaigns: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(URLS.campaignPath(smartlistId), options);
    },
    navigateToSmartlistParameters: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(URLS.parameterPath(smartlistId), options);
    },
    navigateToSmartlistAutomation: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(URLS.automationPath(smartlistId), options);
    },
    navigateToSmartlistCampaignCreate: (
      smartlistId: string,
      channel: CampaignChannel,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_COMMUNICATION_URLS.campaignCreatePath(smartlistId, channel),
        options,
      );
    },
    navigateToSmartlistCampaignEdit: (
      smartlistId: string,
      channel: CampaignChannel,
      entityId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_COMMUNICATION_URLS.campaignEditPath(
          smartlistId,
          channel,
          entityId,
        ),
        options,
      );
    },
    navigateToSmartlistAutomationCreation: (
      smartlistId: string,
      channel: CampaignChannel,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_COMMUNICATION_URLS.automationCreationPath(
          smartlistId,
          channel,
        ),
        options,
      );
    },
    navigateToSmartlistAutomationEdit: (
      smartlistId: string,
      channel: CampaignChannel,
      entityId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_COMMUNICATION_URLS.automationEditPath(
          smartlistId,
          channel,
          entityId,
        ),
        options,
      );
    },
  };
};
