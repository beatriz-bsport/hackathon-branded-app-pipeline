import React, { useEffect, useId, useState } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { getMembers } from "#src/actions/member";
import {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
} from "#src/components/billing/ItemTypeSelector";
import MemberCard from "#src/components/member/MemberCard";
import MemberSelectorModal from "#src/components/member/MemberSelectorModal";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import type { Member } from "#src/types/member";
import fetch from "#src/utils/fetch";

import AddItemSection from "./AddItemSection";
import SummarySection from "./SummarySection";
import { DEFAULT_FORM_DATA, billingFlowFormDataSchema } from "./schema";
import type { BillingFlowModalProps } from "./types";
import { type AddedItem, useAddItemForm } from "./use-add-item-form";

const BillingFlowModal: React.FC<BillingFlowModalProps> = ({
  isOpen,
  onClose,
  memberId,
}: BillingFlowModalProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const formId = `billing-flow-modal-${useId()}`;

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] =
    useState<InvoiceItemKind | null>(INVOICE_ITEMS_KINDS.pass);

  const [items, setItems] = useState<AddedItem[]>([]);

  const handleItemDelete = (itemIndex: number) => {
    setItems((prev) => {
      const newItems = prev.filter((_, index) => index !== itemIndex);
      methods.setValue("items", newItems, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return newItems;
    });
  };

  const addItemForm = useAddItemForm({
    selectedItemType,
    onItemTypeReset: () => {
      setSelectedItemType(null);
    },
    onItemAdded: (newItem) => {
      setItems((prev) => [...prev, newItem]);
      const currentItems = methods.getValues("items") || [];
      methods.setValue("items", [...currentItems, newItem], {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  const handleItemTypeSelect = (type: InvoiceItemKind) => {
    addItemForm.resetForm();
    setSelectedItemType(type);
  };

  const methods = useFormController({
    mode: "onBlur",
    schema: billingFlowFormDataSchema,
    defaultValues: {
      ...DEFAULT_FORM_DATA,
      memberId: memberId ?? undefined,
    },
  });

  const { formState, setValue, watch } = methods;
  const { isDirty, isSubmitting, isValid } = formState;
  const formMemberId = watch("memberId");

  const handleFetchMember = async (id: number) => {
    return getMembers(fetch, { memberId: id });
  };

  const [{ isLoading: isLoadingMember, data: member }, fetchMember] = useAsync<
    typeof handleFetchMember
  >({
    asyncFn: handleFetchMember,
  });

  useEffect(() => {
    if (formMemberId) {
      fetchMember(formMemberId);
    }
  }, [formMemberId, fetchMember]);

  useEffect(() => {
    if (!isOpen) {
      setIsMemberSelectorOpen(false);
      setSelectedItemType(INVOICE_ITEMS_KINDS.pass);
      setItems([]);
    }
  }, [isOpen]);

  const handleClose = () => {
    methods.reset();
    setIsMemberSelectorOpen(false);
    setItems([]);
    onClose();
  };

  const handleMemberSelect = (member: Member) => {
    setValue("memberId", member.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
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
        title={t("billingFlowModal.title")}
        onClose={handleClose}
        onCloseButtonClick={handleClose}
        onClickOutside={() => {}}
        confirmButton={{
          color: "main",
          label: t("billingFlowModal.title"),
          type: "submit",
          form: formId,
          disabled: !isDirty || isSubmitting || !isValid,
        }}
        cancelButton={{
          label: t("billingFlowModal.cancel"),
          onClick: handleClose,
        }}
      >
        <ControlledForm
          {...methods}
          onSubmit={(data) => {
            // TODO: Handle form submission
            console.log(data);
          }}
          id={formId}
          className="flex flex-col gap-lg"
        >
          {/* Member Card Section */}
          {isLoadingMember ? (
            <div className="p-md">
              {t("billingFlowModal.loadingMemberInfo")}
            </div>
          ) : (
            <MemberCard
              className="bg-surface-default-weaker"
              member={member ?? null}
              onEditClick={handleOpenMemberSelector}
            />
          )}

          <div className="flex gap-lg">
            <AddItemSection
              selectedItemType={selectedItemType}
              onItemTypeSelect={handleItemTypeSelect}
              addItemForm={addItemForm}
            />
            <SummarySection items={items} onItemDelete={handleItemDelete} />
          </div>
        </ControlledForm>
      </Modal>

      {/* Member Selector Modal */}
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
