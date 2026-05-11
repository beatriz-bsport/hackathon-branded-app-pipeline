import { useId } from "react";
import { useNavigate, useParams } from "react-router";

import { useFormController } from "@bsport/form";
import { Body, Modal } from "@bsport/kaizen-primitive-core";

import { useTagRuleDetailSuspenseQuery } from "#src/api/use-tag-rule-detail";
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

import { useUpdateAutomationTagRule } from "./use-update-tag-rule";

export const AutomationTagRuleEditPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={DetailPageErrorFallback}
    >
      <AutomationTagRuleEditDetail />
    </QueryBoundary>
  );
};

function AutomationTagRuleEditDetail() {
  const { id: smartlistId, tagRuleId } = useParams<{
    id: string;
    tagRuleId: string;
  }>();
  invariant(smartlistId, "Expected smartlist id param to be defined");
  invariant(tagRuleId, "Expected tag rule id param to be defined");

  const { t } = useTranslation("details");
  const navigate = useNavigate();
  const { data: tagRule } = useTagRuleDetailSuspenseQuery(tagRuleId);

  const baseId = useId();
  const formId = `${baseId}-automation-tag-rule-edit-form`;

  const methods = useFormController({
    mode: "onBlur",
    schema: automationTagRuleSchema,
    defaultValues: {
      kind: tagRule.kind,
      tagIds: [tagRule.tag],
    } satisfies AutomationTagRuleFormData,
  });

  const { updateAutomationTagRule, isUpdating } = useUpdateAutomationTagRule({
    smartlistId,
    tagRuleId,
    onSuccess: () => {
      closeToAutomation();
    },
  });

  const handleSubmit = async (data: AutomationTagRuleFormData) => {
    await updateAutomationTagRule(data);
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

  return (
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
          isUpdating,
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
  );
}
