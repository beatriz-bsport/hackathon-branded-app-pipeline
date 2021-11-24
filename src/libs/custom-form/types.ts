import { ErrorAndLoading } from '../types';

export type CustomForm = {
  id: number;
  company: number;
  name: string;
  date_created: string;
  disabled: boolean;
  url: string;
  custom_form_field: Array<CustomFormField>;
  display_rules: Array<CustomFormDisplayRule>;
  layout: ResponsiveLayouts;
  is_signup: boolean;
  is_member_form: boolean;
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
  signup_question_kind: number | null;
  editable: boolean;
};

export type CustomFormState = {
  allIds: Array<number>;
  byId: { [id: number]: CustomForm };
  upsert: ErrorAndLoading;
  layout: ErrorAndLoading;
  filled: {
    byId: { [id: number]: CustomFormFilledAPI };
    allIds: Array<number>;
  } & ErrorAndLoading;
  statistics: {
    byId: { [id: number]: CustomFromStatistics };
    allIds: Array<number>;
  } & ErrorAndLoading;
  display_rule: {
    byId: { [id: number]: CustomFormDisplayRule };
    allIds: Array<number>;
  } & ErrorAndLoading;
  signUp: {
    form: CustomForm | null;
  } & ErrorAndLoading;
  memberForm: {
    form: CustomForm | null;
  } & ErrorAndLoading;
  modelBasedAnswer: {
    byMemberId: {
      [memberId: number]: {
        [datatype: number]: { [kind: number]: ModelBasedAnswer };
      };
    };
  } & ErrorAndLoading;
} & ErrorAndLoading;

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
  signup_question_kind: number | null;
};

export type CustomFormFilledAPI = {
  id: number;
  custom_form_id: number;
  member_id: number;
  date_created: string;
  custom_form_field: Array<FormikCustomFormFieldAnswerAPI>;
  is_draft: boolean;
};

export type FormikCustomFormFieldAnswerAPI = {
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
export type Layout = {
  x: number;
  y: number;
  w: number;
  h: number;
  i: string;
  minW?: number;
  maxW?: number;
};
export type ResponsiveLayouts = {
  [key: string]: Array<Layout>;
};

export type ModelBasedAnswer = {
  custom_form_field: number;
  timestamp: string;
  label: string;
  kind: number;
  answer: Array<{ answer: Array<number>; timestamp: number }>;
  datatype: number;
};

export interface CustomFormFilledTagRule {
  answer_for_tag: string;
  custom_form_field_id: number;
  id: number;
  tag_id: number;
}

export interface FormikCustomFormFieldAnswer {
  id: number;
  kind: number;
  label: string;
  mandatory: boolean;
  custom_form_id: number;
  choices: Array<string>;
  answer: string | Array<string> | File;
  custom_form_field_tag_rule: Array<CustomFormFilledTagRule>;
}

export interface FormikCustomFormFilled {
  layout: Layout;
  id: number;
  name: string;
  disabled: boolean;
  date_created: string;
  custom_form_field: Array<FormikCustomFormFieldAnswer>;
}
