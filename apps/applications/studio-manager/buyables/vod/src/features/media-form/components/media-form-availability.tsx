import type { FC } from "react";

import { useFormContext } from "@bsport/form";
import { FormNumberField } from "@bsport/kaizen-business-components/form/number-field";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "../constants";
import type { MediaFormData } from "../types";
import { FormCheckbox } from "./form-checkbox";

type MediaFormAvailabilityProps = {
  formId: string;
};

export const MediaFormAvailability: FC<MediaFormAvailabilityProps> = ({
  formId,
}) => {
  const { t } = useTranslation("media-form");
  const { watch } = useFormContext<MediaFormData>();

  const isRental = watch("is_rental");

  return (
    <div className="flex flex-col gap-md w-full">
      <FormCheckbox<MediaFormData>
        id={`${formId}-manager-only`}
        fieldName="manager_only"
        label={t("formFields.manager_only.label")}
        helperText={t("formFields.manager_only.helperText")}
      />

      <FormCheckbox<MediaFormData>
        id={`${formId}-rental-toggle`}
        fieldName="is_rental"
        label={t("formFields.rental.label")}
        helperText={t("formFields.rental.helperText")}
      />

      {isRental && (
        <div className="ml-element-xl">
          <FormNumberField<MediaFormData, "rental_days">
            fieldName="rental_days"
            id={`${formId}-rental-days`}
            min={FIELD_CONSTRAINTS.RENTAL_DAYS_MIN}
            label={t("formFields.rental_days.label")}
            helperText={t("formFields.rental_days.helperText")}
            required={isRental}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};
