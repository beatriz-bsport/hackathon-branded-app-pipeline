function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

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
    emailArr.push(emails[random_int(emails.length)]);
  }
  return emailArr;
}
