import { NavigateOptions, useNavigate } from "react-router";

import { CampaignChannel, SMARTLIST_APP_LINKS } from "#src/urls";

export const useSmartlistNavigation = () => {
  const navigate = useNavigate();
  return {
    navigateToSmartlistDetails: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(SMARTLIST_APP_LINKS.details(smartlistId), options);
    },
    navigateToSmartlistCampaigns: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(SMARTLIST_APP_LINKS.campaign(smartlistId), options);
    },
    navigateToSmartlistParameters: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(SMARTLIST_APP_LINKS.parameter(smartlistId), options);
    },
    navigateToSmartlistAutomation: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(SMARTLIST_APP_LINKS.automation(smartlistId), options);
    },
    navigateToSmartlistCampaignCreate: (
      smartlistId: string,
      channel: CampaignChannel,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.campaignCreate(smartlistId, channel),
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
        SMARTLIST_APP_LINKS.campaignEdit(smartlistId, channel, entityId),
        options,
      );
    },
    navigateToSmartlistAutomationCreation: (
      smartlistId: string,
      channel: CampaignChannel,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationCreation(smartlistId, channel),
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
        SMARTLIST_APP_LINKS.automationEdit(smartlistId, channel, entityId),
        options,
      );
    },
  };
};
