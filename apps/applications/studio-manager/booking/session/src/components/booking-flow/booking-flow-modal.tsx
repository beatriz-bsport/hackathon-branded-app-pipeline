import { type FC, useCallback, useMemo, useRef } from "react";

import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useRegisterBooking } from "#src/hooks/booking/actions/use-register-booking";
import { resetBookingFlow } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

import { ConfirmationStep } from "./confirmation-step";
import { MemberSelectionStep } from "./member-selection-step";
import { PassSelectionStep } from "./pass-selection-step";

type BookingFlowModalProps = {
  isOpen: boolean;
  sessionId: number;
  onClose: () => void;
};

export const BookingFlowModal: FC<BookingFlowModalProps> = ({
  isOpen,
  sessionId,
  onClose,
}) => {
  const { t } = useTranslation("sessionManagement");

  const currentStepRef = useRef(0);

  const { mutate: registerBooking, isPending } = useRegisterBooking();

  const consumerPaymentPackId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  const memberId = useBookingFlowStore((state) => state.memberId);
  const keepCredits = useBookingFlowStore((state) => state.keepCredits);
  const notifyMember = useBookingFlowStore((state) => state.notifyMember);
  const spotIndex = useBookingFlowStore((state) => state.spotIndex);

  const handleClose = useCallback(() => {
    if (isPending) return; // Prevent closing if there's an ongoing booking registration
    currentStepRef.current = 0;
    resetBookingFlow();
    onClose();
  }, [onClose, isPending]);

  const handleClickOutside = () => {
    if (memberId !== null || isPending) return; // Prevent closing if there's unsaved progress or an ongoing booking registration
    handleClose();
  };

  const steps = useMemo(
    () => [
      {
        label: t("bookingFlow.steps.memberSelection"),
        content: <MemberSelectionStep />,
        validate: () => memberId !== null,
      },
      {
        label: t("bookingFlow.steps.passSelection"),
        content:
          memberId !== null ? (
            <PassSelectionStep sessionId={sessionId} />
          ) : null,
        validate: () => consumerPaymentPackId !== null,
      },
      {
        label: t("bookingFlow.steps.confirmation"),
        content: <ConfirmationStep sessionId={sessionId} />,
      },
    ],
    [memberId, consumerPaymentPackId, sessionId, t],
  );

  const handleConfirm = useCallback(() => {
    if (currentStepRef.current < steps.length - 1) {
      currentStepRef.current += 1;
      return;
    }
    if (!consumerPaymentPackId) return;
    const payload = {
      consumerPaymentPackId,
      payload: {
        offer: sessionId,
        keep_credits: keepCredits,
        notify_member: notifyMember,
        spot_id: spotIndex,
      },
    };
    registerBooking(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  }, [
    steps.length,
    consumerPaymentPackId,
    sessionId,
    keepCredits,
    notifyMember,
    spotIndex,
    registerBooking,
    handleClose,
  ]);

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      size="lg"
      title={t("bookingFlow.title")}
      steps={steps}
      confirmButton={{
        label: t("bookingFlow.buttons.confirm"),
        color: "main",
        onClick: handleConfirm,
        disabled: isPending,
      }}
      cancelButton={{
        label: t("bookingFlow.buttons.cancel"),
        onClick: () => {
          currentStepRef.current = Math.max(0, currentStepRef.current - 1);
        },

        disabled: isPending,
      }}
      onClickOutside={handleClickOutside}
      onCloseButtonClick={handleClose}
      onClose={handleClose}
    />
  );
};
