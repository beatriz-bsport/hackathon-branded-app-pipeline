import { type FC, useCallback, useMemo, useRef } from "react";

import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useRegisterBooking } from "#src/hooks/booking/actions/use-register-booking";
import { useRetrievePass } from "#src/hooks/buyables/fetch/use-retrieve-pass";
import { useQuickInvoice } from "#src/hooks/invoice/actions/use-quick-invoice";
import { resetBookingFlow } from "#src/stores/booking-flow/actions";
import { getDiscountedPrice } from "#src/stores/booking-flow/get-discounted-price";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { getPassPrice } from "#src/utils/get-pass-price";
import { useTranslation } from "#src/utils/i18n";

import { ConfirmationStep } from "./confirmation-step";
import { MemberSelectionStep } from "./member-selection-step";
import { hasDiscountErrors } from "./new-pass-form/get-discount-errors";
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

  const { mutate: registerBooking, isPending: isRegistering } =
    useRegisterBooking();

  const { createQuickInvoice, isPending: isCreatingInvoice } = useQuickInvoice({
    onSuccess: () => {
      resetBookingFlow();
      onClose();
    },
  });

  const isPending = isRegistering || isCreatingInvoice;

  const consumerPaymentPackId = useBookingFlowStore(
    (state) => state.consumerPaymentPackId,
  );
  const paymentPackId = useBookingFlowStore((state) => state.paymentPackId);
  const memberId = useBookingFlowStore((state) => state.memberId);
  const keepCredits = useBookingFlowStore((state) => state.keepCredits);
  const notifyMember = useBookingFlowStore((state) => state.notifyMember);
  const spotIndex = useBookingFlowStore((state) => state.spotIndex);
  const discount = useBookingFlowStore((state) => state.discount);
  const billingGroupId = useBookingFlowStore((state) => state.billingGroupId);

  const isNewPassRoute = paymentPackId !== null && !consumerPaymentPackId;

  const { data: selectedNewPass } = useRetrievePass(paymentPackId);

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
        validate: () => {
          if (consumerPaymentPackId !== null) return true;
          if (paymentPackId === null) return false;
          const passPrice = selectedNewPass
            ? getPassPrice(selectedNewPass)
            : null;
          return !hasDiscountErrors(discount, passPrice);
        },
      },
      {
        label: t("bookingFlow.steps.confirmation"),
        content: <ConfirmationStep sessionId={sessionId} />,
      },
    ],
    [
      memberId,
      consumerPaymentPackId,
      paymentPackId,
      discount,
      selectedNewPass,
      sessionId,
      t,
    ],
  );

  const handleConfirm = useCallback(() => {
    if (currentStepRef.current < steps.length - 1) {
      currentStepRef.current += 1;
      return;
    }

    if (isNewPassRoute && paymentPackId && memberId && selectedNewPass) {
      // New pass route: create invoice first, then register booking with new CPP
      const basePrice = getPassPrice(selectedNewPass);
      const finalPrice = getDiscountedPrice(basePrice, discount);
      const discountAmount = basePrice - finalPrice;

      createQuickInvoice({
        memberId,
        paymentPackId,
        offers_data: [
          {
            offer_id: sessionId,
            extra_data: spotIndex ? { spot_id: spotIndex } : {},
          },
        ],
        ...(discount?.enabled
          ? { voucher: discountAmount, voucher_reason: discount?.reason }
          : {}),
        establishment_billing_group_id: billingGroupId,
        keep_credits: keepCredits,
        notify_member: notifyMember,
      });
      return;
    }

    // Existing pass route
    if (!consumerPaymentPackId) return;
    registerBooking(
      {
        consumerPaymentPackId,
        payload: {
          offer: sessionId,
          keep_credits: keepCredits,
          notify_member: notifyMember,
          spot_id: spotIndex,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  }, [
    steps.length,
    isNewPassRoute,
    paymentPackId,
    memberId,
    selectedNewPass,
    discount,
    billingGroupId,
    consumerPaymentPackId,
    sessionId,
    keepCredits,
    notifyMember,
    spotIndex,
    createQuickInvoice,
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
