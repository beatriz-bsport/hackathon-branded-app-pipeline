type PrependIfDefined<T extends string, S extends string> = T extends ''
  ? T
  : `${S}${T}`;

type ConcatS<T extends string[], S extends string> = T extends []
  ? ''
  : T extends [infer F, ...infer R]
  ? // @ts-expect-error
    `${F}${PrependIfDefined<ConcatS<R, S>, S>}`
  : '';

/**
 * Concatenates strings with a specified separator and returns the result.
 *
 * @param {string} separator - The separator used between the strings.
 * @param {string} strings - The strings to be concatenated.
 *
 * @returns The concatenated string. The return type is properly typed with string literals.
 *
 * @example
 * const string1: 'rotten' | 'fresh';
 * const string2: 'apple' | 'pear';
 * const separator: '-';
 * ReturnType {'rotten-apple' | 'rotten-pear' | 'fresh-apple' | 'fresh-pear'}
 */

export function joinWithSeparator<S extends string>(separator: S) {
  return function returnedJoinWithSeparator<T extends string[]>(
    ...strings: T
  ): ConcatS<T, S> {
    return strings.join(separator) as ConcatS<T, S>;
  };
}
