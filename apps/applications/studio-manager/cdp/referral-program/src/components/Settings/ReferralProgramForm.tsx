import { useId } from "react";

import { ControlledForm, FormField, useFormController } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { ReferralRewardField } from "#src/components/Settings/FormFields/ReferralRewardField";
import { ReferredRewardField } from "#src/components/Settings/FormFields/ReferredRewardField";
import { RewardExpirationTimeField } from "#src/components/Settings/FormFields/RewardExpirationTimeField";
import {
  AMOUNT_REFERRING_REWARD_DEFAULT,
  APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT,
  APPLICATION_TIME_LIMIT_UNIT_DEFAULT,
  BASKET_MINIMAL_AMOUNT_DEFAULT,
  MAX_REFERRING_USAGE_DEFAULT,
  REFERRING_REWARD_AMOUNT_DEFAULT,
  REFERRING_REWARD_PERCENTAGE_DEFAULT,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";
import { referralProgramSchema } from "#src/utils/schema";
import {
  ReferralProgramFormData,
  referringRewardTypeValues,
} from "#src/utils/types";

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
    referringRewardType: referringRewardTypeValues.amount,
    referringRewardAmount: REFERRING_REWARD_AMOUNT_DEFAULT,
    referringRewardPercentage: REFERRING_REWARD_PERCENTAGE_DEFAULT,
    applicationTimeLimitInterval: APPLICATION_TIME_LIMIT_INTERVAL_DEFAULT,
    applicationTimeLimitUnit: APPLICATION_TIME_LIMIT_UNIT_DEFAULT,
  };
  const methods = useFormController({
    mode: "onBlur",
    schema: referralProgramSchema,
    defaultValues,
  });

  return (
    <ControlledForm
      id="referral-program-form"
      onSubmit={(data) => console.log("lol", data)}
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
      <RewardExpirationTimeField fieldIdPrefix={fieldIdPrefix} {...methods} />
    </ControlledForm>
  );
};
