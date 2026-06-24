import { FC } from "react";

import {
  DetailsLayout,
  ExpandableSearchInputWithTooltipProps,
} from "@bsport/kaizen-primitive-core";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useSessionDetailsHeaderConfig } from "#src/hooks/use-session-details-header-config";
import { useSessionHeaderBase } from "#src/hooks/use-session-header-base";
import type { SessionManagementModalType } from "#src/hooks/use-session-management-modals";

import { BookButton } from "./action-buttons/book-button";
import { RestoreSessionButton } from "./action-buttons/restore-session-button";
import { ListedInformationSettings } from "./filters/listed-information-settings";
import { OrderingBookings } from "./filters/ordering-bookings";

export const Header: FC<{
  sessionId: number;
  openModal: (type: SessionManagementModalType) => void;
  /** Search applies only to the bookings list (the Overview tab is the only consumer). */
  searchConfig?: ExpandableSearchInputWithTooltipProps;
}> = ({ sessionId, openModal, searchConfig }) => {
  const { data: session } = useRetrieveSession(sessionId);

  const headerConfig = useSessionDetailsHeaderConfig(session);
  const { pageTitle, startGroupActions, isMobile } = useSessionHeaderBase(
    session,
    { openModal },
  );

  return (
    <DetailsLayout.Header
      pageTitle={pageTitle}
      startGroupActions={startGroupActions}
      onDisplayPopover={() => (
        <div className="flex flex-col gap-sm max-w-[260px]">
          <OrderingBookings />
          <ListedInformationSettings />
        </div>
      )}
      callToActionButton={
        isMobile ? undefined : !session.available && !session.group ? (
          <RestoreSessionButton openModal={openModal} />
        ) : (
          <BookButton sessionId={sessionId} openModal={openModal} />
        )
      }
      searchConfig={searchConfig}
      {...headerConfig}
    />
  );
};
