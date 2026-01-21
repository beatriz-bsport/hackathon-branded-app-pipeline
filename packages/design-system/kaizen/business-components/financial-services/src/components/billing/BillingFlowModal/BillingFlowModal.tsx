import React, { useEffect, useState } from "react";
import { useId } from "react";

import { ControlledForm, useFormController } from "@bsport/form";
import { Modal } from "@bsport/kaizen-primitive-core";
import { useAsync } from "@bsport/use-async";

import { getMembers } from "#src/actions/member";
import MemberCard from "#src/components/member/MemberCard";
import MemberSelectorModal from "#src/components/member/MemberSelectorModal";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";
import type { Member } from "#src/types/member";
import fetch from "#src/utils/fetch";

import { DEFAULT_FORM_DATA, billingFlowFormDataSchema } from "./schema";
import type { BillingFlowModalProps } from "./types";

const BillingFlowModal: React.FC<BillingFlowModalProps> = ({
  isOpen,
  onClose,
  memberId,
}: BillingFlowModalProps) => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const formId = `billing-flow-modal-${useId()}`;

  const [isMemberSelectorOpen, setIsMemberSelectorOpen] = useState(false);

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
    }
  }, [isOpen]);

  const handleClose = () => {
    methods.reset();
    setIsMemberSelectorOpen(false);
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
          className="flex flex-col gap-md"
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

          {/* TODO: Add remaining form content (items, summary, etc.) */}
          <div className="flex flex-col gap-md">
            <p>Billing Flow Modal - Content to be implemented</p>
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
