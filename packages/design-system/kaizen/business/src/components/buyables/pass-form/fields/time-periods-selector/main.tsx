import { Activity, type ReactElement, useId } from "react";

import { type FieldValues, useFormContext } from "@bsport/form";
import { Button, type ToggleProps } from "@bsport/kaizen-primitive-core";

import { FormToggle } from "#src/components/form/toggle";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath, CustomFieldPath } from "#src/utils/form-types";

import { TimePeriodSelector } from "./time-period-selector";
import type { TimePeriodSchedule } from "./types";
import { createTimePeriodSchedule } from "./utils";

type PassFormTimePeriodsSelectorProps<
  TFormValues extends FieldValues,
  EnableFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  TimePeriodsFieldName extends CustomFieldPath<
    TFormValues,
    TimePeriodSchedule[]
  > = CustomFieldPath<TFormValues, TimePeriodSchedule[]>,
> = {
  enableFieldName: EnableFieldName;
  timePeriodsFieldName: TimePeriodsFieldName;
  enableId?: string;
  formId?: string;
} & Partial<Omit<ToggleProps, "id" | "value" | "onChange" | "checked">>;

export const PassFormTimePeriodsSelector = <
  TFormValues extends FieldValues,
  EnableFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  TimePeriodsFieldName extends CustomFieldPath<
    TFormValues,
    TimePeriodSchedule[]
  > = CustomFieldPath<TFormValues, TimePeriodSchedule[]>,
>({
  formId,
  enableId,
  enableFieldName,
  timePeriodsFieldName,
  ...toggleProps
}: PassFormTimePeriodsSelectorProps<
  TFormValues,
  EnableFieldName,
  TimePeriodsFieldName
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const defaultFormId = useId();
  const finalFormId = formId ?? defaultFormId;

  const enableFinalId = enableId ?? `${finalFormId}-time-periods-toggle`;

  const methods = useFormContext();
  const hasEnableTimePeriods = methods.watch(enableFieldName);

  const timePeriods: TimePeriodSchedule[] =
    methods.watch(timePeriodsFieldName) ?? [];

  const addTimePeriodSchedule = () => {
    methods.setValue(
      timePeriodsFieldName,
      [
        ...timePeriods,
        createTimePeriodSchedule(),
      ] as TFormValues[TimePeriodsFieldName],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const deleteTimePeriodSchedule = (identifier: string) => {
    methods.setValue(
      timePeriodsFieldName,
      timePeriods.filter(
        (timePeriod) => timePeriod.identifier !== identifier,
      ) as TFormValues[TimePeriodsFieldName],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const editTimePeriodSchedule = (nextValue: TimePeriodSchedule) => {
    methods.setValue(
      timePeriodsFieldName,
      timePeriods.map((item) =>
        item.identifier !== nextValue.identifier ? item : nextValue,
      ) as TFormValues[TimePeriodsFieldName],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const getDeleteItem = (identifier: string) => {
    if (timePeriods.length <= 1) {
      // Can not delete an item when there is at most one
      return undefined;
    }
    return () => deleteTimePeriodSchedule(identifier);
  };

  return (
    <div>
      <FormToggle<TFormValues, EnableFieldName>
        id={enableFinalId}
        fieldName={enableFieldName}
        label={t("passForm.timeRestrictions.label")}
        helperText={t("passForm.timeRestrictions.helperText")}
        {...toggleProps}
      />
      <Activity mode={hasEnableTimePeriods ? "visible" : "hidden"}>
        <div className="ml-[40px] mt-xs flex flex-col gap-lg">
          {timePeriods.map((timePeriod) => {
            return (
              <TimePeriodSelector
                key={timePeriod.identifier}
                value={timePeriod}
                deleteTimePeriod={getDeleteItem(timePeriod.identifier)}
                onChange={editTimePeriodSchedule}
              />
            );
          })}

          <Button
            intent="default"
            iconLeft="plus"
            label={t("passForm.timeRestrictions.addMoreSchedule")}
            color="main"
            size="md"
            onClick={addTimePeriodSchedule}
            className="self-start"
          />
        </div>
      </Activity>
    </div>
  );
};

PassFormTimePeriodsSelector.displayName = "KaizenPassFormTimePeriodsSelector";
