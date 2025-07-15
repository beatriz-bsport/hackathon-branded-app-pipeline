import type { FC } from "react";

import { type ControlledFormProps, FormField } from "@bsport/form";
import { Alert, TextField, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import type { ReferralProgramFormData } from "#src/utils/types";

type Props = Omit<
  ControlledFormProps<ReferralProgramFormData>,
  "children" | "onSubmit"
> & { companyCurrency: string };

export const ReferralRewardField: FC<Props> = ({
  companyCurrency,
  ...methods
}: Props) => {
  const { t } = useTranslation("settings");

  const { watch } = methods;

  const amountReferringReward = watch("amountReferringReward");

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h3" weight="strong">
        {t("active.form.referringReward.title")}
      </Title>
      <div className="flex flex-col gap-xs">
        <div className="flex flex-row gap-xl">
          <FormField<ReferralProgramFormData, "amountReferringReward">
            name="amountReferringReward"
            mapProps={({ defaultProps, field }) => ({
              ...defaultProps,
              type: "number",
              value: String(field.value),
              min: 0,
            })}
          >
            <TextField
              type="number"
              id="referring-amount-reward"
              label={t("active.form.referringReward.amountOff.label")}
              suffix={{
                type: "text",
                value: companyCurrency,
              }}
            />
          </FormField>
          <FormField<ReferralProgramFormData, "maxReferringUsage">
            name="maxReferringUsage"
            mapProps={({ defaultProps, field }) => ({
              ...defaultProps,
              type: "number",
              value: String(field.value),
              min: 1,
              max: 5,
            })}
          >
            <TextField
              required
              className="w-[60px]"
              type="number"
              id="referring-max-number-usage"
              label={t("active.form.referringReward.maxReferringNumber.label")}
            />
          </FormField>
        </div>
        {parseFloat(amountReferringReward) === 0 && (
          <Alert status="warning" className="w-fit">
            {t("active.form.referringReward.alerts.equalToZero")}
          </Alert>
        )}
      </div>
    </div>
  );
};
