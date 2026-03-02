import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Member } from "@bsport/api-cdp";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  Accordion,
  Modal,
  Title,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { MemberSelectorModal } from "#src/components/cdp/member/member-selector-modal";
import { MemberAndBillingGroupCard } from "#src/components/core/checkout-flow-modal/member-and-billing-group-card";
import { i18nInstance, useTranslation } from "#src/i18n";

import { AddItemSection } from "./add-item-section";
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
import { useCreateInvoice } from "./use-create-invoice";
import { useInvoiceConfiguration } from "./use-invoice-configuration";

export const CheckoutFlowModal: React.FC<CheckoutFlowModalProps> = ({
  companyId,
  fetch,
  isOpen,
  memberId,
  onClose,
  onError,
  onSubmit,
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

  const { mutateAsync } = useCreateInvoice({ fetch, onError, onSubmit });
  const handleFormSubmit = () =>
    mutateAsync(methods.getValues()).catch((error) => onError?.(error));

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

  const handleClose = () => {
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
  };

  const handleMemberSelect = (selectedMember: Member) => {
    hasAutoOpenedMemberSelectorRef.current = false;
    setValue("member", selectedMember, {
      shouldDirty: true,
      shouldValidate: true,
    });
    fetchMember(selectedMember.id);
    setIsMemberSelectorOpen(false);
  };

  const handleOpenMemberSelector = () => {
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
    <>
      <Modal
        open={isOpen}
        size="lg"
        className="h-[90%]"
        title={t("checkoutFlowModal.title")}
        onClose={handleClose}
        onCloseButtonClick={handleClose}
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
          onClick: handleClose,
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
                    onAddFootnoteClick={() => setIsFootnoteModalOpen(true)}
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
                  onAddFootnoteClick={() => setIsFootnoteModalOpen(true)}
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
    </>
  );
};
