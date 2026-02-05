import { Link, useParams } from "react-router";

import { CampaignScheduledList } from "#src/components/CampaignScheduledList/CampaignScheduledList";
import { CampaignSentList } from "#src/components/CampaignSentList/CampaignSentList";
import { QueryBoundary } from "#src/components/QueryBoundary";
import { invariant } from "#src/utils/invariant";

export const CampaignPage = () => {
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");
  return (
    <div>
      <QueryBoundary>
        <div>
          <Link to={`/${id}/popups/new`}>Create pop-up</Link>
        </div>
        <div>
          <Link to={`/${id}/popups/123/edit`}>Edit pop-up</Link>
        </div>
      </QueryBoundary>
      <div className="flex flex-col gap-md">
        <QueryBoundary>
          <CampaignScheduledList />
        </QueryBoundary>
        <QueryBoundary>
          <CampaignSentList />
        </QueryBoundary>
      </div>
    </div>
  );
};
