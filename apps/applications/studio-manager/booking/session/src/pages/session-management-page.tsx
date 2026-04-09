import { FC } from "react";
import { useParams } from "react-router";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";

const SessionManagementPageInner: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const id = Number(sessionId);

  if (!Number.isInteger(id)) {
    throw new Error("Expected session id param to be a valid number");
  }

  const { data: session } = useRetrieveSession(id);

  return (
    <DetailsLayout withPanel>
      <DetailsLayout.Header
        pageTitle={
          session.name_override ? session.name_override : session.activity_name
        }
      />
      <DetailsLayout.Content>
        {/** PLACEHOLDER SECTION */}
        <pre>{JSON.stringify(session, null, 2)}</pre>
        {/** END OF PLACEHOLDER SECTION */}
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export const SessionManagementPage: FC = () => {
  return (
    <QueryBoundary
      loadingFallback={<DetailsLoadingPage />}
      errorFallback={(props) => <DetailsFetchError {...props} />}
    >
      <SessionManagementPageInner />
    </QueryBoundary>
  );
};

export default SessionManagementPage;
