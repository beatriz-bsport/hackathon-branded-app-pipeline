import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { useCreditFactor } from "@bsport/kaizen-business-components/buyables/credit-factor";
import { TextField } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionCreditsField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { creditFactor, getCreditsFieldLabel, getCreditsDividedDisplay } =
    useCreditFactor(companyTheme?.pass_credit_factor);

  const { watch } = useFormContext<SessionCreationFormData>();

  const credits = watch("credits");

  const helperText =
    creditFactor === 1
      ? t("addSessionModal.steps.configureSession.settings.credits.helperText")
      : t(
          "addSessionModal.steps.configureSession.settings.credits.decimalHelperText",
          { credits: getCreditsDividedDisplay(credits) },
        );

  return (
    <FormField<SessionCreationFormData, "credits">
      name="credits"
      mapProps={({ defaultProps }) => ({
        ...defaultProps,
        value: String(defaultProps.value ?? ""),
        onChange: (e) => {
          const numValue = parseInt(e.target.value, 10);
          defaultProps.onChange(isNaN(numValue) ? 0 : Math.max(0, numValue));
        },
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-session-credits`}
        label={getCreditsFieldLabel()}
        required
        helperText={helperText}
        type="number"
      />
    </FormField>
  );
};
