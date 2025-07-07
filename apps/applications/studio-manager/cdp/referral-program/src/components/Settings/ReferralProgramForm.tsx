import { useId } from "react";

import { Form, FormField } from "@bsport/form";
import { TextField, Title } from "@bsport/kaizen-primitive-core";

import {
  AMOUNT_REFERRING_REWARD_DEFAULT,
  BASKET_MINIMAL_AMOUNT_DEFAULT,
  MAX_REFERRING_USAGE_DEFAULT,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { referralProgramSchema } from "#src/utils/schema";
import { ReferralProgramFormData } from "#src/utils/types";

type ReferralProgramFormProps = {
  companyCurrency: string;
};

export const ReferralProgramForm: React.FC<ReferralProgramFormProps> = ({
  companyCurrency,
}: ReferralProgramFormProps) => {
  const { t } = useTranslation("settings");
  const fieldIdPrefix = useId();

  return (
    <Form
      id="referral-program-form"
      schema={referralProgramSchema}
      onSubmit={(data) => console.log(data)}
      className="flex flex-col gap-lg"
      mode="onBlur"
    >
      <FormField<ReferralProgramFormData, "basketMinimalAmount">
        name="basketMinimalAmount"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          type: "number",
          value: String(field.value ?? BASKET_MINIMAL_AMOUNT_DEFAULT),
        })}
      >
        <TextField
          type="number"
          id={`${fieldIdPrefix}-referral-program-basket-minimal-amount`}
          label={t("active.form.basketMinimalAmount.label")}
          helperText={t("active.form.basketMinimalAmount.helper")}
          suffix={{
            type: "text",
            value: companyCurrency,
          }}
        />
      </FormField>
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
              value: String(field.value ?? AMOUNT_REFERRING_REWARD_DEFAULT),
            })}
          >
            <TextField
              type="number"
              id={`${fieldIdPrefix}-referring-amount-reward`}
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
              value: String(field.value ?? MAX_REFERRING_USAGE_DEFAULT),
            })}
          >
            <TextField
              required
              className="max-w-[60px]"
              type="number"
              id={`${fieldIdPrefix}-referring-max-number-usage`}
              label={t("active.form.referringReward.maxReferringNumber.label")}
            />
          </FormField>
        </div>
      </div>
    </Form>
  );
};
