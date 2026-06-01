import { FC, useCallback, useState } from "react";
import { Navigate, useParams } from "react-router";

import type { Session } from "@bsport/api-book";
import { ListLayout } from "@bsport/kaizen-primitive-core";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { SessionManagementModals } from "#src/components/session-management/session-management-modals";
import { SeriesTable } from "#src/components/session-series/series-table";
import { type StatusFilter } from "#src/components/session-series/status-filter-mapping";
import { useStatusFilterConfig } from "#src/components/session-series/use-status-filter-config";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";
import { useSessionHeaderBase } from "#src/hooks/use-session-header-base";
import { useSessionManagementModals } from "#src/hooks/use-session-management-modals";
import { useUrls } from "#src/urls";

// Inner component receives a session with a non-null group, narrowed by the gate.
// This split keeps all hooks at the top — the gate either renders the inner
// component or redirects
type SessionWithGroup = Session & { group: number };

const SessionSeriesPageContent: FC<{ session: SessionWithGroup }> = ({
  session,
}) => {
  // Fetch teacher/activity/establishment details only AFTER the gate confirms
  // this is a group session — for non-group sessions that redirect, we don't
  // want to fire 3 unnecessary suspense queries.
  useRetrieveSessionDetails(session);

  const { closeModal, modalState, openModal } = useSessionManagementModals();

  const headerConfig = useSessionDetailsHeaderConfig(session);
  const { pageTitle, startGroupActions, endGroupActions } =
    useSessionHeaderBase(session, { openModal });

  const { currentPageSize, setPageSettings } = usePaginationQueryParams({
    namespace: `series-${session.group}`,
  });

  const [status, setStatus] = useState<StatusFilter | null>(null);

  const handleStatusChange = useCallback(
    (next: StatusFilter | null) => {
      setStatus(next);
      // Filtering changes the result set, so jump back to the first page.
      setPageSettings(1, currentPageSize);
    },
    [setPageSettings, currentPageSize],
  );

  const filterConfig = useStatusFilterConfig(status, handleStatusChange);

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={pageTitle}
          startGroupActions={startGroupActions}
          endGroupActions={endGroupActions}
          filterConfig={filterConfig}
          {...headerConfig}
        />
        <ListLayout.Content>
          <SeriesTable
            groupId={session.group}
            companyId={session.company}
            status={status}
          />
        </ListLayout.Content>
      </ListLayout>
      <SessionManagementModals
        closeModal={closeModal}
        modalState={modalState}
        sessionId={session.id}
      />
    </>
  );
};

const SessionSeriesPageGate: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { getBookingsManagementPath } = useUrls();
  const id = Number(sessionId);

  if (!Number.isInteger(id)) {
    throw new Error("Expected session id param to be a valid number");
  }

  const { data: session } = useRetrieveSession(id);

  if (session.group === null) {
    return <Navigate to={getBookingsManagementPath(id)} replace />;
  }

  return <SessionSeriesPageContent session={session as SessionWithGroup} />;
};

export const SessionSeriesPage: FC = () => {
  return (
    <QueryBoundary
      loadingFallback={<DetailsLoadingPage />}
      errorFallback={(props) => <DetailsFetchError {...props} />}
    >
      <SessionSeriesPageGate />
    </QueryBoundary>
  );
};

export default SessionSeriesPage;
