export type CustomForm = {
  id: number;
  company: number;
  name: string;
  date_created: string;
  disabled: boolean;
  url: string;
  custom_form_field: Array<CustomFormField>;
  display_rules: Array<CustomFormDisplayRule>;
};

export type FormikCustomForm = {
  id: number;
  company: number;
  name: string;
  date_created: string;
  disabled: boolean;
  url: string;
  custom_form_field: Array<CustomFormField>;
  custom_form_field_enabled: Array<CustomFormField>;
  custom_form_field_disabled: Array<CustomFormField>;
};
export type CustomFormField = {
  id: number;
  custom_form_id: number;
  kind: number;
  label: string;
  disabled: boolean;
  choices: Array<string>;
  mandatory: boolean;
  link_to_note: boolean;
};

export type CustomFormState = {
  allIds: Array<number>;
  byId: { [id: number]: CustomForm };
  loading: boolean;
  error?: Error;
  upsert: {
    loading: boolean;
    error: Error;
  };
  filled: {
    byId: { [id: number]: CustomFormFilledAPI };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
  };
  statistics: {
    byId: { [id: number]: CustomFromStatistics };
    allIds: Array<number>;
    loading: boolean;
    error: Error;
  };
  display_rule: {
    byId: { [id: number]: CustomFormDisplayRule };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
  };
};

export type CustomFormFilled = {
  id: number;
  company: number;
  name: string;
  date_created: string;
  disabled: boolean;
  url: string;
  custom_form_field: Array<CustomFormFieldAnswer>;
  is_draft: boolean;
};

export type CustomFormFieldAnswer = {
  id: number;
  custom_form_id: number;
  kind: number;
  label: string;
  disabled: boolean;
  choices: Array<string>;
  mandatory: boolean;
  answer: string | any;
};

export type CustomFormFilledAPI = {
  id: number;
  custom_form_id: number;
  member_id: number;
  date_created: string;
  custom_form_field: Array<CustomFormFieldAnswerAPI>;
  is_draft: boolean;
};

export type CustomFormFieldAnswerAPI = {
  id: number;
  custom_form_filled_id: number;
  custom_form_field_id: number;
  text_answer: null | string;
  file_answer: null | File;
  image_answer: null | File;
  choices_answer: null | Array<string>;
};

export type StatisticsByMember = {
  completed: boolean;
  display_request: Array<number>;
};
export type CustomFromStatistics = {
  id: number;
  name: string;
  date_created: string;
  disabled: boolean;
  detail_by_member: { [memberId: number]: StatisticsByMember };
  allMemberIds: Array<number>;
};

export type CustomFormDisplayRule<C = number> = {
  id: number;
  custom_form_id: C;
  kind: number;
  date_created: string;
  timedelta_day_before_display: number;
  force_display: boolean;
  disabled: boolean;
  snoozable: boolean;
  timedelta_after_snooze: number;
};
