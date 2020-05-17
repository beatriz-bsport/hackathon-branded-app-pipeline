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
  gender: 'gender',
  avatar: 'photo',
  barcode: 'barcode',
  birthday: 'birthday',
  membership_ID: 'membership_ID',
  rgpd: 'rgpd',
  date_joined: 'date_joined',
  address: 'address',
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
