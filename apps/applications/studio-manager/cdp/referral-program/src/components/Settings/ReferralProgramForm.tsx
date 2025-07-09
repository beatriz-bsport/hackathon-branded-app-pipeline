import { useId } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { ReferralRewardField } from "#src/components/Settings/FormFields/ReferralRewardField";
import { ReferredRewardField } from "#src/components/Settings/FormFields/ReferredRewardField";
import {
  AMOUNT_REFERRING_REWARD_DEFAULT,
  BASKET_MINIMAL_AMOUNT_DEFAULT,
  MAX_REFERRING_USAGE_DEFAULT,
  REFERRING_REWARD_AMOUNT_DEFAULT,
  REFERRING_REWARD_PERCENTAGE_DEFAULT,
  ReferringRewardRadioOptions,
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
  const fieldIdPrefix = useId();
  const { t } = useTranslation("settings");

  const defaultValues: ReferralProgramFormData = {
    basketMinimalAmount: BASKET_MINIMAL_AMOUNT_DEFAULT,
    amountReferringReward: AMOUNT_REFERRING_REWARD_DEFAULT,
    maxReferringUsage: MAX_REFERRING_USAGE_DEFAULT,
    referringRewardType: ReferringRewardRadioOptions.Amount,
    referringRewardAmount: REFERRING_REWARD_AMOUNT_DEFAULT,
    referringRewardPercentage: REFERRING_REWARD_PERCENTAGE_DEFAULT,
  };
  const methods = useFormController({
    mode: "onBlur",
    schema: referralProgramSchema,
    defaultValues,
  });

  return (
    <ControlledForm
      id="referral-program-form"
      onSubmit={(data) => console.log(data)}
      className="flex flex-col gap-lg"
      {...methods}
    >
      <FormField<ReferralProgramFormData, "basketMinimalAmount">
        name="basketMinimalAmount"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          type: "number",
          value: String(field.value),
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
      <ReferralRewardField companyCurrency={companyCurrency} />
      <ReferredRewardField companyCurrency={companyCurrency} {...methods} />
    </ControlledForm>
  );
};
