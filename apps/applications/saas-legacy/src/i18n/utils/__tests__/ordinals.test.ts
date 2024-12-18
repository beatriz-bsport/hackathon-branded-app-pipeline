import { toOrdinal } from '../ordinals';

const MOCKS = {
  fr: [
    { number: 1, expected: '1er' },
    { number: 2, expected: '2e' },
    { number: 3, expected: '3e' },
    { number: -4, expected: '-4e' },
    { number: 1.2, expected: '1er' },
    { number: 1293, expected: '1.293e' },
    { number: 1296, expected: '1.296e' },
  ],
  'en-GB': [
    { number: 0, expected: '0th' },
    { number: 1, expected: '1st' },
    { number: 2, expected: '2nd' },
    { number: 3, expected: '3rd' },
    { number: 11, expected: '11th' },
    { number: -4, expected: '-4th' },
    { number: 1.2, expected: '1st' },
    { number: 1293, expected: '1,293rd' },
    { number: 1296, expected: '1,296th' },
  ],
  'en-US': [
    { number: 0, expected: '0th' },
    { number: 1, expected: '1st' },
    { number: 2, expected: '2nd' },
    { number: 3, expected: '3rd' },
    { number: 11, expected: '11th' },
    { number: -4, expected: '-4th' },
    { number: 1.2, expected: '1st' },
    { number: 1293, expected: '1,293rd' },
    { number: 1296, expected: '1,296th' },
  ],
  es: [
    { number: 0, expected: '0°' },
    { number: 1, expected: '1ro' },
    { number: 2, expected: '2do' },
    { number: 3, expected: '3ro' },
    { number: -4, expected: '-4°' },
    { number: 1.2, expected: '1ro' },
    { number: 1293, expected: '1.293°' },
    { number: 1296, expected: '1.296°' },
  ],
  nl: [
    { number: 0, expected: '0e' },
    { number: 1, expected: '1e' },
    { number: 2, expected: '2e' },
    { number: 3, expected: '3e' },
    { number: -4, expected: '-4e' },
    { number: 1.2, expected: '1e' },
    { number: 1293, expected: '1.293e' },
    { number: 1296, expected: '1.296e' },
  ],
  pt: [
    { number: 0, expected: '0°' },
    { number: 1, expected: '1˚' },
    { number: 2, expected: '2°' },
    { number: 3, expected: '3°' },
    { number: -4, expected: '-4°' },
    { number: 1.2, expected: '1˚' },
    { number: 1293, expected: '1.293°' },
    { number: 1296, expected: '1.296°' },
  ],
  it: [
    { number: 0, expected: '0°' },
    { number: 1, expected: '1˚' },
    { number: 2, expected: '2°' },
    { number: 3, expected: '3°' },
    { number: -4, expected: '-4°' },
    { number: 1.2, expected: '1˚' },
    { number: 1293, expected: '1.293°' },
    { number: 1296, expected: '1.296°' },
  ],
  de: [
    { number: 0, expected: '0.' },
    { number: 1, expected: '1.' },
    { number: 2, expected: '2.' },
    { number: 3, expected: '3.' },
    { number: -4, expected: '-4.' },
    { number: 1.2, expected: '1.' },
    { number: 1293, expected: '1.293.' },
    { number: 1296, expected: '1.296.' },
  ],
  cs: [
    { number: 0, expected: '0°' },
    { number: 1, expected: '1°' },
    { number: 2, expected: '2°' },
    { number: 3, expected: '3°' },
    { number: -4, expected: '-4°' },
    { number: 1.2, expected: '1°' },
    { number: 1293, expected: '1.293°' },
    { number: 1296, expected: '1.296°' },
  ],
} as const;

describe('toOrdinal converts number to ordinals based on language', () => {
  Object.entries(MOCKS).forEach(([lang, tests]) => {
    it(`should translate in language: ${lang}`, () => {
      tests.forEach(({ number, expected }) => {
        expect(toOrdinal(number, lang)).toBe(expected);
      });
    });
  });
});
