import { toast } from "@bsport/kaizen-primitive-core";

import { useUpdateTagRule } from "#src/api/use-update-tag-rule";
import { type AutomationTagRuleFormData } from "#src/components/AutomationTagRuleForm";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const useUpdateAutomationTagRule = ({
  smartlistId,
  tagRuleId,
  onSuccess,
}: {
  smartlistId: string;
  tagRuleId: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation("details");

  const parsedSmartlistId = Number(smartlistId);
  const parsedTagRuleId = Number(tagRuleId);

  invariant(
    Number.isInteger(parsedSmartlistId) && parsedSmartlistId > 0,
    `Invalid smartlist id: ${smartlistId}`,
  );
  invariant(
    Number.isInteger(parsedTagRuleId) && parsedTagRuleId > 0,
    `Invalid tag rule id: ${tagRuleId}`,
  );

  const { updateTagRule, isUpdating } = useUpdateTagRule({
    onSuccess: () => {
      toast({
        status: "positive",
        icon: "check",
        description: t("automation.tagRules.toasts.success.saved"),
        buttonIcon: "x-close",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        status: "critical",
        icon: "alert-circle",
        description: t("automation.tagRules.toasts.error.updateFailed"),
        buttonIcon: "x-close",
      });
    },
  });

  const updateAutomationTagRule = (data: AutomationTagRuleFormData) => {
    const selectedTagId = data.tagIds?.[0];

    invariant(selectedTagId, "Expected selected tag id to be defined");

    if (!selectedTagId) {
      return;
    }

    return updateTagRule({
      id: parsedTagRuleId,
      smartlist: parsedSmartlistId,
      tag: selectedTagId,
      kind: data.kind,
    });
  };

  return {
    updateAutomationTagRule,
    isUpdating,
  } as const;
};
