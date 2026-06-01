import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Member } from "@bsport/api-cdp/member";
import { useFormController } from "@bsport/form";
import { toast, useMatchMedia } from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { i18nInstance, i18nNamespacePrefix, useTranslation } from "#src/i18n";
import {
  CloseTrigger,
  useGuardedModalClose,
} from "#src/utils/use-guarded-modal-close";

import {
  ADD_ITEM_DEFAULT,
  DEFAULT_FORM_DATA,
  GIFTCARD_FIELDS_DEFAULT,
} from "./defaults";
import { getMember } from "./fetch-member";
import { checkoutFlowFormStateSchema } from "./schema";
import type { CheckoutFlowStepProps } from "./types";
import { useCheckoutFlowTracking } from "./use-checkout-flow-tracking";
import { useCreateInvoice } from "./use-create-invoice";
import { useInvoiceConfiguration } from "./use-invoice-configuration";

export const useCheckoutFlowStep = ({
  fetch,
  isActive,
  memberId,
  onClose,
  onError,
  onInvoiceCreated,
  onTrack,
  startContext,
  basketSessionId: externalBasketSessionId,
}: CheckoutFlowStepProps) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const formId = `checkout-flow-modal-${useId()}`;
  const isMobile = !useMatchMedia("sm");

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);
  const [isFootnoteModalOpen, setIsFootnoteModalOpen] = useState(false);
  const addItemCollapseSetOpenRef = useRef<
    ((value: boolean | ((prev: boolean) => boolean)) => void) | null
  >(null);
  const summaryCollapseSetOpenRef = useRef<
    ((value: boolean | ((prev: boolean) => boolean)) => void) | null
  >(null);
  const hasTrackedDropRef = useRef(false);
  const { isDiscountReasonRequired } = useInvoiceConfiguration(fetch);

  const methods = useFormController({
    mode: "onBlur",
    schema: checkoutFlowFormStateSchema,
    defaultValues: {
      ...DEFAULT_FORM_DATA,
      ...ADD_ITEM_DEFAULT,
      ...GIFTCARD_FIELDS_DEFAULT,
    },
  });

  const { track } = useCheckoutFlowTracking({
    isOpen: isActive,
    memberId,
    startContext,
    onTrack,
    externalBasketSessionId,
  });

  useEffect(() => {
    if (isActive) {
      hasTrackedDropRef.current = false;
    }
  }, [isActive]);

  const { formState, setValue, watch } = methods;
  const { isDirty, isSubmitting, isValid, errors } = formState;
  const items = watch("items") ?? [];

  const openSummarySection = useCallback(() => {
    addItemCollapseSetOpenRef.current?.(false);
    summaryCollapseSetOpenRef.current?.(true);
  }, []);

  const openAddItemSection = useCallback(() => {
    addItemCollapseSetOpenRef.current?.(true);
    summaryCollapseSetOpenRef.current?.(false);
  }, []);

  const hasOnlyPromoCodeError =
    !isValid && Object.keys(errors).length === 1 && "promoCodes" in errors;
  const isConfirmDisabled =
    !isDirty ||
    isSubmitting ||
    items.length === 0 ||
    (!isValid && !hasOnlyPromoCodeError);

  const handleCreateInvoiceError = useCallback(
    (error: Error) => {
      const code =
        "customErrorCodes" in error && Array.isArray(error.customErrorCodes)
          ? error.customErrorCodes[0]
          : undefined;
      const genericMessage = t("createInvoiceErrors.generic");
      const message =
        code != null
          ? i18nInstance.t(`createInvoiceErrors.${code}`, {
              ns: `${i18nNamespacePrefix}_core`,
              defaultValue: genericMessage,
            })
          : genericMessage;
      toast({
        status: "critical",
        icon: "alert-triangle",
        description: message,
      });
      onError?.(error);
    },
    [t, onError],
  );

  const { mutateAsync } = useCreateInvoice({
    fetch,
    onError: handleCreateInvoiceError,
    onSubmit: (data, invoiceUuid) => {
      const memberId = data.member?.id;
      if (memberId != null) {
        onInvoiceCreated?.(invoiceUuid, memberId, data);
      }
    },
  });

  const handleFormSubmit = async () => {
    const formData = methods.getValues();
    const formItems = formData.items ?? [];
    const rawFootnote = formData.footnote ?? "";
    const trimmedFootnote = rawFootnote.trim();
    const hasFootnote = trimmedFootnote.length > 0;

    const completionPayload = {
      basket_completion_trigger: "confirm" as const,
      member_id: formData.member?.id ?? null,
      nb_of_promo_code_applied: formData.promoCodes.length,
      total_item_quantity: formItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
      billing_group_id_selected: formData.establishmentBillingGroupId ?? null,
      service_date: formData.passActivationDate?.toISOString(),
      total_basket_price: formItems.reduce(
        (sum, item) => sum + item.priceCts * item.quantity,
        0,
      ),
      has_footnote: hasFootnote,
      footnote_length: hasFootnote ? trimmedFootnote.length : undefined,
    };

    try {
      const invoice = await mutateAsync(formData);
      track("checkout_flow_completion", {
        ...completionPayload,
        invoice_creation_success: true,
        invoice_id: invoice.uuid,
      });
      hasTrackedDropRef.current = true;
    } catch (error) {
      track("checkout_flow_completion", {
        ...completionPayload,
        invoice_creation_success: false,
        invoice_creation_error:
          error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleFetchMember = async (id: number) => {
    return getMember(fetch, { memberId: id });
  };

  const [{ isLoading: isLoadingMember, data: fetchedMember }, fetchMember] =
    useAsync<typeof handleFetchMember>({ asyncFn: handleFetchMember });

  useEffect(() => {
    if (memberId) {
      fetchMember(memberId);
    }
  }, [fetchMember, memberId]);

  useEffect(() => {
    if (fetchedMember) {
      setValue("member", fetchedMember, {
        shouldDirty: !!formState.dirtyFields.member,
        shouldValidate: true,
      });
    }
  }, [fetchedMember, formState.dirtyFields.member, setValue]);

  useEffect(() => {
    if (!isActive) {
      setIsMemberSelectorOpen(false);
      setIsFootnoteModalOpen(false);
    }
  }, [isActive]);

  const hasAutoOpenedMemberSelectorRef = useRef(false);
  useEffect(() => {
    if (!isActive) {
      hasAutoOpenedMemberSelectorRef.current = false;
      return;
    }
    if (memberId == null && !hasAutoOpenedMemberSelectorRef.current) {
      hasAutoOpenedMemberSelectorRef.current = true;
      setIsMemberSelectorOpen(true);
    }
  }, [isActive, memberId]);

  useEffect(() => {
    setValue("isDiscountReasonRequired", isDiscountReasonRequired);
  }, [isDiscountReasonRequired, setValue]);

  const trackDrop = useCallback(
    (cancelTrigger: CloseTrigger) => {
      if (!isActive) return;
      if (hasTrackedDropRef.current) return;
      hasTrackedDropRef.current = true;

      const snapshot = methods.getValues();
      const snapshotItems = snapshot.items ?? [];
      const cancelPayload = {
        member_id: snapshot.member?.id ?? null,
        total_item_quantity: snapshotItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
        nb_of_promo_code_applied: snapshot.promoCodes.length,
        billing_group_id_selected: snapshot.establishmentBillingGroupId ?? null,
        service_date: snapshot.passActivationDate?.toISOString(),
        total_basket_price: snapshotItems.reduce(
          (sum, item) => sum + item.priceCts * item.quantity,
          0,
        ),
      };
      if (cancelTrigger === "cancel_button") {
        track("checkout_flow_cancel_button_clicked", cancelPayload);
      } else if (cancelTrigger === "cross_button") {
        track("checkout_flow_cross_button_clicked", cancelPayload);
      } else if (cancelTrigger === "backdrop_click") {
        track("checkout_flow_click_outside", cancelPayload);
      } else {
        track("checkout_flow_escape_key_button_clicked", cancelPayload);
      }
      track("checkout_flow_pay_cancel", {
        ...cancelPayload,
        basket_cancel_trigger: cancelTrigger,
      });
    },
    [isActive, methods, track],
  );

  const handleInternalClose = useCallback(() => {
    methods.reset({
      ...DEFAULT_FORM_DATA,
      ...ADD_ITEM_DEFAULT,
      ...GIFTCARD_FIELDS_DEFAULT,
      isDiscountReasonRequired,
      member: fetchedMember ?? null,
    });
    setIsMemberSelectorOpen(false);
    setIsFootnoteModalOpen(false);
    onClose?.();
  }, [methods, isDiscountReasonRequired, fetchedMember, onClose]);

  const closeConfirmationMessage = t(
    "checkoutFlowModal.closeWithItemsConfirmation",
  );
  const allowGuardedClose =
    isActive && !isMemberSelectorOpen && !isFootnoteModalOpen;

  const { handleCancelClose, handleClickOutside, handleCrossClick } =
    useGuardedModalClose({
      skipEscapeListener: !allowGuardedClose,
      shouldGuard: items.length > 0,
      closeConfirmationMessage,
      close: (trigger) => {
        trackDrop(trigger);
        handleInternalClose();
      },
    });

  const handleMemberSelect = (selectedMember: Member) => {
    hasAutoOpenedMemberSelectorRef.current = false;
    setValue("member", selectedMember, {
      shouldDirty: true,
      shouldValidate: true,
    });
    fetchMember(selectedMember.id);
    setIsMemberSelectorOpen(false);
    track("checkout_flow_member_search_member_selected", {
      member_id: selectedMember.id,
    });
  };

  const handleOpenMemberSelector = () => {
    const member = methods.getValues().member;
    track("checkout_flow_member_edit_button_clicked", {
      member_id: member?.id,
    });
    setIsMemberSelectorOpen(true);
  };

  const handleMemberSelectorClose = () => {
    setIsMemberSelectorOpen(false);
    if (hasAutoOpenedMemberSelectorRef.current) {
      hasAutoOpenedMemberSelectorRef.current = false;
      handleInternalClose();
    }
  };

  const handleOpenMemberProfile = (memberId: number) => {
    window.open(`/member/${memberId}/info`, "_blank", "noopener,noreferrer");
  };

  return {
    t,
    formId,
    isMobile,
    methods,
    track,
    isLoadingMember,
    fetchedMember,
    isConfirmDisabled,
    handleFormSubmit,
    openSummarySection,
    openAddItemSection,
    isFootnoteModalOpen,
    setIsFootnoteModalOpen,
    addItemCollapseSetOpenRef,
    summaryCollapseSetOpenRef,
    isMemberSelectorOpen,
    handleMemberSelectorClose,
    handleMemberSelect,
    handleOpenMemberProfile,
    handleOpenMemberSelector,
    handleCancelClose,
    handleClickOutside,
    handleCrossClick,
  };
};
