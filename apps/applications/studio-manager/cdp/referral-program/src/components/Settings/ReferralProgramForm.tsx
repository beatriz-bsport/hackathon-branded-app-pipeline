import { useId } from "react";

import { Form, FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { BASKET_MINIMAL_AMOUNT_DEFAULT } from "#src/utils/constants";
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
      className="flex flex-col gap-md"
      mode="onBlur"
    >
      <FormField<ReferralProgramFormData, "basketMinimalAmount">
        name="basketMinimalAmount"
        mapProps={({ defaultProps, field }) => ({
          ...defaultProps,
          type: "number",
          value: String(field.value ?? BASKET_MINIMAL_AMOUNT_DEFAULT), // Ensure value is a string
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
    </Form>
  );
};
