import { useId, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { TagRuleKind } from "#src/api/constants";
import {
  AutomationTagRuleForm,
  type AutomationTagRuleFormData,
  automationTagRuleSchema,
} from "#src/components/AutomationTagRuleForm";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

import { TagRuleLimitReachedModal } from "./tag-rule-limit-reached-modal";
import { useCreateAutomationTagRule } from "./use-create-tag-rule";

export const AutomationTagRuleCreationPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationTagRuleCreationDetail />
    </QueryBoundary>
  );
};

function AutomationTagRuleCreationDetail() {
  const { id: smartlistId } = useParams<{ id: string }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");

  const { t } = useTranslation("details");
  const navigate = useNavigate();
  const [isTagRuleLimitModalOpen, setIsTagRuleLimitModalOpen] = useState(false);

  const baseId = useId();
  const formId = `${baseId}-automation-tag-rule-create-form`;

  const methods = useFormController({
    mode: "onBlur",
    schema: automationTagRuleSchema,
    defaultValues: {
      kind: TagRuleKind.TAG_ON_JOIN_AND_KEEP_TAG,
      tagIds: [],
    } satisfies AutomationTagRuleFormData,
  });

  const { createAutomationTagRule, isCreating } = useCreateAutomationTagRule({
    smartlistId,
    onSuccess: () => {
      closeToAutomation();
    },
    onTagRuleLimitReached: () => {
      setIsTagRuleLimitModalOpen(true);
    },
  });

  const handleSubmit = async (data: AutomationTagRuleFormData) => {
    await createAutomationTagRule(data);
  };

  const closeToAutomation = () => {
    methods.reset();
    navigate(SMARTLIST_APP_LINKS.automation(smartlistId));
  };

  const handleClickOutside = () => {
    const { isDirty, isSubmitting } = methods.formState;

    if (isDirty || isSubmitting) {
      return;
    }

    closeToAutomation();
  };

  const handleCloseTagRuleLimitModal = () => {
    setIsTagRuleLimitModalOpen(false);
    closeToAutomation();
  };

  return (
    <>
      <Modal
        open
        size="md"
        title={t("actions.createAutomationModal.automationType.tagRule.title")}
        onClose={closeToAutomation}
        onClickOutside={handleClickOutside}
        confirmButton={{
          label: t("actions.createAutomationModal.tagRuleForm.actions.save"),
          type: "submit",
          form: formId,
          disabled:
            !methods.formState.isDirty ||
            methods.formState.isSubmitting ||
            isCreating,
        }}
        cancelButton={{
          label: t("actions.createAutomationModal.tagRuleForm.actions.cancel"),
          onClick: closeToAutomation,
        }}
      >
        <div className="flex flex-col gap-sm">
          <Body htmlVariant="p" size="md" weight="weak">
            {t(
              "actions.createAutomationModal.automationType.tagRule.description",
            )}
          </Body>
          <AutomationTagRuleForm
            id={formId}
            onSubmit={handleSubmit}
            {...methods}
          />
        </div>
      </Modal>
      <TagRuleLimitReachedModal
        isOpen={isTagRuleLimitModalOpen}
        onClose={handleCloseTagRuleLimitModal}
      />
    </>
  );
}
