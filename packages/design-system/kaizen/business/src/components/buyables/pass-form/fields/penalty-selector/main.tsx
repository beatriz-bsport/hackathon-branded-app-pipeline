import { Activity, type ReactElement, useId } from "react";

import { type FieldValues, useFormContext } from "@bsport/form";
import { Trans } from "@bsport/i18n";
import { Body, Link, type ToggleProps } from "@bsport/kaizen-primitive-core";

import { FormToggle } from "#src/components/form/toggle";
import { i18nInstance, i18nNamespacePrefix, useTranslation } from "#src/i18n";
import type { BooleanFieldPath, NumberFieldPath } from "#src/utils/form-types";

import { PenaltyRuleCard } from "./penalty-rule-card";

type PassFormPenaltySelectorProps<
  TFormValues extends FieldValues,
  ApplyPenaltyFieldName extends BooleanFieldPath<TFormValues>,
  ActiveFieldNames extends BooleanFieldPath<TFormValues>,
  NumberFieldNames extends NumberFieldPath<TFormValues>,
> = {
  formId?: string;
  applyPenaltyId?: string;
  applyPenaltyFieldName: ApplyPenaltyFieldName;
  lateCancellationActiveFieldName: ActiveFieldNames;
  lateCancellationThresholdFieldName: NumberFieldNames;
  lateCancellationWindowDaysFieldName: NumberFieldNames;
  lateCancellationKindFieldName: NumberFieldNames;
  lateCancellationBlockedDaysFieldName: NumberFieldNames;
  lateCancellationChargedAmountFieldName: NumberFieldNames;
  noShowActiveFieldName: ActiveFieldNames;
  noShowThresholdFieldName: NumberFieldNames;
  noShowTimeWindowDaysFieldName: NumberFieldNames;
  noShowKindFieldName: NumberFieldNames;
  noShowBlockedDaysFieldName: NumberFieldNames;
  noShowChargedAmountFieldName: NumberFieldNames;
  noShowSettingsHref: string;
} & Partial<Omit<ToggleProps, "id" | "value" | "checked" | "onChange">>;

export const PassFormPenaltySelector = <
  TFormValues extends FieldValues,
  ApplyPenaltyFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  ActiveFieldNames extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  NumberFieldNames extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  formId,
  applyPenaltyId,
  applyPenaltyFieldName,
  lateCancellationActiveFieldName,
  lateCancellationThresholdFieldName,
  lateCancellationWindowDaysFieldName,
  lateCancellationKindFieldName,
  lateCancellationBlockedDaysFieldName,
  lateCancellationChargedAmountFieldName,
  noShowActiveFieldName,
  noShowThresholdFieldName,
  noShowTimeWindowDaysFieldName,
  noShowKindFieldName,
  noShowBlockedDaysFieldName,
  noShowChargedAmountFieldName,
  noShowSettingsHref,
  ...toggleProps
}: PassFormPenaltySelectorProps<
  TFormValues,
  ApplyPenaltyFieldName,
  ActiveFieldNames,
  NumberFieldNames
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const defaultFormId = useId();
  const finalFormId = formId ?? defaultFormId;
  const applyPenaltyFinalId =
    applyPenaltyId ?? `${finalFormId}-apply-penalty-toggle`;

  const methods = useFormContext<TFormValues>();
  const applyPenalty = methods.watch(applyPenaltyFieldName);

  return (
    <div>
      <FormToggle<TFormValues, ApplyPenaltyFieldName>
        id={applyPenaltyFinalId}
        fieldName={applyPenaltyFieldName}
        label={t("passForm.penalty.label")}
        helperText={t("passForm.penalty.helperText")}
        {...toggleProps}
      />
      <Activity mode={applyPenalty ? "visible" : "hidden"}>
        <div className="ml-[40px] mt-xs flex flex-col gap-md">
          <PenaltyRuleCard<TFormValues, ActiveFieldNames, NumberFieldNames>
            formId={finalFormId}
            title={t("passForm.penalty.lateCancellation.title")}
            thresholdLabel={t(
              "passForm.penalty.lateCancellation.thresholdLabel",
            )}
            windowDaysLabel={t(
              "passForm.penalty.lateCancellation.windowDaysLabel",
            )}
            activeFieldName={lateCancellationActiveFieldName}
            thresholdFieldName={lateCancellationThresholdFieldName}
            windowDaysFieldName={lateCancellationWindowDaysFieldName}
            kindFieldName={lateCancellationKindFieldName}
            blockedDaysFieldName={lateCancellationBlockedDaysFieldName}
            accountValueFieldName={lateCancellationChargedAmountFieldName}
          />

          <PenaltyRuleCard<TFormValues, ActiveFieldNames, NumberFieldNames>
            formId={finalFormId}
            title={t("passForm.penalty.noShow.title")}
            description={
              <Body size="sm" color="weak">
                <Trans
                  i18nKey="passForm.penalty.noShow.description"
                  ns={`${i18nNamespacePrefix}_buyables`}
                  i18n={i18nInstance}
                  components={{
                    key1: <Link href={noShowSettingsHref} color="main" />,
                  }}
                />
              </Body>
            }
            thresholdLabel={t("passForm.penalty.noShow.thresholdLabel")}
            windowDaysLabel={t("passForm.penalty.noShow.windowDaysLabel")}
            activeFieldName={noShowActiveFieldName}
            thresholdFieldName={noShowThresholdFieldName}
            windowDaysFieldName={noShowTimeWindowDaysFieldName}
            kindFieldName={noShowKindFieldName}
            blockedDaysFieldName={noShowBlockedDaysFieldName}
            accountValueFieldName={noShowChargedAmountFieldName}
          />
        </div>
      </Activity>
    </div>
  );
};

PassFormPenaltySelector.displayName = "KaizenPassFormPenaltySelector";
