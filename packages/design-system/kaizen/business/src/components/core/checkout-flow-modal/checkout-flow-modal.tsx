import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Member } from "@bsport/api-cdp";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  Accordion,
  Modal,
  Title,
  toast,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { MemberSelectorModal } from "#src/components/cdp/member/member-selector-modal";
import { MemberAndBillingGroupCard } from "#src/components/core/checkout-flow-modal/member-and-billing-group-card";
import { i18nInstance, i18nNamespacePrefix, useTranslation } from "#src/i18n";

import { AddItemSection } from "./add-item-section";
import { CheckoutFlowTrackingProvider } from "./checkout-flow-tracking-context";
import {
  ADD_ITEM_DEFAULT,
  DEFAULT_FORM_DATA,
  GIFTCARD_FIELDS_DEFAULT,
} from "./defaults";
import { getMember } from "./fetch-member";
import { checkoutFlowFormStateSchema } from "./schema";
import {
  SummaryFootnoteButton,
  SummarySection,
  SummaryTitle,
} from "./summary-section";
import type { CheckoutFlowModalProps } from "./types";
import { useCheckoutFlowTracking } from "./use-checkout-flow-tracking";
import { useCreateInvoice } from "./use-create-invoice";
import { useInvoiceConfiguration } from "./use-invoice-configuration";

/**
 * Modal to build an invoice (add items, member, promo codes) and create it via API.
 *
 * @param companyId - Company for config and invoice creation
 * @param fetch - Instance of the @bsport/fetch library
 * @param isOpen - When false, modal is not rendered
 * @param memberId - Optional pre-selected member; omit when user picks (e.g. "Sell products")
 * @param onClose - Called when user closes the modal
 * @param onError - Use for side-effects only (logging, analytics). Component already shows an error toast.
 * @param onSubmit - Called on success with form data and invoice UUID
 * @param onTrack - Track function to emit checkout flow events
 * @param startContext - Optional context for how the flow was opened (navbar, member profile, offer page)
 * @param basketSessionId - Optional pre-generated basket session ID; one is generated when the modal opens if not provided
 */
export const CheckoutFlowModal: React.FC<CheckoutFlowModalProps> = ({
  companyId,
  fetch,
  isOpen,
  memberId,
  onClose,
  onError,
  onSubmit,
  onTrack,
  startContext,
  basketSessionId: externalBasketSessionId,
}: CheckoutFlowModalProps) => {
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
    isOpen,
    memberId,
    startContext,
    onTrack,
    externalBasketSessionId,
  });

  useEffect(() => {
    if (isOpen) {
      hasTrackedDropRef.current = false;
    }
  }, [isOpen]);

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

  // Errors related to promo codes do not prevent invoice creation;
  // users can proceed even if an invalid promo code is applied.
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
    onSubmit,
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

  // TODO: Move fetchMember to packages/api/community-and-engagement
  // to use react-query instead of useAsync.
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
    if (!isOpen) {
      setIsMemberSelectorOpen(false);
      setIsFootnoteModalOpen(false);
    }
  }, [isOpen]);

  // When no memberId is passed, open the member selector automatically when the modal opens
  const hasAutoOpenedMemberSelectorRef = useRef(false);
  useEffect(() => {
    if (!isOpen) {
      hasAutoOpenedMemberSelectorRef.current = false;
      return;
    }
    if (memberId == null && !hasAutoOpenedMemberSelectorRef.current) {
      hasAutoOpenedMemberSelectorRef.current = true;
      setIsMemberSelectorOpen(true);
    }
  }, [isOpen, memberId]);

  useEffect(() => {
    setValue("isDiscountReasonRequired", isDiscountReasonRequired);
  }, [isDiscountReasonRequired, setValue]);

  const trackDrop = useCallback(
    (cancelTrigger: "cancel_button" | "cross_button" | "escape_key") => {
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
      } else {
        track("checkout_flow_escape_key_button_clicked", cancelPayload);
      }
      track("checkout_flow_pay_cancel", {
        ...cancelPayload,
        basket_cancel_trigger: cancelTrigger,
      });
    },
    [methods, track],
  );

  const handleClose = useCallback(() => {
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

  const handleCancelClose = useCallback(() => {
    trackDrop("cancel_button");
    handleClose();
  }, [trackDrop, handleClose]);

  const handleCrossClose = useCallback(() => {
    trackDrop("cross_button");
    handleClose();
  }, [trackDrop, handleClose]);

  const handleEscapeOrGenericClose = useCallback(() => {
    trackDrop("escape_key");
    handleClose();
  }, [trackDrop, handleClose]);

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
      handleClose();
    }
  };

  const handleOpenMemberProfile = (memberId: number) => {
    window.open(`/member/${memberId}/info`, "_blank");
  };

  return (
    <CheckoutFlowTrackingProvider track={track}>
      <Modal
        open={isOpen}
        size="lg"
        className="h-[90%]"
        title={t("checkoutFlowModal.title")}
        onClose={handleEscapeOrGenericClose}
        onCloseButtonClick={handleCrossClose}
        onClickOutside={() => {}}
        confirmButton={{
          color: "main",
          label: t("checkoutFlowModal.title"),
          type: "submit",
          form: formId,
          disabled: isConfirmDisabled,
        }}
        cancelButton={{
          label: t("checkoutFlowModal.cancel"),
          onClick: handleCancelClose,
        }}
      >
        <ControlledForm
          {...methods}
          onSubmit={handleFormSubmit}
          id={formId}
          className="flex flex-col h-full gap-lg"
        >
          {/* Member Card Section */}
          {isLoadingMember ? (
            <div className="p-md">
              {t("checkoutFlowModal.loadingMemberInfo")}
            </div>
          ) : (
            <MemberAndBillingGroupCard
              companyId={companyId}
              fetch={fetch}
              className="bg-surface-default-weaker"
              member={fetchedMember ?? null}
              onEditClick={handleOpenMemberSelector}
            />
          )}

          {isMobile ? (
            <Accordion className="flex flex-1 flex-col gap-lg">
              <Accordion.Item
                initiallyOpen
                className="gap-md"
                ariaLabel={t("checkoutFlowModal.addItem")}
                header={
                  <Title htmlVariant="h4" color="default" weight="strong">
                    {t("checkoutFlowModal.addItem")}
                  </Title>
                }
                setOpenRef={addItemCollapseSetOpenRef}
              >
                <AddItemSection
                  companyId={companyId}
                  fetch={fetch}
                  onOpenSummarySection={openSummarySection}
                />
              </Accordion.Item>

              <Accordion.Item
                className="gap-md pb-md"
                ariaLabel={t("checkoutFlowModal.summary")}
                header={<SummaryTitle />}
                headerActions={
                  <SummaryFootnoteButton
                    onAddFootnoteClick={() => {
                      track("checkout_flow_add_footnote_button_clicked", {
                        has_footnote: false,
                        footnote_length: undefined,
                        member_id: methods.getValues().member?.id,
                      });
                      setIsFootnoteModalOpen(true);
                    }}
                  />
                }
                setOpenRef={summaryCollapseSetOpenRef}
              >
                <SummarySection
                  fetch={fetch}
                  openAddItemSection={openAddItemSection}
                  isFootnoteModalOpen={isFootnoteModalOpen}
                  setIsFootnoteModalOpen={setIsFootnoteModalOpen}
                />
              </Accordion.Item>
            </Accordion>
          ) : (
            <div className="flex flex-1 gap-lg">
              <div className="flex flex-col flex-1 gap-md">
                <Title htmlVariant="h4" color="default" weight="strong">
                  {t("checkoutFlowModal.addItem")}
                </Title>
                <AddItemSection companyId={companyId} fetch={fetch} />
              </div>
              <div className="flex flex-col flex-1 gap-md">
                <SummaryTitle
                  onAddFootnoteClick={() => {
                    track("checkout_flow_add_footnote_button_clicked", {
                      has_footnote: false,
                      footnote_length: undefined,
                      member_id: methods.getValues().member?.id,
                    });
                    setIsFootnoteModalOpen(true);
                  }}
                />
                <SummarySection
                  fetch={fetch}
                  isFootnoteModalOpen={isFootnoteModalOpen}
                  setIsFootnoteModalOpen={setIsFootnoteModalOpen}
                />
              </div>
            </div>
          )}
        </ControlledForm>
      </Modal>

      <MemberSelectorModal
        fetch={fetch}
        isOpen={isMemberSelectorOpen}
        onClose={handleMemberSelectorClose}
        onSelect={handleMemberSelect}
        onOpenProfile={handleOpenMemberProfile}
      />
    </CheckoutFlowTrackingProvider>
  );
};
