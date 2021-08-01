// @flow

export const MemberMap = {
  lastname: 'last_name',
  firstname: 'first_name',
  email: 'email',
  address_line_1: 'address.address_line_1',
  address_line_2: 'address.address_line_2',
  zipcode: 'address.zipcode',
  city: 'address.city',
  country: 'address.country',
  phone: 'phone.phone_number',
  emergency_contact: 'emergency_contact',
  gender: 'gender',
  avatar: 'photo',
  barcode: 'barcode',
  birthday: 'birthday',
  membership_ID: 'membership_ID',
  rgpd: 'rgpd',
  date_joined: 'date_joined',
  address: 'address',
  accept_email: 'accept_email',
  accept_sms: 'accept_sms',
  waiver: 'waiver',
  vaccination_status: 'vaccination_status',
};

export const anonymizeEmail = (email: ?string) => {
  if (!email || !email.includes('@')) {
    return email;
  }
  const [base, domain] = email.split('@');
  const anonymizedBase =
    base.slice(0, 2) + '*'.repeat(Math.max(base.length - 2, 0));
  return `${anonymizedBase}@${domain}`;
};

export const USER_STATUS_VALIDATION_WITH_USER_NOT_MEMBER_OF_COMPANY = 2;
export const USER_STATUS_VALIDATION_WITH_MEMBER_OF_COMPANY = 1;
export const USER_STATUS_VALIDATION_COMPLETED = 0;
