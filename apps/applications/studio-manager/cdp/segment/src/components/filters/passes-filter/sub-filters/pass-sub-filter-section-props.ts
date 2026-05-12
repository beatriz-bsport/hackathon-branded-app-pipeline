import type { FieldErrors, UseFormSetValue } from "react-hook-form";

import type { PassesFilterFormValue } from "../types";

/**
 * Props shared by every pass sub-filter section component.
 */
export type PassSubFilterSectionProps = {
  id: string;
  value: PassesFilterFormValue;
  errors: FieldErrors<PassesFilterFormValue>;
  setValue: UseFormSetValue<PassesFilterFormValue>;
  onRemove: () => void;
};
