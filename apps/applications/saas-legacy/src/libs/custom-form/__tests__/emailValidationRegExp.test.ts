import { emailValidationRegExp } from '../constants';

describe('emailValidationRegExp', () => {
  const validEmails = [
    'user@example.com',
    'user.name@example.com',
    'user+tag@example.com',
    'user@sub.domain.com',
    'firstname.lastname@example.co.uk',
    'email@123.123.123.com',
    'user@example-domain.com',
    "user!#$%&'*+/=?^_`{|}~@example.com",
    'a@ab.cd',
    'user@a.com',
  ];

  const invalidEmails = [
    'j@h.v', // TLD too short (1 char)
    'user@domain.c', // TLD too short (1 char)
    '.user@example.com', // leading dot in local part
    'user.@example.com', // trailing dot in local part
    'user..name@example.com', // consecutive dots in local part
    'user@.example.com', // leading dot in domain
    'user@-example.com', // leading hyphen in domain label
    'user@example-.com', // trailing hyphen in domain label
    'user@example', // no TLD
    '@example.com', // no local part
    'user@', // no domain
    'user name@example.com', // space in local part
    'user@exam ple.com', // space in domain
    '', // empty string
    'user@exam_ple.com', // underscore in domain
  ];

  it.each(validEmails)('should accept valid email: %s', (email) => {
    expect(emailValidationRegExp.test(email)).toBe(true);
  });

  it.each(invalidEmails)('should reject invalid email: %s', (email) => {
    expect(emailValidationRegExp.test(email)).toBe(false);
  });
});
