import { type ReactElement, useId } from "react";

import type { FieldValues } from "@bsport/form";
import type { ToggleProps } from "@bsport/kaizen-primitive-core";

import { FormToggle } from "#src/components/form/toggle";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath } from "#src/utils/form-types";

type PassFormGuestBookingToggleProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  id?: string;
  formId?: string;
} & Partial<ToggleProps>;

export const PassFormGuestBookingToggle = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  formId,
  id,
  fieldName,
  ...toggleProps
}: PassFormGuestBookingToggleProps<TFormValues, TFieldName>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const defaultFormId = useId();
  const finalFormId = `${formId ?? defaultFormId}-guest-booking-toggle`;
  const finalId = id ?? finalFormId;

  return (
    <FormToggle<TFormValues, TFieldName>
      id={finalId}
      fieldName={fieldName}
      label={t("passForm.guestBookingToggle.label")}
      {...toggleProps}
    />
  );
};

PassFormGuestBookingToggle.displayName = "KaizenPassFormGuestBookingToggle";
