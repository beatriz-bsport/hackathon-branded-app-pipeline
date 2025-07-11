import React, { FC } from "react";

import { type ControlledFormProps, FormField } from "@bsport/form";
import {
  FormRadioGroup,
  FormRadioGroupProps,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  type ReferralProgramFormData,
  type ReferrinRewardOptionType,
  referringRewardTypeValues,
} from "#src/utils/types";

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
  const alertRewardEqualToZeroConfig: AlertConfig = {
    alert: {
      status: "warning",
      children: t("active.form.referralReward.alerts.equalToZero"),
    },
    position: "bottom",
  };
  const percentageOptionLabel = t("active.form.referralReward.percentage");
  const amountOptionLabel = t("active.form.referralReward.amount");
  const radioOptionMap: Record<ReferrinRewardOptionType, string> = {
    "amount-off": amountOptionLabel,
    "percent-off": percentageOptionLabel,
  };

  const { setValue, watch } = methods;

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
            value: radioOptionMap[field.value as ReferrinRewardOptionType],
            onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => {
              setValue(
                "referringRewardType",
                event.target.id as ReferrinRewardOptionType,
              );
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
                value: radioOptionMap[referringRewardTypeValues.percentage],
                alertConfig:
                  referringRewardType ===
                    referringRewardTypeValues.percentage &&
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
                        referringRewardTypeValues.percentage,
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
                value: radioOptionMap[referringRewardTypeValues.amount],
                alertConfig:
                  referringRewardType === referringRewardTypeValues.amount &&
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
                        referringRewardTypeValues.amount,
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
