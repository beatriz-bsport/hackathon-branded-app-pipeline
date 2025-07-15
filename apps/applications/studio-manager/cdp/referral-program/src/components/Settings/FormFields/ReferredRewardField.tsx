import React, { type FC } from "react";

import { type ControlledFormProps, FormField } from "@bsport/form";
import {
  FormRadioGroup,
  type FormRadioGroupProps,
  TextField,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  type ReferralProgramFormData,
  type ReferringRewardOptionType,
  referringRewardTypeValues,
} from "#src/utils/types";

function isReferringRewardOptionType(
  value: string,
): value is ReferringRewardOptionType {
  console.log(value);
  return (
    value === referringRewardTypeValues.amount ||
    value === referringRewardTypeValues.percentage
  );
}

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
  const radioOptionMap: Record<ReferringRewardOptionType, string> = {
    amount_off: amountOptionLabel,
    percent_off: percentageOptionLabel,
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

  const getAlertToDisplay = (
    rewardType: ReferringRewardOptionType,
    rewardValue: string | number,
  ) => {
    const isZero = parseFloat(String(rewardValue)) === 0;
    const isSameField = rewardType === referringRewardType;
    return isSameField && isZero ? alertRewardEqualToZeroConfig : undefined;
  };

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h4" weight="strong">
        {t("active.form.referringReward.title")}
      </Title>
      <div className="flex flex-row gap-xl">
        <FormField<
          ReferralProgramFormData,
          "referringRewardType",
          FormRadioGroupProps
        >
          name="referringRewardType"
          mapProps={({ defaultProps, field }) => ({
            ...defaultProps,
            value: radioOptionMap[field.value],
            onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => {
              if (!isReferringRewardOptionType(event.target.id)) {
                return;
              }
              setValue("referringRewardType", event.target.id);
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
                id: "percent_off",
                value: radioOptionMap[referringRewardTypeValues.percentage],
                alertConfig: getAlertToDisplay(
                  referringRewardTypeValues.percentage,
                  referringRewardPercentage,
                ),
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
                      min: 0,
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
                id: "amount_off",
                value: radioOptionMap[referringRewardTypeValues.amount],
                alertConfig: getAlertToDisplay(
                  referringRewardTypeValues.amount,
                  referringRewardAmount,
                ),
                element: (
                  <FormField<ReferralProgramFormData, "referringRewardAmount">
                    name="referringRewardAmount"
                    mapProps={({ defaultProps, field }) => ({
                      ...defaultProps,
                      value: String(field.value),
                      disabled:
                        referringRewardType !==
                        referringRewardTypeValues.amount,
                      min: 0,
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
