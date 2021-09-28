import type {
  CustomFormField,
  CustomFormFilledAPI,
  CustomFormFieldAnswerAPI,
} from './types';

export const CUSTOM_FORM_FIELD_TITLE_OPTION = 0;
export const CUSTOM_FORM_FIELD_PARAGRAPH_OPTION = 1;
export const CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION = 2;
export const CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION = 3;
export const CUSTOM_FORM_FIELD_RADIO_OPTION = 4;
export const CUSTOM_FORM_FIELD_CHECHBOX_OPTION = 5;
export const CUSTOM_FORM_FIELD_SELECT_OPTION = 6;
export const CUSTOM_FORM_FIELD_SIGNATURE_OPTION = 7;
export const CUSTOM_FORM_FIELD_FILE_OPTION = 8;

export const CUSTOM_FORM_FIELDS_OPTIONS = [
  { label: 'title', value: CUSTOM_FORM_FIELD_TITLE_OPTION },
  { label: 'paragraph', value: CUSTOM_FORM_FIELD_PARAGRAPH_OPTION },
  { label: 'short_answer', value: CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION },
  { label: 'long_answer', value: CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION },
  { label: 'radio', value: CUSTOM_FORM_FIELD_RADIO_OPTION },
  { label: 'check_box', value: CUSTOM_FORM_FIELD_CHECHBOX_OPTION },
  { label: 'select', value: CUSTOM_FORM_FIELD_SELECT_OPTION },
  { label: 'signature', value: CUSTOM_FORM_FIELD_SIGNATURE_OPTION },
  { label: 'file', value: CUSTOM_FORM_FIELD_FILE_OPTION },
];

export const CUSTOM_FORM_FIELDS_WITH_CHOICES = [
  CUSTOM_FORM_FIELD_RADIO_OPTION,
  CUSTOM_FORM_FIELD_CHECHBOX_OPTION,
  CUSTOM_FORM_FIELD_SELECT_OPTION,
];

export const CUSTOM_FORM_FIELD_LINKABLE_TO_NOTE = [
  CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION,
];

export const MAX_LENGTH_FOR_SHORT_ANSWER = 1000;
export const MAX_LENGTH_FOR_LONG_ANSWER = 10000;
export function checkDisabledHasAnswer(
  field: CustomFormField,
  form_filled_id: number,
  customFormFilledData: { [id: number]: CustomFormFilledAPI },
) {
  if (field.disabled) {
    const testFormFilledExists = customFormFilledData[
      form_filled_id
    ].custom_form_field_filled.find(
      (field_filled) =>
        field_filled.custom_form_filled_id ===
          customFormFilledData[form_filled_id].id && field_filled,
    );
    if (testFormFilledExists) {
      const testAnswerDataNotNull = customFormFilledData[
        form_filled_id
      ]?.custom_form_field_filled.find(
        (field_answer: CustomFormFieldAnswerAPI) =>
          field_answer.custom_form_field_id === field.id,
      );
      if (
        testAnswerDataNotNull &&
        (testAnswerDataNotNull.text_answer ||
          testAnswerDataNotNull.choices_answer ||
          testAnswerDataNotNull.image_answer ||
          testAnswerDataNotNull.file_answer)
      ) {
        return true;
      }
    }
  }
  return false;
}

export const CUSTOM_FORM_DISPLAY_ON_SIGN_UP = 0;
export const CUSTOM_FORM_DISPLAY_ON_CONNECTION = 1;

export const CUSTOM_FORM_SUBMITTION_COMPLETED = 0;
export const CUSTOM_FORM_SUBMITTION_DRAFT = 1;
export const CUSTOM_FORM_SUBMITTION_SNOOZED = 2;

export const ERROR_CUSTOM_FORM_DISPLAY_RULE_WITH_SAME_TIME_DELTA_ALREADY_EXISTS = 3;
