import type { ReactElement } from "react";

import { type FieldPath, type FieldValues, FormField } from "@bsport/form";
import { Toggle, type ToggleProps } from "@bsport/kaizen-primitive-core";

import {
  useKaizenI18nInstance,
  useTranslation,
  withKaizenBusinessI18n,
} from "#src/i18n";

// Enforce the selected name to be within the FieldValues and to resolve to a number field
type BooleanFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: T[K] extends boolean ? K : never;
}[FieldPath<T>];

type FormToggleProps<
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  label: string;
} & Partial<ToggleProps>;

const FormToggleInner = <
  TFormValues extends FieldValues,
  TFieldName extends
    BooleanFieldPath<TFormValues> = BooleanFieldPath<TFormValues>,
>({
  id,
  fieldName,
  label,
  ...additionalProps
}: FormToggleProps<TFormValues, TFieldName>): ReactElement => {
  /** @todo Remove this after PoC of i18n is validated on deployment */
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("booking", { i18n: i18nInstance });

  return (
    <FormField<TFormValues, TFieldName, ToggleProps>
      name={fieldName}
      mapProps={({ defaultProps, field }) => {
        const { statusText: _, ...otherDefaultProps } = defaultProps;
        return {
          ...otherDefaultProps,
          ...(additionalProps ?? {}),
          // Required to avoid conflict with typing of Toggle.value
          value: "",
          checked: field.value,
        };
      }}
    >
      {/** @ts-expect-error Pass props implicitely - FormField is forwarding the `checked` props */}
      <Toggle id={id} label={`${label}-${t("helloWorld")}`} />
    </FormField>
  );
};

FormToggleInner.displayName = "KaizenFormToggle";

export const FormToggle = withKaizenBusinessI18n(
  FormToggleInner,
) as typeof FormToggleInner;
