import { type FC, useMemo } from "react";

import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { resetBookingFlow } from "#src/stores/booking-flow/actions";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { useTranslation } from "#src/utils/i18n";

import { MemberSelectionStep } from "./member-selection-step";

type BookingFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const BookingFlowModal: FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation("sessionManagement");

  const memberId = useBookingFlowStore((state) => state.memberId);

  const handleClose = () => {
    resetBookingFlow();
    onClose();
  };

  const handleClickOutside = () => {
    if (memberId !== null) return; // Prevent closing if there's unsaved progress
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
        content: null, // Implemented in https://linear.app/bsport/issue/BOO-2761/pass-selection-step
      },
      {
        label: t("bookingFlow.steps.confirmation"),
        content: null, // Implemented in https://linear.app/bsport/issue/BOO-2763/confirmation-view-and-mutation-pipeline
      },
    ],
    [memberId, t],
  );

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      size="lg"
      title={t("bookingFlow.title")}
      steps={steps}
      initialStep={0}
      confirmButton={{
        label: t("bookingFlow.buttons.confirm"),
        color: "main",
        onClick: () => {
          // Mutation wired in https://linear.app/bsport/issue/BOO-2763/confirmation-view-and-mutation-pipeline
        },
      }}
      cancelButton={{
        label: t("bookingFlow.buttons.cancel"),
      }}
      onClickOutside={handleClickOutside}
      onCloseButtonClick={handleClose}
      onClose={handleClose}
    />
  );
};
