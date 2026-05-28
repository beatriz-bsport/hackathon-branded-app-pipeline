import { FC, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";

import { DetailsLayout } from "@bsport/kaizen-primitive-core";
import { DEFAULT_DEBOUNCE_DELAY } from "@bsport/use-debounce";
import { usePaginationQueryParams } from "@bsport/use-pagination-query-params";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { DetailsFetchError } from "#src/components/session-details/details-fetch-error";
import { DetailsLoadingPage } from "#src/components/session-details/details-loading-page";
import { BookingDetailDrawer } from "#src/components/session-management/booking-detail-drawer/booking-detail-drawer";
import { BookingOptionDetailDrawer } from "#src/components/session-management/booking-detail-drawer/booking-option-detail-drawer.js";
import { FloorPlanBlock } from "#src/components/session-management/floor-plan-block";
import { Header } from "#src/components/session-management/header";
import { LivestreamSection } from "#src/components/session-management/livestream-section/livestream-section";
import { SESSION_TAB_PARAM } from "#src/components/session-management/page-tabs";
import { SeriesTab } from "#src/components/session-management/page-tabs/series";
import type { StatusFilter } from "#src/components/session-management/page-tabs/series/status-filter-mapping";
import { useStatusFilterConfig } from "#src/components/session-management/page-tabs/series/use-status-filter-config";
import { ParticipantsSection } from "#src/components/session-management/participants-section/participants-section";
import { SessionManagementModals } from "#src/components/session-management/session-management-modals";
import { WaitlistSection } from "#src/components/session-management/waitlist-section/waitlist-section";
import { SessionPanel } from "#src/components/session-panel";
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

  const [searchParams] = useSearchParams();
  const isSeries =
    searchParams.get(SESSION_TAB_PARAM) === "series" && session.group !== null;

  // List-style tabs (Series — and later All occurrences) render a full-width,
  // flush table with no side panel; the default detail view keeps its panel.
  const isListTab = isSeries;

  const { currentPageSize: seriesPageSize, setPageSettings: setSeriesPage } =
    usePaginationQueryParams({ namespace: `series-${session.group}` });

  const [seriesStatus, setSeriesStatus] = useState<StatusFilter | null>(null);
  const handleSeriesStatusChange = useCallback(
    (next: StatusFilter | null) => {
      setSeriesStatus(next);
      // Filtering changes the result set, so jump back to the first page.
      setSeriesPage(1, seriesPageSize);
    },
    [setSeriesPage, seriesPageSize],
  );
  const seriesFilterConfig = useStatusFilterConfig(
    seriesStatus,
    handleSeriesStatusChange,
  );

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
      {/* Remount when switching panel modes so DetailsLayout re-reads `withPanel`
          — it only initialises `isPanelOpened` once, else it keeps the hidden
          panel column reserved and the table renders narrow. */}
      <DetailsLayout key={isListTab ? "list" : "detail"} withPanel={!isListTab}>
        <Header
          sessionId={session.id}
          openModal={openModal}
          filterConfig={isSeries ? seriesFilterConfig : undefined}
          isListTab={isListTab}
          searchConfig={
            isListTab
              ? undefined
              : {
                  id: "session-management-search",
                  inputValue: searchQuery,
                  onInputValueChange: (value: string) => {
                    setSearchQuery(value);
                  },
                  debounceValue: DEFAULT_DEBOUNCE_DELAY,
                  onClear: () => {
                    setSearchQuery("");
                  },
                }
          }
        />

        <DetailsLayout.Content
          className="flex flex-col gap-xl max-w-none"
          // Strip Content's `p-md` so the list tab's table sits flush.
          style={isListTab ? { padding: 0 } : undefined}
        >
          {isSeries ? (
            <SeriesTab
              groupId={session.group!}
              companyId={session.company}
              status={seriesStatus}
            />
          ) : (
            <>
              <LivestreamSection sessionId={session.id} />
              <FloorPlanBlock
                session={{
                  id: session.id,
                  room_blueprint: session.room_blueprint,
                  coach: session.coach,
                  coach_override: session.coach_override,
                }}
              />
              <ParticipantsSection
                sessionId={session.id}
                openModal={openModal}
                searchQuery={searchQuery}
              />
              {shouldDisplayWaitlistSection && (
                <WaitlistSection
                  sessionId={session.id}
                  searchQuery={searchQuery}
                  openModal={openModal}
                />
              )}
            </>
          )}
        </DetailsLayout.Content>

        {!isListTab && (
          <DetailsLayout.Panel>
            <SessionPanel sessionId={session.id} />
          </DetailsLayout.Panel>
        )}
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
