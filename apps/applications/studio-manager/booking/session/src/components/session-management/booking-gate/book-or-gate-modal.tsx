import { FC, useState } from "react";

import { BookingFlowModal } from "#src/components/booking-flow/booking-flow-modal";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";

import { BookingGateModal } from "./booking-gate-modal";
import { getBookingGateType } from "./get-booking-gate-type";

type Props = {
  sessionId: number;
  onClose: () => void;
  bookingOptionId?: number | null;
  initialMemberId?: number | null;
};

export const BookOrGateModal: FC<Props> = ({
  sessionId,
  onClose,
  bookingOptionId,
  initialMemberId,
}) => {
  const [gateConfirmed, setGateConfirmed] = useState(false);
  const { data: session } = useRetrieveSession(sessionId);

  const gateType = gateConfirmed ? null : getBookingGateType(session);

  if (gateType) {
    return (
      <BookingGateModal
        gateType={gateType}
        session={session}
        onConfirm={() => setGateConfirmed(true)}
        onClose={onClose}
      />
    );
  }

  return (
    <BookingFlowModal
      sessionId={sessionId}
      isOpen
      onClose={onClose}
      bookingOptionId={bookingOptionId}
      initialMemberId={initialMemberId}
    />
  );
};
