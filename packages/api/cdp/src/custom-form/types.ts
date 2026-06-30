import type { PaginatedResponse } from "@bsport/store-base";

/**
 * Minimal custom form row for smartlist picker options.
 */
export type CustomForm = {
  id: number;
  name: string;
  date_created: string;
  disabled: boolean;
};

export type FetchCustomFormsParams = {
  page?: number;
  page_size?: number;
  disabled?: boolean;
  is_member_form?: boolean;
  is_signup?: boolean;
};

export type PaginatedCustomForms = PaginatedResponse<CustomForm>;
