import { useParams } from "react-router";

import { CampaignScheduledList } from "#src/components/CampaignScheduledList/CampaignScheduledList";
import { CampaignSentList } from "#src/components/CampaignSentList/CampaignSentList";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { invariant } from "#src/utils/invariant";

const LEGACY_POPUP_SETTINGS = "/settings/mobile-personalisation/popups";

export const CampaignPage = () => {
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");
  const { navigateToSmartlistCampaignSentDetails } = useSmartlistNavigation();
  return (
    <div>
      <div className="flex flex-col gap-md">
        <QueryBoundary>
          <CampaignScheduledList />
        </QueryBoundary>
        <QueryBoundary>
          <CampaignSentList
            smartlistId={id}
            onRowClick={({ campaign }) =>
              navigateToSmartlistCampaignSentDetails(id, campaign.uuid)
            }
            onOpenPopUpsClick={() => {
              window.location.href = LEGACY_POPUP_SETTINGS;
            }}
          />
        </QueryBoundary>
      </div>
    </div>
  );
};
