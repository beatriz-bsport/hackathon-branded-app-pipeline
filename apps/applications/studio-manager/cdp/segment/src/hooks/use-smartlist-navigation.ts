import { NavigateOptions, useNavigate } from "react-router";

import {
  CAMPAIGN_CHANNEL_POPUP,
  CampaignChannel,
  SMARTLIST_APP_LINKS,
} from "#src/urls";

export const useSmartlistNavigation = () => {
  const navigate = useNavigate();
  return {
    navigateToSmartlistList: (options?: NavigateOptions) => {
      navigate(SMARTLIST_APP_LINKS.index(), options);
    },
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
    navigateToPrebuiltSegmentCampaigns: (
      prebuiltSegmentId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.prebuiltDetailsCampaigns(prebuiltSegmentId),
        options,
      );
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
    navigateToSmartlistEmailAutomationCreation: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationEmailCreation(smartlistId),
        options,
      );
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
    navigateToPrebuiltCampaignCreate: (
      prebuiltSegmentId: string,
      channel: Exclude<CampaignChannel, typeof CAMPAIGN_CHANNEL_POPUP>,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.prebuiltCampaignCreate(prebuiltSegmentId, channel),
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
    navigateToSmartlistCampaignSentDetails: (
      smartlistId: string,
      campaignUuid: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.campaignSentDetails(smartlistId, campaignUuid),
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
    navigateToSmartlistTagRuleAutomationCreation: (
      smartlistId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationTagRuleCreation(smartlistId),
        options,
      );
    },
    navigateToSmartlistTagRuleAutomationEdit: (
      smartlistId: string,
      tagRuleId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationTagRuleEdit(smartlistId, tagRuleId),
        options,
      );
    },
    navigateToSmartlistEmailAutomationEdit: (
      smartlistId: string,
      entityId: string,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationEmailEdit(smartlistId, entityId),
        options,
      );
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
    navigateToSmartlistEmailAutomationMessage: (
      smartlistId: string,
      messageId: string | number,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.automationEmailMessage(smartlistId, messageId),
        options,
      );
    },
    navigateToSmartlistCampaignScheduledDetails: (
      smartlistId: string,
      campaignId: number,
      options?: NavigateOptions,
    ) => {
      navigate(
        SMARTLIST_APP_LINKS.campaignScheduledDetails(smartlistId, campaignId),
        options,
      );
    },
  };
};
