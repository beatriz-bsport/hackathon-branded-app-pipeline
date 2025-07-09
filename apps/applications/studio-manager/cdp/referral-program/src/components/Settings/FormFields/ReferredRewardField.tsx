import React, { FC } from "react";

import { type ControlledFormProps, FormField } from "@bsport/form";
import {
  FormRadioGroup,
  FormRadioGroupProps,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { ReferringRewardRadioOptions } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import type { ReferralProgramFormData } from "#src/utils/types";

type Props = Omit<
  ControlledFormProps<ReferralProgramFormData>,
  "children" | "onSubmit"
> & { companyCurrency: string };

type AlertConfig = FormRadioGroupProps["options"][number]["alertConfig"];

export const ReferredRewardField: FC<Props> = ({
  companyCurrency,
  ...methods
}: Props) => {
  const { t } = useTranslation("settings");
  const { setValue, watch } = methods;
  const alertRewardEqualToZeroConfig: AlertConfig = {
    alert: {
      status: "warning",
      children: t("active.form.referralReward.alerts.equalToZero"),
    },
    position: "bottom",
  };

  const [
    referringRewardType,
    referringRewardAmount,
    referringRewardPercentage,
  ] = watch([
    "referringRewardType",
    "referringRewardAmount",
    "referringRewardPercentage",
  ]);

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h4" weight="strong">
        {t("active.form.referringReward.title")}
      </Title>

      <div className="flex flex-row gap-xl">
        <FormField<ReferralProgramFormData, "referringRewardType">
          name="referringRewardType"
          mapProps={({ defaultProps, field }) => ({
            ...defaultProps,
            value: String(field.value),
            onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => {
              field.onChange(event.target.value);
            },
          })}
        >
          <FormRadioGroup
            required
            className="gap-lg"
            id="radio-group-referring-reward-type"
            label={t("active.form.referralReward.label")}
            direction="start"
            options={[
              {
                id: "percent-off",
                value: ReferringRewardRadioOptions.Percentage,
                alertConfig:
                  referringRewardType ===
                    ReferringRewardRadioOptions.Percentage &&
                  referringRewardPercentage === 0
                    ? alertRewardEqualToZeroConfig
                    : undefined,
                element: (
                  <FormField<
                    ReferralProgramFormData,
                    "referringRewardPercentage"
                  >
                    name="referringRewardPercentage"
                    mapProps={({ defaultProps, field }) => ({
                      ...defaultProps,
                      value: String(field.value),
                      disabled:
                        referringRewardType !==
                        ReferringRewardRadioOptions.Percentage,
                    })}
                  >
                    <TextField
                      className="max-w-[160px] max-h-[32px]"
                      type="number"
                      id="referring-reward-percentage-off"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setValue(
                          "referringRewardPercentage",
                          Number(event.target.value),
                        );
                      }}
                      suffix={{
                        type: "text",
                        value: "%",
                      }}
                    />
                  </FormField>
                ),
              },
              {
                id: "amount-off",
                value: ReferringRewardRadioOptions.Amount,
                alertConfig:
                  referringRewardType === ReferringRewardRadioOptions.Amount &&
                  (parseFloat(referringRewardAmount) || 0) === 0
                    ? alertRewardEqualToZeroConfig
                    : undefined,

                element: (
                  <FormField<ReferralProgramFormData, "referringRewardAmount">
                    name="referringRewardAmount"
                    mapProps={({ defaultProps, field }) => ({
                      ...defaultProps,
                      value: String(field.value),
                      disabled:
                        referringRewardType !==
                        ReferringRewardRadioOptions.Amount,
                    })}
                  >
                    <TextField
                      className="max-w-[160px] max-h-[32px]"
                      type="number"
                      id="referring-reward-amount-off"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setValue("referringRewardAmount", event.target.value);
                      }}
                      suffix={{
                        type: "text",
                        value: companyCurrency,
                      }}
                    />
                  </FormField>
                ),
              },
            ]}
          />
        </FormField>
      </div>
    </div>
  );
};
