import { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { WaitlistFilter } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

import { BookingOptionStatusSegmentedControl } from "../filters/booking-option-status-segmented-control";
import { CancelledWaitlist } from "./cancelled-waitlist";
import { PausedWaitlistState } from "./paused-waitlist-state";
import { WaitList } from "./waitlist";
import { WaitlistActionsButton } from "./waitlist-actions-button";
import { WaitlistCounter } from "./waitlist-counter";
import { WaitlistSettingsPopover } from "./waitlist-settings-popover";

export const WaitlistSection: FC<{
  sessionId: number;
  searchQuery: string;
  openModal: (type: SessionManagementModalType) => void;
}> = ({ sessionId, searchQuery, openModal }) => {
  const { t } = useTranslation("sessionManagement");

  const { data: session } = useRetrieveSession(sessionId);

  const waitlistFilters = useSessionManagementStore(
    (state) => state.waitlistFilters,
  );

  const isWaitlistPaused = session.waiting_list_disabled;

  return (
    <div className="flex flex-col gap-lg">
      <QueryBoundary
        errorFallback={(props) => (
          <div className="flex flex-col gap-lg">
            <Title weight="strong" htmlVariant="h3">
              {t("waitlistSectionTitle")}
            </Title>
            <SectionErrorFallback {...props} />
          </div>
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-sm">
            <Title weight="strong" htmlVariant="h3">
              {t("waitlistSectionTitle")}
            </Title>
            <WaitlistSettingsPopover />
            {!isWaitlistPaused && (
              <WaitlistCounter
                sessionId={sessionId}
                waitlistCapacity={session.waiting_list_max_size}
              />
            )}
          </div>
          {!isWaitlistPaused && (
            <WaitlistActionsButton
              sessionId={sessionId}
              openModal={openModal}
            />
          )}
        </div>
        {isWaitlistPaused ? (
          <PausedWaitlistState openModal={openModal} />
        ) : (
          <>
            <BookingOptionStatusSegmentedControl />
            {waitlistFilters === WaitlistFilter.CANCELLED ? (
              <CancelledWaitlist
                sessionId={sessionId}
                searchQuery={searchQuery}
              />
            ) : (
              <WaitList
                sessionId={sessionId}
                searchQuery={searchQuery}
                paginationNamespace={waitlistFilters}
              />
            )}
          </>
        )}
      </QueryBoundary>
    </div>
  );
};
