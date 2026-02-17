import { type FC, useMemo } from "react";

import { COACH_PAYMENT_RULE_TYPE } from "@bsport/api-financial-services";
import { FormField, useFormContext } from "@bsport/form";
import { Autocomplete, AutocompleteProps } from "@bsport/kaizen-primitive-core";

import { useFetchTeacherPaymentRules } from "#src/hooks/use-fetch-teacher-payment-rules";
import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import { useSessionCreationStore } from "#src/stores/session-creation/store";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const TeacherPaymentRuleSelectorField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionCreationFormData>();

  const coachPaymentRule = watch("coach_payment_rule");
  const isCoachSelected = !!watch("coach");

  const { data: paymentRules, isLoading } = useFetchTeacherPaymentRules();

  const selectedGroupActivity = useSessionCreationStore(
    selectSelectedGroupActivity,
  );

  const isWorkshop = selectedGroupActivity?.is_workshop;

  const filteredPaymentRules = useMemo(() => {
    if (!paymentRules) return [];

    const allowedKinds = [
      COACH_PAYMENT_RULE_TYPE.COACH_PAYMENT_RULE_FOR_SESSION,
      ...(isWorkshop !== false
        ? [COACH_PAYMENT_RULE_TYPE.COACH_PAYMENT_RULE_FOR_WORKSHOP]
        : []),
      ...(!isWorkshop
        ? [COACH_PAYMENT_RULE_TYPE.COACH_PAYMENT_RULE_FOR_GROUP_ACTIVITY]
        : []),
    ];

    return paymentRules.filter((rule) => allowedKinds.includes(rule.kind));
  }, [paymentRules, isWorkshop]);

  const paymentRuleItems = filteredPaymentRules.map((rule) => ({
    id: rule.id.toString(),
    label: rule.name,
  }));

  const defaultSelectedIds = useMemo(() => {
    return coachPaymentRule !== null ? [coachPaymentRule.toString()] : [];
  }, [coachPaymentRule]);

  const selectedPaymentRuleId = useMemo(() => {
    return coachPaymentRule !== null
      ? paymentRuleItems.find((rule) => rule.id === coachPaymentRule.toString())
      : null;
  }, [coachPaymentRule, paymentRuleItems]);

  return (
    <FormField<SessionCreationFormData, "coach_payment_rule", AutocompleteProps>
      name="coach_payment_rule"
      mapProps={({ form: { setValue } }) => ({
        onSelect: (selectedTeacherPaymentRuleId: string) => {
          setValue(
            "coach_payment_rule",
            selectedTeacherPaymentRuleId
              ? Number(selectedTeacherPaymentRuleId)
              : null,
            { shouldValidate: true, shouldDirty: true },
          );
        },
        onClear: () => {
          setValue("coach_payment_rule", null, { shouldValidate: true });
        },
      })}
    >
      <Autocomplete
        clearOnSelect
        items={paymentRuleItems}
        textfieldProps={{
          id: `${fieldIdPrefix}-payment-rule-selector`,
          label: t(
            "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.payroll.label",
          ),
          placeholder:
            selectedPaymentRuleId?.label ??
            t(
              "addSessionModal.steps.configureSession.settings.teacherAndEstablishment.payroll.placeholder",
            ),
        }}
        loadingProps={{ isLoading }}
        disabled={!isCoachSelected}
        defaultSelectedIds={defaultSelectedIds}
      />
    </FormField>
  );
};
