import { FC } from "react";

import { CancelSessionModal } from "#src/components/SessionList/detail-actions/cancel-session-modal";
import { DeleteSessionModal } from "#src/components/SessionList/detail-actions/delete-session-modal";
import { DuplicateSessionModal } from "#src/components/SessionList/detail-actions/duplicate-session-modal";
import { RestoreSessionModal } from "#src/components/SessionList/detail-actions/restore-session-modal";
import { BookingFlowModal } from "#src/components/booking-flow/booking-flow-modal";
import { useRetrieveGroupSession } from "#src/hooks/group-session/use-retrieve-group-session";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  type SessionManagementModalState,
  SessionManagementModalType,
} from "#src/hooks/use-session-management-modals";
import { useUrls } from "#src/urls";

import { CancelBookingModal } from "./cancel-booking-modal";
import { DiscardBookingOptionModal } from "./discard-booking-option-modal";
import { PauseWaitlistModal } from "./pause-waitlist-modal";
import { ReactivateWaitlistModal } from "./reactivate-waitlist-modal";
import { SwapBookingPassModal } from "./swap-booking-pass-modal";
import { ViewWaitlistModal } from "./view-waitlist-modal";

type Props = {
  sessionId: number;
  modalState: SessionManagementModalState;
  closeModal: () => void;
};

export const SessionManagementModals: FC<Props> = ({
  sessionId,
  modalState,
  closeModal,
}) => {
  const { navigateToIndex } = useUrls();
  const { data: sessionData } = useRetrieveSession(sessionId);

  const { data: groupSession } = useRetrieveGroupSession(sessionData.group);

  const session = {
    ...sessionData,
    groupName: groupSession?.name,
    name: sessionData.name_override || sessionData.activity_name,
    nb_bookings: sessionData.bookings.length,
  };

  return (
    <>
      {modalState?.type === SessionManagementModalType.BOOK && (
        <BookingFlowModal
          sessionId={sessionId}
          isOpen
          onClose={closeModal}
          bookingOptionId={modalState.bookingOptionId}
          initialMemberId={modalState.memberId}
        />
      )}
      {modalState?.type === SessionManagementModalType.ADD_TO_WAITLIST && (
        <BookingFlowModal
          sessionId={sessionId}
          isOpen
          onClose={closeModal}
          isAddToWaitlist
        />
      )}
      {modalState?.type === SessionManagementModalType.CANCEL && (
        <CancelSessionModal session={session} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.RESTORE && (
        <RestoreSessionModal session={session} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.DUPLICATE && (
        <DuplicateSessionModal session={session} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.DELETE && (
        <DeleteSessionModal
          session={session}
          isOpen
          onClose={() => {
            closeModal();
            navigateToIndex();
          }}
        />
      )}
      {modalState?.bookingId != null &&
        modalState?.type === SessionManagementModalType.CANCEL_BOOKING && (
          <CancelBookingModal
            bookingId={modalState.bookingId}
            sessionId={sessionId}
            isOpen
            onClose={closeModal}
          />
        )}
      {modalState?.bookingId != null &&
        modalState?.memberId != null &&
        modalState?.type === SessionManagementModalType.SWAP_PASS && (
          <SwapBookingPassModal
            bookingId={modalState.bookingId}
            sessionId={sessionId}
            memberId={modalState.memberId}
            currentConsumerPaymentPackId={
              modalState.consumerPaymentPackId ?? null
            }
            isOpen
            onClose={closeModal}
          />
        )}
      {modalState?.type === SessionManagementModalType.PAUSE_WAITLIST && (
        <PauseWaitlistModal sessionId={sessionId} isOpen onClose={closeModal} />
      )}
      {modalState?.type === SessionManagementModalType.REACTIVATE_WAITLIST && (
        <ReactivateWaitlistModal
          sessionId={sessionId}
          isOpen
          onClose={closeModal}
        />
      )}
      {modalState?.type === SessionManagementModalType.VIEW_WAITLIST && (
        <ViewWaitlistModal sessionId={sessionId} isOpen onClose={closeModal} />
      )}
      {modalState?.bookingOptionId != null &&
        modalState?.type ===
          SessionManagementModalType.DISCARD_BOOKING_OPTION && (
          <DiscardBookingOptionModal
            bookingOptionId={modalState.bookingOptionId}
            isOpen
            onClose={closeModal}
          />
        )}
    </>
  );
};
