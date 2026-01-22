import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const BookForAGuestField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isChecked = watch("allow_guest_offer");

  return (
    <FormField name="allow_guest_offer">
      <Toggle
        checked={isChecked}
        id={`${fieldIdPrefix}-book-for-a-guest-field`}
        label={t(
          "addSessionModal.steps.advancedOptions.bookForAGuest.fieldLabel",
        )}
      />
    </FormField>
  );
};
