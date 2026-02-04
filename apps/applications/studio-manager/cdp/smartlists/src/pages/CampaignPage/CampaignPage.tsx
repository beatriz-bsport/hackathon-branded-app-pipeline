import { Link, useParams } from "react-router";

import { QueryBoundary } from "#src/components/QueryBoundary";
import { CampaignScheduledList } from "#src/components/ScheduledCommunicationList/CampaignScheduledList";
import { invariant } from "#src/utils/invariant";

export const CampaignPage = () => {
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");
  return (
    <QueryBoundary>
      <div>
        <Link to={`/${id}/popups/new`}>Create pop-up</Link>
      </div>
      <div>
        <Link to={`/${id}/popups/123/edit`}>Edit pop-up</Link>
      </div>
      <CampaignScheduledList />
    </QueryBoundary>
  );
};
