import {
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
import { Member, MemberAddress } from '#libs/member/types';

import {
  insertMemberProfileDataToAnswer,
  get_custom_form_sign_question_label,
} from '../utils';

const memberProfileData: Omit<Member, 'address'> &
  MemberAddress & {
    accept_email: boolean;
    accept_sms: boolean;
    waiver_accepted: string;
  } = {
  firstname: 'Chuck',
  lastname: 'Norris',
  email: 'chuchNorris@gmai.com',
  gender: 'F',
  phone_number: '+3301234567',
  birthday: '1995/10/06',
  address: {
    address_line_1: 'address 1',
    address_line_2: 'address 2',
    city: 'Paris',
    zipcode: '75018',
    country: 'France',
  },
  photo: 'image.png',
  emergency_contact: 'No one',
  vaccination_status: true,
  accept_email: true,
  accept_sms: false,
  id: 1,
  name: 'Chuck Norris',
  consumer: 1,
  date_joined: '',
  membership_ID: '1',
  internal_account: 1,
  barcode: '',
  credit_account_balance: 0,
  notes: [],
  tags: [],
  next_booking: '',
  previous_booking: '',
  billing_plans: '',
  files: '',
  general_terms_and_conditions_date_accepted: null,
  general_terms_and_conditions_accepted: false,
  waiver_accepted: null,
  archived: false,
};

const customFormField = {
  id: 1,
  custom_form_id: 1,
  kind: 1,
  label: 'Question',
  disabled: false,
  choices: [''],
  mandatory: false,
  link_to_note: false,
  signup_question_kind: 1,
  editable: false,
};

describe('Utils: Custom form', () => {
  it('Check retrieve custom form label', () => {
    expect(get_custom_form_sign_question_label()).toStrictEqual({
      '100': 'password',
      '101': 'first_name',
      '102': 'last_name',
      '103': 'email',
      '104': 'gender',
      '105': 'phone',
      '106': 'birthday',
      '107': 'address_line_1',
      '108': 'address_line_2',
      '109': 'city',
      '110': 'zipcode',
      '111': 'country',
      '112': 'photo',
      '113': 'emergency_contact',
      '114': 'accept_email',
      '115': 'accept_sms',
      '116': 'vaccination_status',
      '117': 'general_terms_and_conditions',
      '118': 'waiver',
    });
  });

  it('Check retrieve custom form label', () => {
    const getCustFormFieldWithKind = (signup_question_kind: number) => ({
      ...customFormField,
      signup_question_kind,
    });

    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_FIRST_NAME),
        memberProfileData,
      ),
    ).toBe('Chuck');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_LAST_NAME),
        memberProfileData,
      ),
    ).toBe('Norris');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_EMAIL),
        memberProfileData,
      ),
    ).toBe('chuchNorris@gmai.com');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_GENDER),
        memberProfileData,
      ),
    ).toBe('F');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_PHONE),
        memberProfileData,
      ),
    ).toBe('+3301234567');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_BIRTHDAY),
        memberProfileData,
      ),
    ).toBe('1995/10/06');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_1),
        memberProfileData,
      ),
    ).toBe('address 1');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_ADDRESS_LINE_2),
        memberProfileData,
      ),
    ).toBe('address 2');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_CITY),
        memberProfileData,
      ),
    ).toBe('Paris');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_ZIPCODE),
        memberProfileData,
      ),
    ).toBe('75018');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_COUNTRY),
        memberProfileData,
      ),
    ).toBe('France');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_PHOTO),
        memberProfileData,
      ),
    ).toBe('image.png');
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_EMERGENCY_CONTACT),
        memberProfileData,
      ),
    ).toBe('No one');

    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_EMAIL),
        memberProfileData,
      ),
    ).toBeTruthy();
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_ACCEPT_SMS),
        memberProfileData,
      ),
    ).toBe(false);
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS),
        memberProfileData,
      ),
    ).toBe(1);
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_VACCINATION_STATUS),
        { ...memberProfileData, vaccination_status: false },
      ),
    ).toBe(2);
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(
          CUSTOM_FORM_FIELD_SIGN_UP_GENERAL_TERMS_AND_CONDITIONS,
        ),
        memberProfileData,
      ),
    ).toBe(false);
    expect(
      insertMemberProfileDataToAnswer(
        getCustFormFieldWithKind(CUSTOM_FORM_FIELD_SIGN_UP_WAIVER),
        memberProfileData,
      ),
    ).toBe(false);
  });
});
