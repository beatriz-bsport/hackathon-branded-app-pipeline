import { type TextFieldProps } from "@bsport/kaizen-primitive-core";

/**
 * Control contract shared by every composer leaf field. It mirrors what
 * `@bsport/form`'s `FormField` injects into its child (react-hook-form's
 * `field` props plus `status`/`statusText`), so a leaf can be dropped
 * directly inside `<FormField name="…">` — or wired manually with
 * `watch`/`setValue`, segments-style.
 */
export type MessageComposerFieldControlProps = {
  value?: string;
  /** Called with the raw string value — react-hook-form's `field.onChange` accepts it as-is. */
  onChange?: (value: string) => void;
  onBlur?: () => void;
  status?: TextFieldProps["status"];
  statusText?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};
