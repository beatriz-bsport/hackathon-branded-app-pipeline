import { type ReactElement, useId } from "react";

import { type FieldValues, useFormContext } from "@bsport/form";
import type { ToggleProps } from "@bsport/kaizen-primitive-core";
import { type Features, checkFeaturePermission } from "@bsport/permissions";

import { FormToggle } from "#src/components/form/toggle";
import { i18nInstance, useTranslation } from "#src/i18n";
import type { BooleanFieldPath } from "#src/utils/form-types";

export const UPSELL_IDENTIFIER_KISI_INTEGRATION = 40;
export const UPSELL_IDENTIFIER_ACCESS_MONITORING = 34;

type AccessControlToggleProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  TOnlyVodFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  fieldName: TFieldName;
  /**
   * Optional sibling boolean field that must be reset to `false` whenever the
   * access toggle is turned on (mutually exclusive access modes).
   */
  onlyVodAccessFieldName?: TOnlyVodFieldName;
  /** Company features used to gate the toggle behind the Kisi-related upsells. */
  features: Features | undefined;
  /** Whether the current object (pass, pack, …) is eligible for access control. */
  isObjectValidForAccessControl: boolean;
  id?: string;
  formId?: string;
} & Partial<ToggleProps>;

export const AccessControlToggle = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
  TOnlyVodFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  formId,
  id,
  fieldName,
  onlyVodAccessFieldName,
  features,
  isObjectValidForAccessControl,
  ...toggleProps
}: AccessControlToggleProps<
  TFormValues,
  TFieldName,
  TOnlyVodFieldName
>): ReactElement | null => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });
  const form = useFormContext<TFormValues>();

  const defaultFormId = useId();
  const finalFormId = `${formId ?? defaultFormId}-access-control-toggle`;
  const finalId = id ?? finalFormId;

  const hasAccessControlFeature =
    checkFeaturePermission({
      features,
      identifier: UPSELL_IDENTIFIER_KISI_INTEGRATION,
    }) ||
    checkFeaturePermission({
      features,
      identifier: UPSELL_IDENTIFIER_ACCESS_MONITORING,
    });

  if (!hasAccessControlFeature || !isObjectValidForAccessControl) {
    return null;
  }

  return (
    <FormToggle<TFormValues, TFieldName>
      id={finalId}
      fieldName={fieldName}
      label={t("accessControlToggle.label")}
      helperText={t("accessControlToggle.helperText")}
      onChangeCallback={(nextValue) => {
        if (nextValue && onlyVodAccessFieldName) {
          form.setValue(onlyVodAccessFieldName, false as never, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }}
      {...toggleProps}
    />
  );
};

AccessControlToggle.displayName = "KaizenAccessControlToggle";
