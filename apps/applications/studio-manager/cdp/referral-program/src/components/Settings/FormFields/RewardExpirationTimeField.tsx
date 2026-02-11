import { type FC, useState } from "react";

import { type ControlledFormProps, FormField } from "@bsport/form";
import {
  Select,
  type SelectProps,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import {
  type ReferralProgramFormData,
  timeUnits,
  unitMap,
} from "#src/utils/types";

type Props = Omit<
  ControlledFormProps<ReferralProgramFormData>,
  "children" | "onSubmit"
>;

export const RewardExpirationTimeField: FC<Props> = ({ ...methods }: Props) => {
  const isMobile = !useMatchMedia("sm");
  const [timeLimitIntervalCounter, setTimeLimitIntervalCounter] = useState(
    methods.getValues().applicationTimeLimitInterval ??
      APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT,
  );
  const { t } = useTranslation("settings");
  const { setValue, watch } = methods;

  const watchedApplicationTimeLimitUnit = watch("applicationTimeLimitUnit");

  const getItems = (interval: number) => {
    return timeUnits.map((unit) => ({
      id: unit,
      // @ts-expect-error - TypeScript does not recognize the dynamic nature of the label
      label: t(`active.form.timeLimitForUsage.unit.choices.${unit}`, {
        count: interval,
      }), // e.g., "day" vs "days"
    }));
  };

  const getSelectDisplayedValue = (unit: string, interval: number): string => {
    const unitKey = unit[0]?.toLowerCase() || "d";
    const fullUnit = unitMap[unitKey] || "day";
    // @ts-expect-error - TypeScript does not recognize the dynamic nature of the label
    return t(`active.form.timeLimitForUsage.unit.choices.${fullUnit}`, {
      count: interval,
    });
  };

  const items = getItems(timeLimitIntervalCounter);

  const labelToId = Object.fromEntries(
    items.map((item) => [item.label, item.id]),
  );

  const timeUnitDisplayedValue = getSelectDisplayedValue(
    watchedApplicationTimeLimitUnit,
    timeLimitIntervalCounter,
  );

  const elementGroupFlexOrientation = isMobile
    ? "flex flex-col gap-md"
    : "flex flex-row gap-md";

  return (
    <div
      id="referring-reward-time-limit"
      className={elementGroupFlexOrientation}
    >
      <FormField<
        ReferralProgramFormData,
        "applicationTimeLimitUnit",
        SelectProps
      >
        name="applicationTimeLimitUnit"
        mapProps={({ defaultProps, field, form }) => ({
          ...defaultProps,
          value: timeUnitDisplayedValue,
          onSelect: (option: string) => {
            const selectedUnit = labelToId[option] || "day";
            field.onChange(selectedUnit);
            form.trigger("applicationTimeLimitInterval");
          },
        })}
      >
        <Select
          required
          fullWidth={isMobile}
          className="min-w-[190px]"
          id="application-time-limit-unit"
          label={t("active.form.timeLimitForUsage.unit.label")}
          items={items as SelectProps["items"]}
        />
      </FormField>
      <FormField<ReferralProgramFormData, "applicationTimeLimitInterval">
        name="applicationTimeLimitInterval"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          type: "number",
          value: String(field.value),
          min: 1,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const newInterval = Number(event.target.value);
            // Update form field and local state
            field.onChange(event.target.value);
            setTimeLimitIntervalCounter(newInterval);

            // Generate new items with updated interval (for correct pluralization)
            const newItems = getItems(newInterval);

            // Get the current unit in full form
            const currentUnitKey =
              watchedApplicationTimeLimitUnit[0]?.toLowerCase() || "d";
            const currentUnit = unitMap[currentUnitKey] || "day";
            // Find the new label for the current unit
            const newCurrentUnit = newItems.find(
              (item) => item.id === currentUnit,
            )?.id;

            // Update the form field with the new label (for the select component)
            if (typeof newCurrentUnit === "string") {
              setValue("applicationTimeLimitUnit", newCurrentUnit);
            }
          },
        })}
      >
        <TextField
          required
          fullWidth
          type="number"
          label={t("active.form.timeLimitForUsage.interval.label")}
          id="application-time-limit-interval"
          suffix={{
            type: "text",
            value: timeUnitDisplayedValue,
          }}
        />
      </FormField>
    </div>
  );
};
