// Data model for custom forms

export type CustomForm = {
  id: number;
  name: string;
  date_created: string;
  disabled: boolean;
  custom_form_field: CustomFormField[];
  layout: {
    lg?: CustomFormFieldLayout[];
    md?: CustomFormFieldLayout[];
    sm?: CustomFormFieldLayout[];
    xs?: CustomFormFieldLayout[];
  };
  is_signup: boolean;
  is_member_form: boolean;
  layout_configuration: Record<string, number>;
};

export type CustomFormStatistics = {
  id: number;
  name: string;
  date_created: string;
  disabled: boolean;
  detail_by_member: Record<
    number,
    {
      completed: boolean;
      display_request: number[];
    }
  >;
};

export type CustomFormFieldTagRule = {
  id: number;
  custom_form_field_id: number;
  tag_id: number;
  answer_for_tag: string;
};

export type CustomFormField = {
  id: number;
  custom_form_id: number;
  kind: number;
  label: string;
  disabled: boolean;
  choices: string[];
  mandatory: boolean;
  field_index: number;
  custom_form_field_tag_rule: CustomFormFieldTagRule[];
  link_to_note: boolean;
  signup_question_kind: number | null;
  editable: boolean;
  action: number;
  datatype: number | null;
};

export type CustomFormFieldLayout = {
  h?: number;
  i?: string;
  w?: number;
  x?: number;
  y?: number;
  maxW?: number;
  minW?: number;
  moved?: boolean;
  static?: boolean;
};

// API Params
type PaginationParams = {
  page?: number;
  page_size?: number;
};

export type CreateCustomFormParams = {
  name: string;
};

export type DisableCustomFormParams = {
  id: number;
};

export type DuplicateCustomFormParams = {
  id: number;
};

export type RestoreCustomFormParams = {
  id: number;
};
export type FetchPaginatedCustomFormParams = {
  disabled?: boolean;
  is_member_form?: boolean;
  is_signup?: boolean;
} & PaginationParams;

export type FuzzySearchCustomFormParams = {
  queryString: string;
} & FetchPaginatedCustomFormParams;

export type FetchCustomFromsStatisticsParams = PaginationParams;
