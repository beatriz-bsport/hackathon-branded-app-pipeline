import {
  CUSTOM_FORM_FIELD_TITLE_OPTION,
  CUSTOM_FORM_FIELD_PARAGRAPH_OPTION,
  CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_RADIO_OPTION,
  CUSTOM_FORM_FIELD_CHECHBOX_OPTION,
  CUSTOM_FORM_FIELD_SELECT_OPTION,
  CUSTOM_FORM_FIELD_SIGNATURE_OPTION,
  CUSTOM_FORM_FIELD_FILE_OPTION,
  CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
  CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_GENDER,
  CUSTOM_FORM_FIELD_SIGN_UP_PHONE,
  CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY,
  CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1,
  CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2,
  CUSTOM_FORM_FIELD_SIGN_UP_CITY,
  CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE,
  CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
  CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
  CUSTOM_FORM_FIELD_SIGN_UP_WAIVER,
} from '@bsport/common/lib/master-data/custom-form';
import type {
  CustomFormField,
  CustomFormFilledAPI,
  CustomFormFieldAnswerAPI,
  Layout,
} from './types';
import type { UserProfile } from '../member/types';
import { Member, MemberAddress } from '../member/types';

export const ALL_CUSTOM_FORM_SIGNUP_KIND_LIST = [
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
  CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_GENDER,
  CUSTOM_FORM_FIELD_SIGN_UP_PHONE,
  CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY,
  CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1,
  CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2,
  CUSTOM_FORM_FIELD_SIGN_UP_CITY,
  CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE,
  CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY,
  CUSTOM_FORM_FIELD_SIGN_UP_PHOTO,
  CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
  CUSTOM_FORM_FIELD_SIGN_UP_WAIVER,
  CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
];

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
  {
    label: 'sign_up_question',
    value: CUSTOM_FORM_FIELD_SIGNUP_QUESTION_OPTION,
  },
];

export const CUSTOM_FORM_FIELD_SIGNUP_QUESTIONS_CHOICES = [
  { label: 'first_name', value: CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME },
  { label: 'last_name', value: CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME },
  { label: 'email', value: CUSTOM_FORM_FIELD_SIGN_UP_EMAIL },
  { label: 'gender', value: CUSTOM_FORM_FIELD_SIGN_UP_GENDER },
  { label: 'phone', value: CUSTOM_FORM_FIELD_SIGN_UP_PHONE },
  { label: 'birthday', value: CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY },
  { label: 'address_line_1', value: CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1 },
  { label: 'address_line_2', value: CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2 },
  { label: 'city', value: CUSTOM_FORM_FIELD_SIGN_UP_CITY },
  { label: 'zipcode', value: CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE },
  { label: 'country', value: CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY },
  { label: 'photo', value: CUSTOM_FORM_FIELD_SIGN_UP_PHOTO },
  {
    label: 'emergency_contact',
    value: CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT,
  },
  { label: 'accept_email', value: CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL },
  { label: 'accept_sms', value: CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS },
  {
    label: 'vaccination_status',
    value: CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS,
  },
  { label: 'waiver', value: CUSTOM_FORM_FIELD_SIGN_UP_WAIVER },
  {
    label: 'general_terms_and_conditions',
    value: CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
  },
];

export const get_custom_form_sign_question_label = () => {
  return CUSTOM_FORM_FIELD_SIGNUP_QUESTIONS_CHOICES.reduce(
    (acc: { [key: number]: string }, pp: { value: number; label: string }) => {
      acc[pp.value] = pp.label;
      return acc;
    },
    { [CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD]: 'password' },
  );
};
export const CUSTOM_FORM_FIELDS_WITH_CHOICES = [
  CUSTOM_FORM_FIELD_RADIO_OPTION,
  CUSTOM_FORM_FIELD_CHECHBOX_OPTION,
  CUSTOM_FORM_FIELD_SELECT_OPTION,
];

export const CUSTOM_FORM_FIELD_LINKABLE_TO_NOTE = [
  CUSTOM_FORM_FIELD_SHORT_ANSWER_OPTION,
  CUSTOM_FORM_FIELD_LONG_ANSWER_OPTION,
];

export const CUSTOM_FORM_IMMUTABLE_SIGNUP_FIELDS = [
  CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
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

export const layoutBuilder = (custom_form_field: Array<CustomFormField>) =>
  custom_form_field
    ? [
        ...custom_form_field?.reduce(
          (
            acc: { y: number; layout: Array<Layout> },
            field: CustomFormField,
          ) => {
            acc.layout.push({
              x: 0,
              y: acc.y || 0,
              h:
                field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PHOTO
                  ? 2
                  : 1,
              i: field.id.toString(),
              w: 12,
              minW: 4,
              maxW: 12,
            });
            acc.y +=
              field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PHOTO
                ? 2
                : 1;
            return acc;
          },
          { y: 0, layout: [] },
        ).layout,
      ]
    : [];

export const layoutsBuilder = (custom_form_field: Array<CustomFormField>) => {
  const layout = layoutBuilder(custom_form_field);
  return {
    lg: layout,
    md: layout,
    sm: layout,
    xs: layout,
  };
};

export const insertUserProfileDataToAnswer = (
  customFormField: CustomFormField,
  UserProfileData: UserProfile,
) => {
  switch (customFormField.signup_question_kind) {
    case CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME:
      return UserProfileData?.first_name;
    case CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME:
      return UserProfileData?.last_name;
    case CUSTOM_FORM_FIELD_SIGN_UP_EMAIL:
      return UserProfileData?.email;
    case CUSTOM_FORM_FIELD_SIGN_UP_GENDER:
      return UserProfileData?.gender;
    case CUSTOM_FORM_FIELD_SIGN_UP_PHONE:
      return UserProfileData?.phone;
    case CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY:
      return UserProfileData?.birthday;
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1:
      return UserProfileData?.address?.address_line_1;
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2:
      return UserProfileData?.address?.address_line_2;
    case CUSTOM_FORM_FIELD_SIGN_UP_CITY:
      return UserProfileData?.address?.city;
    case CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE:
      return UserProfileData?.address?.zipcode;
    case CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY:
      return UserProfileData?.address?.country;
    case CUSTOM_FORM_FIELD_SIGN_UP_PHOTO:
      return UserProfileData?.photo;
    case CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT:
      return UserProfileData?.emergency_contact;
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL:
      return true;
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS:
      return true;
    case CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS:
      if (UserProfileData?.vaccination_status === true) {
        return 1;
      }
      if (UserProfileData?.vaccination_status === false) {
        return 2;
      }
      return 0;
    case CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS:
      return true;
    case CUSTOM_FORM_FIELD_SIGN_UP_WAIVER:
      return true;
    default:
      return null;
  }
};

export const insertMemberProfileDataToAnswer = (
  customFormField: CustomFormField,
  memberProfileData: Member &
    MemberAddress & {
      accept_email: boolean;
      accept_sms: boolean;
      waiver_accepted: string;
    },
) => {
  switch (customFormField.signup_question_kind) {
    case CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME:
      return memberProfileData?.firstname;
    case CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME:
      return memberProfileData?.lastname;
    case CUSTOM_FORM_FIELD_SIGN_UP_EMAIL:
      return memberProfileData?.email;
    case CUSTOM_FORM_FIELD_SIGN_UP_GENDER:
      return memberProfileData?.gender;
    case CUSTOM_FORM_FIELD_SIGN_UP_PHONE:
      return memberProfileData?.phone_number;
    case CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY:
      return memberProfileData?.birthday;
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1:
      return memberProfileData?.address?.address_line_1;
    case CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2:
      return memberProfileData?.address?.address_line_2;
    case CUSTOM_FORM_FIELD_SIGN_UP_CITY:
      return memberProfileData?.address?.city;
    case CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE:
      return memberProfileData?.address?.zipcode;
    case CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY:
      return memberProfileData?.address?.country;
    case CUSTOM_FORM_FIELD_SIGN_UP_PHOTO:
      return memberProfileData?.photo;
    case CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT:
      return memberProfileData?.emergency_contact;
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL:
      return memberProfileData?.accept_email;
    case CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS:
      return memberProfileData?.accept_sms;
    case CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS:
      if (memberProfileData?.vaccination_status === true) {
        return 1;
      }
      if (memberProfileData?.vaccination_status === false) {
        return 2;
      }
      return 0;
    case CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS:
      return !!memberProfileData?.general_terms_and_conditions_accepted;
    case CUSTOM_FORM_FIELD_SIGN_UP_WAIVER:
      return !!memberProfileData?.waiver_accepted;
    default:
      return null;
  }
};
export const CUSTOM_FORM_FIELD_LOCATION_OPTION = 10;
