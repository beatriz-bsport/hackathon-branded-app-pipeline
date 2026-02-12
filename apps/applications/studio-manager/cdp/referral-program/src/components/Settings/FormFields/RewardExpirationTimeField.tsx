import { type FC, useState } from "react";

import { type ControlledFormProps, FormField } from "@bsport/form";
import {
  type MenuOption,
  Select,
  type SelectProps,
  TextField,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { type ReferralProgramFormData, timeUnits } from "#src/utils/types";

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
  const { watch } = methods;

  const watchedApplicationTimeLimitUnit = watch("applicationTimeLimitUnit");

  const getItems = (interval: number): MenuOption[] => {
    return timeUnits.map((unit) => ({
      id: unit,
      label: String(
        // @ts-expect-error - TypeScript does not recognize the dynamic nature of the label
        t(`active.form.timeLimitForUsage.unit.choices.${unit}`, {
          count: interval,
        }),
      ), // e.g., "day" vs "days"
    }));
  };

  const items = getItems(timeLimitIntervalCounter);

  const timeUnitDisplayedValue = String(
    t(
      // @ts-expect-error - TypeScript does not recognize the dynamic nature of the label
      `active.form.timeLimitForUsage.unit.choices.${watchedApplicationTimeLimitUnit}`,
      {
        count: timeLimitIntervalCounter,
      },
    ),
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
          onChange: (option: string) => {
            field.onChange(option);
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
          items={items}
          value={watchedApplicationTimeLimitUnit}
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
            field.onChange(event.target.value);
            setTimeLimitIntervalCounter(newInterval);
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
