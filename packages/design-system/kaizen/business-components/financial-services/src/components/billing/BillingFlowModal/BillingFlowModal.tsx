import React, { useCallback, useEffect, useId, useRef, useState } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import {
  Accordion,
  Modal,
  Title,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { getMembers } from "#src/actions/member";
import MemberCard from "#src/components/member/MemberCard";
import MemberSelectorModal from "#src/components/member/MemberSelectorModal";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import type { Member } from "#src/types/member";
import fetch from "#src/utils/fetch";

import { AddItemSection } from "./AddItemSection";
import {
  SummaryFootnoteButton,
  SummarySection,
  SummaryTitle,
} from "./SummarySection";
import {
  ADD_ITEM_DEFAULT,
  DEFAULT_FORM_DATA,
  GIFTCARD_FIELDS_DEFAULT,
} from "./defaults";
import { useCreateInvoice } from "./hooks/use-create-invoice";
import { useInvoiceConfiguration } from "./hooks/use-invoice-configuration";
import { billingFlowFormStateSchema } from "./schema";
import type { BillingFlowModalProps } from "./types";

const BillingFlowModal: React.FC<BillingFlowModalProps> = ({
  isOpen,
  memberId,
  onClose,
  onError,
  onSubmit,
}: BillingFlowModalProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const formId = `billing-flow-modal-${useId()}`;
  const isMobile = !useMatchMedia("sm");

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);
  const [isFootnoteModalOpen, setIsFootnoteModalOpen] = useState(false);
  const addItemCollapseSetOpenRef = useRef<
    ((value: boolean | ((prev: boolean) => boolean)) => void) | null
  >(null);
  const summaryCollapseSetOpenRef = useRef<
    ((value: boolean | ((prev: boolean) => boolean)) => void) | null
  >(null);
  const { isDiscountReasonRequired } = useInvoiceConfiguration();

  const methods = useFormController({
    mode: "onBlur",
    schema: billingFlowFormStateSchema,
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

  const { mutateAsync } = useCreateInvoice({ onError, onSubmit });
  const handleFormSubmit = () =>
    mutateAsync(methods.getValues()).catch((error) => onError?.(error));

  const handleFetchMember = async (id: number) => {
    return getMembers(fetch, { memberId: id });
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

  const handleOpenMemberProfile = (memberId: number) => {
    window.open(`/member/${memberId}/info`, "_blank");
  };

  return (
    <>
      <Modal
        open={isOpen}
        size="lg"
        className="h-[90%]"
        title={t("billingFlowModal.title")}
        onClose={handleClose}
        onCloseButtonClick={handleClose}
        onClickOutside={() => {}}
        confirmButton={{
          color: "main",
          label: t("billingFlowModal.title"),
          type: "submit",
          form: formId,
          disabled: isConfirmDisabled,
        }}
        cancelButton={{
          label: t("billingFlowModal.cancel"),
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
              {t("billingFlowModal.loadingMemberInfo")}
            </div>
          ) : (
            <MemberCard
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
                ariaLabel={t("billingFlowModal.addItem")}
                header={
                  <Title htmlVariant="h4" color="default" weight="strong">
                    {t("billingFlowModal.addItem")}
                  </Title>
                }
                setOpenRef={addItemCollapseSetOpenRef}
              >
                <AddItemSection onOpenSummarySection={openSummarySection} />
              </Accordion.Item>

              <Accordion.Item
                className="gap-md pb-md"
                ariaLabel={t("billingFlowModal.summary")}
                header={<SummaryTitle />}
                headerActions={
                  <SummaryFootnoteButton
                    onAddFootnoteClick={() => setIsFootnoteModalOpen(true)}
                  />
                }
                setOpenRef={summaryCollapseSetOpenRef}
              >
                <SummarySection
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
                  {t("billingFlowModal.addItem")}
                </Title>
                <AddItemSection />
              </div>
              <div className="flex flex-col flex-1 gap-md">
                <SummaryTitle
                  onAddFootnoteClick={() => setIsFootnoteModalOpen(true)}
                />
                <SummarySection
                  isFootnoteModalOpen={isFootnoteModalOpen}
                  setIsFootnoteModalOpen={setIsFootnoteModalOpen}
                />
              </div>
            </div>
          )}
        </ControlledForm>
      </Modal>

      <MemberSelectorModal
        isOpen={isMemberSelectorOpen}
        onClose={() => setIsMemberSelectorOpen(false)}
        onSelect={handleMemberSelect}
        onOpenProfile={handleOpenMemberProfile}
      />
    </>
  );
};

export default BillingFlowModal;
