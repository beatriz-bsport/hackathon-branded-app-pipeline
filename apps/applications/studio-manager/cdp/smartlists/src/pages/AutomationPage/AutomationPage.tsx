import { useOutletContext } from "react-router";

import type { Smartlist } from "#src/api/types";
import { useAutomatedCampaigns } from "#src/api/use-automated-campaigns";

type AutomationPageContext = {
  smartlistId: string;
  smartlist: Smartlist | undefined;
};

export const AutomationPage = () => {
  const { smartlistId } = useOutletContext<AutomationPageContext>();

  const {
    data: automatedCampaigns,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
  } = useAutomatedCampaigns(smartlistId);

  console.log("Automated Campaigns:", {
    data: automatedCampaigns,
    isLoading: isLoadingCampaigns,
    error: campaignsError,
  });

  return <div>Automations content coming soon</div>;
};
