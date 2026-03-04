import { type ChangeEvent, type ReactElement, useState } from "react";

import { getCurrencyDisplay } from "@bsport/currency";
import { type FieldPath, type FieldValues, FormField } from "@bsport/form";
import { TextField, type TextFieldProps } from "@bsport/kaizen-primitive-core";

type NumberFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: T[K] extends number | null ? K : never;
}[FieldPath<T>];

type FormPriceFieldProps<
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
> = {
  id: string;
  fieldName: TFieldName;
  /** Minimum allowed value in cents (default: 0) */
  minCts?: number;
  /** Maximum allowed value in cents (no limit when omitted) */
  maxCts?: number;
  /** Allow decimal amounts (default: true). When false, only whole amounts are accepted. */
  allowDecimals?: boolean;
  /** Text to display as currency indicator (defaults to getCurrencyDisplay()) */
  currencyDisplayText?: string;
  /** Where to display the currency indicator (default: "suffix") */
  currencyDisplay?: "prefix" | "suffix";
  /** Called when the parsed price changes (on every keystroke). */
  onPriceChange?: (cts: number) => void;
} & Partial<TextFieldProps>;

export const FormPriceField = <
  TFormValues extends FieldValues,
  TFieldName extends
    NumberFieldPath<TFormValues> = NumberFieldPath<TFormValues>,
>({
  id,
  fieldName,
  minCts = 0,
  maxCts,
  allowDecimals = true,
  currencyDisplayText,
  currencyDisplay = "suffix",
  className,
  onPriceChange,
  ...additionalProps
}: FormPriceFieldProps<TFormValues, TFieldName>): ReactElement => {
  const displayText = currencyDisplayText ?? getCurrencyDisplay();
  const currencyAdornment = { type: "text" as const, value: displayText };

  // Preserve the raw input while typing so "10.0" isn't reformatted to "10" mid-edit
  const [local, setLocal] = useState<{
    display: string;
    cts: number;
  } | null>(null);

  return (
    <FormField<TFormValues, TFieldName, TextFieldProps>
      name={fieldName}
      mapProps={({ defaultProps }) => {
        const valueCts =
          typeof defaultProps.value === "number" ? defaultProps.value : 0;

        const formatted = allowDecimals
          ? (valueCts / 100).toFixed(2)
          : String(Math.trunc(valueCts / 100));

        const showLocal = local !== null && local.cts === valueCts;

        return {
          ...defaultProps,
          ...additionalProps,
          value: showLocal ? local.display : formatted,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const raw = e.target.value;
            if (raw === "") {
              setLocal({ display: "", cts: 0 });
              defaultProps.onChange(0);
              onPriceChange?.(0);
              return;
            }
            const parsed = parseFloat(raw);
            if (!Number.isFinite(parsed) || parsed < 0) return;
            if (!allowDecimals && !Number.isInteger(parsed)) return;
            const cts = Math.round(parsed * 100);
            const clamped = Math.max(
              minCts,
              maxCts != null ? Math.min(maxCts, cts) : cts,
            );
            setLocal({ display: raw, cts: clamped });
            defaultProps.onChange(clamped);
            onPriceChange?.(clamped);
          },
          onBlur: () => setLocal(null),
        };
      }}
    >
      <TextField
        id={id}
        className={className ?? ""}
        type="number"
        min={minCts / 100}
        max={maxCts != null ? maxCts / 100 : undefined}
        step={allowDecimals ? 0.01 : 1}
        inputMode={allowDecimals ? "decimal" : "numeric"}
        {...(currencyDisplay === "prefix"
          ? { prefix: currencyAdornment }
          : { suffix: currencyAdornment })}
      />
    </FormField>
  );
};
