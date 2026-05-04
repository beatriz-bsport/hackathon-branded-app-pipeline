import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { BookingDetailDrawer } from "#src/components/session-management/booking-detail-drawer/booking-detail-drawer";
import { BookingOptionDetailDrawer } from "#src/components/session-management/booking-detail-drawer/booking-option-detail-drawer.js";
import { Header } from "#src/components/session-management/header";
import { ParticipantsSection } from "#src/components/session-management/participants-section/participants-section";
import { SessionManagementModals } from "#src/components/session-management/session-management-modals";
import { FloorPlanBlock } from "#src/components/session-management/session-panel";
import { WaitlistSection } from "#src/components/session-management/waitlist-section/waitlist-section";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useSessionManagementModals } from "#src/hooks/use-session-management-modals";
import {
  setSelectedBooking,
  setSelectedBookingOption,
} from "#src/stores/session-management/actions";
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

  const selectedBookingOptionId = useSessionManagementStore(
    (state) => state.selectedBookingOptionId,
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    return () => {
      setSelectedBooking(null);
      setSelectedBookingOption(null);
    };
  }, [id]);

  const shouldDisplayWaitlistSection =
    session.full || session.booking_options.length > 0;

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

        <DetailsLayout.Content className="flex flex-col gap-xl max-w-none">
          <FloorPlanBlock
            session={{
              id: session.id,
              room_blueprint: session.room_blueprint,
            }}
          />
          <ParticipantsSection
            sessionId={session.id}
            openModal={openModal}
            searchQuery={searchQuery}
          />
          {shouldDisplayWaitlistSection && (
            <WaitlistSection sessionId={session.id} searchQuery={searchQuery} />
          )}
        </DetailsLayout.Content>
      </DetailsLayout>
      <SessionManagementModals
        closeModal={closeModal}
        modalState={modalState}
        sessionId={session.id}
      />

      <BookingDetailDrawer
        onClose={() => setSelectedBooking(null)}
        selectedBookingId={selectedBookingId}
        openModal={openModal}
      />
      <BookingOptionDetailDrawer
        onClose={() => setSelectedBookingOption(null)}
        selectedBookingOptionId={selectedBookingOptionId}
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
