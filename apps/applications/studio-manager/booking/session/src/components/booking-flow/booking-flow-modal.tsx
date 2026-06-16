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
import { useDiscardBookingOption } from "#src/hooks/waitlist/use-discard-booking-option.js";
import { useRegisterToWaitlist } from "#src/hooks/waitlist/use-register-to-waitlist";
import {
  resetBookingFlow,
  setMember,
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
  bookingOptionId?: number | null; // Used for convert-booking-option variant to specify which booking option is being converted
  initialMemberId?: number | null; // Used for convert-booking-option variant to pre-fill the member selection step with the member who has the booking option
  isAddToWaitlist?: boolean; // Whether this modal is being used to add to waitlist, which has a different flow (no pass selection, no spot selection, etc.)
};

export const BookingFlowModal: FC<BookingFlowModalProps> = ({
  isOpen,
  sessionId,
  onClose,
  bookingOptionId,
  initialMemberId,
  isAddToWaitlist = false,
}) => {
  const { t } = useTranslation("sessionManagement");

  const currentStepRef = useRef(0);

  const { mutate: registerBooking, isPending: isRegistering } =
    useRegisterBooking();

  const { mutate: registerToWaitlist, isPending: isRegisteringToWaitlist } =
    useRegisterToWaitlist();

  const { createQuickInvoice, isPending: isCreatingInvoice } =
    useQuickInvoice();

  const {
    mutate: discardBookingOption,
    isPending: isDiscardBookingOptionPending,
  } = useDiscardBookingOption();

  const isPending =
    isRegistering ||
    isCreatingInvoice ||
    isRegisteringToWaitlist ||
    isDiscardBookingOptionPending;

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
  const isSeries = session.group !== null;

  const isNewPassRoute = paymentPackId !== null && !consumerPaymentPackId;

  const { data: selectedNewPass } = useRetrievePass(paymentPackId);

  const isConvertBookingOption =
    bookingOptionId != null && initialMemberId != null;

  // Multi-session booking state
  const [isBookMultiSessionsSelected, setIsBookMultiSessionsSelected] =
    useState(false);

  // Pre-fill member for convert-booking-option variant
  useEffect(() => {
    if (isOpen && isConvertBookingOption) {
      setMember(initialMemberId);
    }
  }, [isOpen, isConvertBookingOption, initialMemberId]);

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

  const showSessionSelectionStep =
    !isConvertBookingOption &&
    !isAddToWaitlist &&
    (isBookMultiSessionsSelected || isSeries);

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

  const steps = useMemo(() => {
    if (isAddToWaitlist) {
      return [
        {
          label: t("bookingFlow.steps.memberSelection"),
          content: <MemberSelectionStep />,
          validate: () => memberId !== null,
        },
      ];
    }

    return [
      ...(!isConvertBookingOption
        ? [
            {
              label: t("bookingFlow.steps.memberSelection"),
              content: <MemberSelectionStep />,
              validate: () => memberId !== null,
            },
          ]
        : []),
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
      ...(showSessionSelectionStep
        ? [
            {
              label: t("bookingFlow.steps.sessionSelection"),
              content: (
                <SessionSelectionStep
                  currentSessionId={sessionId}
                  groupId={session.group}
                />
              ),
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
    ];
  }, [
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
    showSessionSelectionStep,
    session.group,
    isAddToWaitlist,
    isConvertBookingOption,
    t,
  ]);

  const handleConfirm = useCallback(() => {
    if (currentStepRef.current < steps.length - 1) {
      currentStepRef.current += 1;
      return;
    }

    // Add to waitlist: just call the waitlist API and close
    if (isAddToWaitlist) {
      if (!memberId) return;
      registerToWaitlist(
        { offer: sessionId, member: memberId },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
      return;
    }

    if (isNewPassRoute && paymentPackId && memberId && selectedNewPass) {
      // New pass route: create invoice first, then register booking with new CPP
      const basePrice = getPassPrice(selectedNewPass);
      const finalPrice = getDiscountedPrice(basePrice, discount);
      const discountAmount = basePrice - finalPrice;

      createQuickInvoice(
        {
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
        },
        {
          onSuccess: () => {
            if (isConvertBookingOption && bookingOptionId != null) {
              // If we're converting a booking option, we need to remove the booking option from the waitlist
              discardBookingOption({
                bookingOptionId,
                params: {},
              });
            }
            resetBookingFlow();
            onClose();
          },
        },
      );
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
          ...(isConvertBookingOption && bookingOptionId != null
            ? { booking_option: bookingOptionId }
            : {}),
        },
      },
      {
        onSuccess: () => {
          if (isConvertBookingOption && bookingOptionId != null) {
            // If we're converting a booking option, we need to remove the booking option from the waitlist
            discardBookingOption({
              bookingOptionId,
              params: {},
            });
          }
          handleClose();
        },
      },
    );
  }, [
    steps.length,
    isAddToWaitlist,
    isConvertBookingOption,
    isNewPassRoute,
    paymentPackId,
    memberId,
    onClose,
    selectedNewPass,
    discount,
    billingGroupId,
    consumerPaymentPackId,
    keepCredits,
    notifyMember,
    spotIndex,
    isMultiSession,
    storeSessionIds,
    sessionId,
    bookingOptionId,
    createQuickInvoice,
    registerBooking,
    registerToWaitlist,
    handleClose,
    discardBookingOption,
  ]);

  const modalTitle = isAddToWaitlist
    ? t("bookingFlow.addToWaitlist.title")
    : isConvertBookingOption
      ? t("bookingFlow.conversion.fromWaitlist")
      : t("bookingFlow.title");

  return (
    <ModalStepper
      key={String(isOpen)}
      open={isOpen}
      size="lg"
      title={modalTitle}
      steps={steps}
      confirmButton={{
        label: isAddToWaitlist
          ? t("bookingFlow.addToWaitlist.title")
          : t("bookingFlow.buttons.confirm"),
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
