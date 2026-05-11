import { HTTPException } from "@bsport/fetch";
import { toast } from "@bsport/kaizen-primitive-core";

import { useCreateTagRule } from "#src/api/use-create-tag-rule";
import { type AutomationTagRuleFormData } from "#src/components/AutomationTagRuleForm";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

const TAG_RULE_LIMIT_REACHED_ERROR_NAME = "limit_of_ten_rules_reached";
const TAG_RULE_LIMIT_REACHED_STATUS_CODE = 423;

const isTagRuleLimitReachedError = (error: Error) =>
  error instanceof HTTPException &&
  error.statusCode === TAG_RULE_LIMIT_REACHED_STATUS_CODE &&
  error.name === TAG_RULE_LIMIT_REACHED_ERROR_NAME;

export const useCreateAutomationTagRule = ({
  smartlistId,
  onSuccess,
  onTagRuleLimitReached,
}: {
  smartlistId: string;
  onSuccess: () => void;
  onTagRuleLimitReached: () => void;
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
    onError: (error) => {
      if (isTagRuleLimitReachedError(error)) {
        onTagRuleLimitReached();

        return;
      }

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
