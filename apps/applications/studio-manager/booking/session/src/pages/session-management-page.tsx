import { FC } from "react";
import { useParams } from "react-router";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { BookingsTable } from "#src/components/session-management/bookings-tables/bookings-table.js";
import { Header } from "#src/components/session-management/header";
import { SessionManagementModals } from "#src/components/session-management/session-management-modals.js";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useSessionManagementModals } from "#src/hooks/use-session-management-modals.js";

const SessionManagementPageInner: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const id = Number(sessionId);

  if (!Number.isInteger(id)) {
    throw new Error("Expected session id param to be a valid number");
  }

  const { data: session } = useRetrieveSession(id);

  useRetrieveSessionDetails(session);

  const { closeModal, modalState, openModal } = useSessionManagementModals();

  return (
    <>
      <DetailsLayout withPanel>
        <Header sessionId={session.id} openModal={openModal} />

        <DetailsLayout.Content>
          <BookingsTable sessionId={session.id} />
        </DetailsLayout.Content>
      </DetailsLayout>
      <SessionManagementModals
        closeModal={closeModal}
        modalState={modalState}
        sessionId={session.id}
      />
    </>
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
