import { Activity, Fragment, type ReactElement, useId } from "react";

import { type FieldValues, useFormContext } from "@bsport/form";
import { Body, type ToggleProps } from "@bsport/kaizen-primitive-core";

import { FormNumberField } from "#src/components/form/number-field";
import { FormToggle } from "#src/components/form/toggle";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath, NumberFieldPath } from "#src/utils/form-types";

type PassFormMaximumUsageProps<
  TFormValues extends FieldValues,
  HasMaximumUsageFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  MaximumUsageFieldsName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = {
  hasMaximumUsageFieldName: HasMaximumUsageFieldName;
  maximumPerDayFieldName: MaximumUsageFieldsName | null;
  maximumPerWeekFieldName: MaximumUsageFieldsName | null;
  maximumPerMonthFieldName: MaximumUsageFieldsName | null;
  maximumPerMemberFieldName: MaximumUsageFieldsName | null;
  hasMaximumUsageId?: string;
  maximumPerDayId?: string;
  maximumPerWeekId?: string;
  maximumPerMonthId?: string;
  maximumPerMemberId?: string;
  formId?: string;
} & Partial<Omit<ToggleProps, "id" | "value" | "checked" | "onChange">>;

const OPTIONS = {
  DAY: "maximum-usage-day",
  WEEK: "maximum-usage-week",
  MONTH: "maximum-usage-month",
  MEMBER: "maximum-usage-member",
};

export const PassFormMaximumUsage = <
  TFormValues extends FieldValues,
  HasMaximumUsageFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  MaximumUsageFieldsName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  hasMaximumUsageFieldName,
  maximumPerDayFieldName,
  maximumPerWeekFieldName,
  maximumPerMonthFieldName,
  maximumPerMemberFieldName,
  hasMaximumUsageId,
  maximumPerDayId,
  maximumPerWeekId,
  maximumPerMonthId,
  maximumPerMemberId,
  formId,
  ...toggleProps
}: PassFormMaximumUsageProps<
  TFormValues,
  HasMaximumUsageFieldName,
  MaximumUsageFieldsName
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const defaultFormId = useId();
  const finalFormId = formId ?? defaultFormId;

  const hasMaximumUsageFinalId =
    hasMaximumUsageId ?? `${finalFormId}-maximum-usage-toggle`;
  const maximumPerDayFinalId =
    maximumPerDayId ?? `${finalFormId}-${OPTIONS.DAY}`;
  const maximumPerWeekFinalId =
    maximumPerWeekId ?? `${finalFormId}-${OPTIONS.WEEK}`;
  const maximumPerMonthFinalId =
    maximumPerMonthId ?? `${finalFormId}-${OPTIONS.MONTH}`;
  const maximumPerMemberFinalId =
    maximumPerMemberId ?? `${finalFormId}-${OPTIONS.MEMBER}`;

  const methods = useFormContext();
  const hasMaximumUsage = methods.watch(hasMaximumUsageFieldName);

  const items = [
    {
      id: maximumPerDayFinalId,
      label: t("passForm.maximumUsage.scopes.day"),
      fieldName: maximumPerDayFieldName,
    },
    {
      id: maximumPerWeekFinalId,
      label: t("passForm.maximumUsage.scopes.week"),
      fieldName: maximumPerWeekFieldName,
    },
    {
      id: maximumPerMonthFinalId,
      label: t("passForm.maximumUsage.scopes.month"),
      fieldName: maximumPerMonthFieldName,
    },
    {
      id: maximumPerMemberFinalId,
      label: t("passForm.maximumUsage.scopes.member"),
      fieldName: maximumPerMemberFieldName,
    },
  ] as const;

  return (
    <div>
      <FormToggle<TFormValues, HasMaximumUsageFieldName>
        id={hasMaximumUsageFinalId}
        fieldName={hasMaximumUsageFieldName}
        label={t("passForm.maximumUsage.label")}
        helperText={t("passForm.maximumUsage.helperText")}
        {...toggleProps}
      />
      <Activity mode={hasMaximumUsage ? "visible" : "hidden"}>
        <div className="grid grid-cols-2 gap-xs ml-[40px] mt-xs">
          <Body>{t("passForm.maximumUsage.gridColumns.maximumUsage")}</Body>
          <Body>{t("passForm.maximumUsage.gridColumns.scope")}</Body>

          {items.map((item) =>
            item.fieldName ? (
              <Fragment key={`${item.id}-fragment`}>
                <FormNumberField<TFormValues, MaximumUsageFieldsName>
                  fieldName={item.fieldName}
                  key={`${item.id}-input`}
                  id={item.id}
                  step={1}
                  maxDigits={0}
                  min={0}
                  aria-label={item.label}
                />

                <Body key={`${item.id}-label`}>{item.label}</Body>
              </Fragment>
            ) : null,
          )}
        </div>
      </Activity>
    </div>
  );
};

PassFormMaximumUsage.displayName = "KaizenPassFormMaximumUsage";
