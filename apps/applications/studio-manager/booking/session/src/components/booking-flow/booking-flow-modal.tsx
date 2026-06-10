import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ModalStepper } from "@bsport/kaizen-primitive-core";

import { useRegisterBooking } from "#src/hooks/booking/actions/use-register-booking";
import { useRetrievePass } from "#src/hooks/buyables/fetch/use-retrieve-pass";
import { useQuickInvoice } from "#src/hooks/invoice/actions/use-quick-invoice";
import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import {
  resetBookingFlow,
  setSessionIds,
} from "#src/stores/booking-flow/actions";
import { getDiscountedPrice } from "#src/stores/booking-flow/get-discounted-price";
import { useBookingFlowStore } from "#src/stores/booking-flow/store";
import { getPassPrice } from "#src/utils/get-pass-price";
import { useTranslation } from "#src/utils/i18n";

import { ConfirmationStep } from "./confirmation-step";
import { MemberSelectionStep } from "./member-selection-step";
import { hasDiscountErrors } from "./new-pass-form/get-discount-errors";
import { PassSelectionStep } from "./pass-selection-step";
import { SessionSelectionStep } from "./session-selection-step";
import { SpotSelectionStep } from "./spot-selection-step";

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
  const storeSessionIds = useBookingFlowStore((state) => state.sessionIds);

  const { data: session } = useRetrieveSession(sessionId);
  const hasBlueprint = session.room_blueprint != null;

  const isNewPassRoute = paymentPackId !== null && !consumerPaymentPackId;

  const { data: selectedNewPass } = useRetrievePass(paymentPackId);

  // Multi-session booking state
  const [isBookMultiSessionsSelected, setIsBookMultiSessionsSelected] =
    useState(false);

  // Initialize sessionIds with the current session on mount
  useEffect(() => {
    if (isOpen && sessionId && storeSessionIds.length === 0) {
      setSessionIds([sessionId]);
    }
  }, [isOpen, sessionId, storeSessionIds.length]);

  const handleSelectBookMultiSessions = useCallback(
    (checked: boolean) => {
      setIsBookMultiSessionsSelected(checked);
      if (!checked) {
        setSessionIds([sessionId]);
      }
    },
    [sessionId],
  );

  const isMultiSession = storeSessionIds.length > 1;

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
            <PassSelectionStep
              sessionId={sessionId}
              isBookMultiSessionsSelected={isBookMultiSessionsSelected}
              onSelectBookMultiSessions={handleSelectBookMultiSessions}
            />
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
      ...(isBookMultiSessionsSelected
        ? [
            {
              label: t("bookingFlow.steps.sessionSelection"),
              content: <SessionSelectionStep currentSessionId={sessionId} />,
              validate: () => storeSessionIds.length >= 1,
            },
          ]
        : []),
      ...(hasBlueprint && !isMultiSession
        ? [
            {
              label: t("bookingFlow.steps.spotSelection"),
              content: <SpotSelectionStep sessionId={sessionId} />,
              validate: () => spotIndex !== null,
            },
          ]
        : []),
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
      hasBlueprint,
      spotIndex,
      isBookMultiSessionsSelected,
      handleSelectBookMultiSessions,
      storeSessionIds,
      isMultiSession,
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
        offers_data: storeSessionIds.map((offerId) => ({
          offer_id: offerId,
          extra_data: isMultiSession
            ? { auto_assign_spot: true }
            : spotIndex !== null
              ? { spot_id: spotIndex }
              : {},
        })),
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
          offer: isMultiSession ? storeSessionIds : storeSessionIds[0],
          keep_credits: keepCredits,
          notify_member: notifyMember,
          ...(isMultiSession
            ? { auto_assign_spot: true }
            : { spot_id: spotIndex }),
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
    keepCredits,
    notifyMember,
    spotIndex,
    isMultiSession,
    storeSessionIds,
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
