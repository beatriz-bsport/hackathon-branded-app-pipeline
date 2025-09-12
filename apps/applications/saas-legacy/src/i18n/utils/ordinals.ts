import { AVAILABLE_LANGUAGES, LANGUAGES } from '../languages';

type Lng = (typeof AVAILABLE_LANGUAGES)[number];

// Based on this doc: https://www.beresfordresearch.com/ordinal-numbers-from-around-the-world/
const NUMERABLE_BY_LOCALE: {
  [Locale in Lng]: {
    delimiter: {
      thousands: string;
    };
    getOrdinalSuffix: (num: number) => string;
  };
} = {
  [LANGUAGES.ENGLISH_BRITISH]: {
    delimiter: {
      thousands: ',',
    },
    getOrdinalSuffix(num: number) {
      const firstInt = num % 10;
      if (firstInt === 1 && num !== 11) {
        return 'st';
      }
      if (firstInt === 2) {
        return 'nd';
      }
      if (firstInt === 3) {
        return 'rd';
      }
      return 'th';
    },
  },
  [LANGUAGES.ENGLISH_US]: {
    delimiter: {
      thousands: ',',
    },
    getOrdinalSuffix(num: number) {
      const firstInt = num % 10;
      if (firstInt === 1 && num !== 11) {
        return 'st';
      }
      if (firstInt === 2) {
        return 'nd';
      }
      if (firstInt === 3) {
        return 'rd';
      }
      return 'th';
    },
  },
  [LANGUAGES.FRENCH]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix(num) {
      return num === 1 ? 'er' : 'e';
    },
  },
  [LANGUAGES.DEBUG]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix(num) {
      return num === 1 ? 'er' : 'e';
    },
  },
  [LANGUAGES.SPANISH]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix(num) {
      if (num === 1 || num === 3) {
        return 'ro';
      }
      if (num === 2) {
        return 'do';
      }
      return '°';
    },
  },
  [LANGUAGES.DUTCH]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix() {
      return 'e';
    },
  },
  [LANGUAGES.PORTUGUESE]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix(num) {
      return num === 1 ? '˚' : '°';
    },
  },
  [LANGUAGES.ITALIAN]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix(num) {
      return num === 1 ? '˚' : '°';
    },
  },
  [LANGUAGES.GERMAN]: {
    delimiter: {
      thousands: '.',
    },
    getOrdinalSuffix() {
      return '.';
    },
  },
};

/**
 * Internal function splitting a positive integer into an array of max 3-character strings representing each thousands.
 *
 * ```ts
 * splitIntegerInThousands(99) // ['99']
 * splitIntegerInThousands(1234) // ['1', '234']
 * ```
 */
function splitIntegerInThousands(num: number, acc: string[] = []): string[] {
  if (num === 0) {
    // case for first element: we don't want to display usuless 0 in first positions.
    let last = acc[0];
    if (last?.[0] === '0' && last?.[1] === '0') {
      last = last?.[2];
    } else if (last?.[0] === '0') {
      last = last.substring(1);
    }
    return [last ?? '0', ...acc.slice(1)];
  }
  const thousands = num % 1000;
  return splitIntegerInThousands(Math.floor(num / 1000), [
    `${thousands < 100 ? '0' : ''}${thousands < 10 ? '0' : ''}${thousands}`,
    ...acc,
  ]);
}

/**
 * Transform a number into an ordinal (1st, 32th ...) based on a locale available in the application.
 * __NB:__ If number is a decimal, it will be floored.
 * @param num Any number that needs to be transformed as ordinal.
 * @param locale The language on which the ordinal should be formatted.
 * @returns
 */
export function toOrdinal(num: number, locale: string) {
  // Protective code when used in JS
  const loc: Lng = (AVAILABLE_LANGUAGES as ReadonlyArray<string>).includes(
    locale,
  )
    ? (locale as Lng)
    : LANGUAGES.ENGLISH_BRITISH;
  const numerable = NUMERABLE_BY_LOCALE[loc];

  const sign = num < 0 ? '-' : '';
  const integerPart = Math.floor(Math.abs(num));

  const thousandsAsString = splitIntegerInThousands(integerPart).join(
    numerable.delimiter.thousands,
  );
  return `${sign}${thousandsAsString}${numerable.getOrdinalSuffix(
    Math.floor(Math.abs(num)),
  )}`;
}
