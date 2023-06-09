// @ts-nocheck
import { generateRandomInt } from '../utils/factories';

const emails: Array<string> = [
  'john@mail.com',
  'yo@yahoo.com',
  'jane@gmail.com',
  'jean.pierre@orange.fr',
  'yogacool@mail.com',
];

export function emails_factory(num_el: number): Array<string> {
  const emailArr = [];
  for (let i = 0; i < num_el; i += 1) {
    emailArr.push(emails[generateRandomInt(emails.length)]);
  }
  return emailArr;
}
