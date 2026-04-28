import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { BookingDetailDrawer } from "#src/components/session-management/booking-detail-drawer/booking-detail-drawer";
import { Header } from "#src/components/session-management/header";
import { ParticipantsSection } from "#src/components/session-management/participants-section/participants-section";
import { SessionManagementModals } from "#src/components/session-management/session-management-modals";
import { useRetrieveRefinedBooking } from "#src/hooks/booking/fetch/use-retrieve-refined-booking";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useSessionManagementModals } from "#src/hooks/use-session-management-modals";
import { setSelectedBooking } from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";

const SessionManagementPageInner: FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const id = Number(sessionId);

  if (!Number.isInteger(id)) {
    throw new Error("Expected session id param to be a valid number");
  }

  const { data: session } = useRetrieveSession(id);

  useRetrieveSessionDetails(session);

  const { closeModal, modalState, openModal } = useSessionManagementModals();

  const selectedBookingId = useSessionManagementStore(
    (state) => state.selectedBookingId,
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    return () => setSelectedBooking(null);
  }, [id]);

  const {
    refinedBooking: selectedBooking,
    isLoading,
    error,
  } = useRetrieveRefinedBooking(selectedBookingId);

  return (
    <>
      <DetailsLayout withPanel>
        <Header
          sessionId={session.id}
          openModal={openModal}
          searchConfig={{
            id: "session-management-search",
            inputValue: searchQuery,
            onInputValueChange: (value: string) => {
              setSearchQuery(value);
            },
            debounceValue: DEFAULT_DEBOUNCE_DELAY,
            onClear: () => {
              setSearchQuery("");
            },
          }}
        />

        <DetailsLayout.Content className="max-w-none">
          <ParticipantsSection
            sessionId={session.id}
            openModal={openModal}
            searchQuery={searchQuery}
          />
        </DetailsLayout.Content>
      </DetailsLayout>
      <SessionManagementModals
        closeModal={closeModal}
        modalState={modalState}
        sessionId={session.id}
      />

      <BookingDetailDrawer
        onClose={() => setSelectedBooking(null)}
        isOpen={
          !!selectedBookingId && !isLoading && !error && !!selectedBooking
        }
        selectedBooking={selectedBooking}
        openModal={openModal}
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
