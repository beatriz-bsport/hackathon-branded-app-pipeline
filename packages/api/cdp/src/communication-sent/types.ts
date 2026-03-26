export type CampaignSummary = {
  total_recipients: number;
  total_read: number;
  total_click: number;
};

export type FetchCampaignSummaryByAutomatedCampaignIdPayload = {
  key: "automated_campaign_id";
  value: number;
};
