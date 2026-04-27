import { toast } from "@bsport/kaizen-primitive-core";

import { useCreateTagRule } from "#src/api/use-create-tag-rule";
import { type AutomationTagRuleFormData } from "#src/components/AutomationTagRuleForm";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const useCreateAutomationTagRule = ({
  smartlistId,
  onSuccess,
}: {
  smartlistId: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation("details");

  const parsedSmartlistId = Number(smartlistId);

  if (Number.isNaN(parsedSmartlistId)) {
    throw new Error(`Invalid smartlist id: ${smartlistId}`);
  }

  const { createTagRule, isCreating } = useCreateTagRule({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.tagRules.toasts.success.created"),
        buttonIcon: "x-close",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.tagRules.toasts.error.createFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const createAutomationTagRule = (data: AutomationTagRuleFormData) => {
    const selectedTagId = data.tagIds?.[0];
    invariant(selectedTagId, "Expected selected tag id to be defined");

    if (selectedTagId === undefined) {
      return;
    }

    return createTagRule({
      smartlist: parsedSmartlistId,
      tag: selectedTagId,
      kind: data.kind,
    });
  };

  return {
    createAutomationTagRule,
    isCreating,
  } as const;
};
