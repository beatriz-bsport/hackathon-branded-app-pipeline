import { FC } from "react";

import { FormField } from "@bsport/form";
import { TextField, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import type { ReferralProgramFormData } from "#src/utils/types";

type Props = { companyCurrency: string };

export const ReferralRewardField: FC<Props> = ({ companyCurrency }: Props) => {
  const { t } = useTranslation("settings");

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h4" weight="strong">
        {t("active.form.referringReward.title")}
      </Title>
      <div className="flex flex-row gap-xl">
        <FormField<ReferralProgramFormData, "amountReferringReward">
          name="amountReferringReward"
          mapProps={({ defaultProps, field }) => ({
            ...defaultProps,
            type: "number",
            value: String(field.value),
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
          })}
        >
          <TextField
            required
            className="max-w-[60px]"
            type="number"
            id="referring-max-number-usage"
            label={t("active.form.referringReward.maxReferringNumber.label")}
          />
        </FormField>
      </div>
    </div>
  );
};
