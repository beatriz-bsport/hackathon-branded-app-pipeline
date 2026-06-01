import { FC, useCallback, useState } from "react";
import { Navigate, useParams } from "react-router";

import type { Session } from "@bsport/api-book";
import { ListLayout } from "@bsport/kaizen-primitive-core";
import {
  DEFAULT_PAGE,
  usePaginationQueryParams,
} from "@bsport/use-pagination-query-params";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { AllOccurrencesTable } from "#src/components/session-all-occurrences/all-occurrences-table";
import { type StatusFilter } from "#src/components/session-all-occurrences/status-filter-mapping";
import { useStatusFilterConfig } from "#src/components/session-all-occurrences/use-status-filter-config";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { SessionManagementModals } from "#src/components/session-management/session-management-modals";
import { useRetrieveRecurrenceFromSession } from "#src/hooks/session-api/fetch/use-fetch-recurrence-from-session";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";
import { useSessionHeaderBase } from "#src/hooks/use-session-header-base";
import { useSessionManagementModals } from "#src/hooks/use-session-management-modals";
import { useUrls } from "#src/urls";

const SessionAllOccurrencesPageContent: FC<{ session: Session }> = ({
  session,
}) => {
  // Hoist the teacher/activity/establishment suspense queries to page level so
  // the header's MoreActionsButton + the management modals get cache hits instead
  // of each triggering a second loading waterfall once they mount. Runs only after
  // the gate confirms a qualifying recurring session, so non-qualifying sessions
  // (which redirect) never fire these queries.
  useRetrieveSessionDetails(session);

  const { closeModal, modalState, openModal } = useSessionManagementModals();

  const headerConfig = useSessionDetailsHeaderConfig(session);
  const { pageTitle, startGroupActions, endGroupActions } =
    useSessionHeaderBase(session, { openModal });

  const { currentPageSize, setPageSettings } = usePaginationQueryParams({
    namespace: `occurrences-${session.recurrence_id}`,
  });

  const [status, setStatus] = useState<StatusFilter | null>(null);

  const handleStatusChange = useCallback(
    (next: StatusFilter | null) => {
      // Kaizen's Filter fires onFilterChange on mount with its initial (empty)
      // state, so guard against no-op calls — otherwise a cold load would reset
      // a deep-linked page back to 1.
      if (next === status) return;
      setStatus(next);
      // Filtering changes the result set, so jump back to the first page.
      setPageSettings(DEFAULT_PAGE, currentPageSize);
    },
    [status, setPageSettings, currentPageSize],
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
          <AllOccurrencesTable
            recurrenceId={session.recurrence_id}
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

const SessionAllOccurrencesPageGate: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { getBookingsManagementPath } = useUrls();
  const id = Number(sessionId);

  if (!Number.isInteger(id)) {
    throw new Error("Expected session id param to be a valid number");
  }

  const { data: session } = useRetrieveSession(id);
  const { data: recurrence } = useRetrieveRecurrenceFromSession(id);

  // Mutual exclusivity: Series is canonical for grouped (workshop) sessions;
  // All occurrences only applies to non-grouped, genuinely-recurring sessions.
  if (session.group !== null || recurrence.recurrence_count <= 1) {
    return <Navigate to={getBookingsManagementPath(id)} replace />;
  }

  return <SessionAllOccurrencesPageContent session={session} />;
};

export const SessionAllOccurrencesPage: FC = () => {
  return (
    <QueryBoundary
      loadingFallback={<DetailsLoadingPage />}
      errorFallback={(props) => <DetailsFetchError {...props} />}
    >
      <SessionAllOccurrencesPageGate />
    </QueryBoundary>
  );
};

export default SessionAllOccurrencesPage;
