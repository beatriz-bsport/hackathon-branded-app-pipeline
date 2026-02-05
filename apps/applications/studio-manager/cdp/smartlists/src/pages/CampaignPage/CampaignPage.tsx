import { QueryBoundary } from "#src/components/QueryBoundary";
import { CampaignScheduledList } from "#src/components/ScheduledCommunicationList/CampaignScheduledList";

export const CampaignPage = () => {
  return (
    <QueryBoundary>
      <CampaignScheduledList />
    </QueryBoundary>
  );
};
