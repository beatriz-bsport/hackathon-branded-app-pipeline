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
    navigateToSmartlistPushAutomationCreation: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationPushCreation(smartlistId),
        options,
      );
    },
    navigateToSmartlistSmsAutomationCreation: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(SMARTLIST_APP_LINKS.automationSmsCreation(smartlistId), options);
    },
    navigateToSmartlistPushAutomationEdit: (
      smartlistId: string,
      entityId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationPushEdit(smartlistId, entityId),
        options,
      );
    },
    navigateToSmartlistSmsAutomationEdit: (
      smartlistId: string,
      entityId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationSmsEdit(smartlistId, entityId),
        options,
      );
    },
    navigateToSmartlistPushAutomationMessage: (
      smartlistId: string,
      messageId: string | number,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationPushMessage(smartlistId, messageId),
        options,
      );
    },
    navigateToSmartlistSmsAutomationMessage: (
      smartlistId: string,
      messageId: string | number,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationSmsMessage(smartlistId, messageId),
        options,
      );
    },
  };
};
