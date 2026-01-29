import React, { useEffect, useState } from "react";
import { useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import {
  Body,
  Button,
  Card,
  Modal,
  Title,
} from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { getMembers } from "#src/actions/member";
import ItemAutocomplete from "#src/components/billing/ItemAutocomplete";
import ItemTypeSelector, {
  INVOICE_ITEMS_KINDS,
  type InvoiceItemKind,
} from "#src/components/billing/ItemTypeSelector";
import MemberCard from "#src/components/member/MemberCard";
import MemberSelectorModal from "#src/components/member/MemberSelectorModal";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import type { Member } from "#src/types/member";
import fetch from "#src/utils/fetch";

import { DEFAULT_FORM_DATA, billingFlowFormDataSchema } from "./schema";
import type { BillingFlowModalProps } from "./types";

// Note: Currently routes to legacy backoffice (causes page reload).
// In the future, this will route to the revamp subscription page which may use react-router.
const LEGACY_URL_SUBSCRIPTION = "/subscriptions";

const BillingFlowModal: React.FC<BillingFlowModalProps> = ({
  isOpen,
  onClose,
  memberId,
}: BillingFlowModalProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const formId = `billing-flow-modal-${useId()}`;

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<InvoiceItemKind>(
    INVOICE_ITEMS_KINDS.pass,
  );

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
    }
  }, [isOpen]);

  const handleClose = () => {
    methods.reset();
    setIsMemberSelectorOpen(false);
    setSelectedItemType(INVOICE_ITEMS_KINDS.pass);
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
            {/* Add Item Section */}
            <div className="flex flex-col flex-1">
              <Title htmlVariant="h4" color="default" weight="strong">
                {t("billingFlowModal.addItem")}
              </Title>
              <div className="mt-md">
                <Card elevated={false}>
                  <div className="flex flex-col gap-md">
                    <ItemTypeSelector
                      label={t("itemTypeSelector.label")}
                      value={selectedItemType}
                      onSelect={setSelectedItemType}
                    />
                    {selectedItemType !== "subscription" ? (
                      <ItemAutocomplete
                        itemType={selectedItemType}
                        textfieldProps={{
                          label: t("billingFlowModal.searchItem"),
                          placeholder: t(
                            "billingFlowModal.searchItemPlaceholder",
                          ),
                          required: true,
                        }}
                        // TODO: Handle item selection
                      />
                    ) : (
                      <div className="flex flex-col justify-center items-center text-center self-stretch py-xl gap-xs">
                        <Body color="weak" className="max-w-[323px]">
                          {t("billingFlowModal.subscriptionMessage")}
                        </Body>
                        <Button
                          iconRight="share-03"
                          label={t("billingFlowModal.goToSubscriptions")}
                          size="md"
                          color="main"
                          intent="call-to-action"
                          onClick={() =>
                            window.open(LEGACY_URL_SUBSCRIPTION, "_blank")
                          }
                        />
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Summary Section */}
            <div className="flex flex-col flex-1">
              <Title htmlVariant="h4" color="default" weight="strong">
                {t("billingFlowModal.summary")}
              </Title>
              <div className="mt-md">
                <Card elevated={false}></Card>
              </div>
            </div>
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
