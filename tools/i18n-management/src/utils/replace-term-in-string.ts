/**
 * Converts the first character of a string to uppercase.
 *
 * If the string is empty, it is returned as-is.
 *
 * @param term - The input string to transform
 * @returns The string with its first character uppercased
 *
 * @example
 * toFirstUpperCase("martha") // "Martha"
 * toFirstUpperCase("a") // "A"
 * toFirstUpperCase("") // ""
 */
export function toFirstUpperCase(term: string) {
  if (term.length === 0) {
    return term;
  }

  return [term[0].toUpperCase(), term.slice(1)].join("");
}

/**
 * Converts the first character of each word of the group to uppercase.
 *
 * If the string is empty, it is returned as-is.
 *
 * @param sentence - The string to transform
 * @returns The string with first characters uppercased
 *
 * @example
 * groupToFirstUpperCase("appointment pass") // "Appointment Pass"
 */
export function groupToFirstUpperCase(sentence: string) {
  if (sentence.trim().length === 0) {
    return sentence;
  }

  return sentence
    .trim()
    .split(" ")
    .map((term) => toFirstUpperCase(term))
    .join(" ");
}

/**
 * Replaces occurrences of a singular and plural term in a source string
 * with new singular and plural terms.
 *
 * The function:
 * - Matches terms case-insensitively
 * - Replaces both lowercase and capitalized versions
 * - Preserves capitalization of the first letter
 * - Handles singular terms that are substrings of plural terms (or the opposite)
 * - Avoids replacing terms inside `{{ }}` blocks
 *
 * @param params.sourceString - The input string where replacements may occur
 * @param params.previousTermSingular - Singular form of the term to replace
 * @param params.previousTermPlural - Plural form of the term to replace
 * @param params.newTermSingular - New singular replacement
 * @param params.newTermPlural - New plural replacement
 *
 * @returns An object containing:
 * - `isPresent`: whether at least one replacement occurred
 * - `updatedString`: the updated string (or the original if unchanged)
 *
 * @example
 * replaceTermInString({
 *   sourceString: "Coach and coaches",
 *   previousTermSingular: "coach",
 *   previousTermPlural: "coaches",
 *   newTermSingular: "trainer",
 *   newTermPlural: "trainers",
 * })
 * // {
 * //   isPresent: true,
 * //   updatedString: "Trainer and trainers"
 * // }
 */
export function replaceTermInString({
  sourceString, // String with upper and lower cases
  previousTermSingular,
  previousTermPlural,
  newTermSingular,
  newTermPlural,
}: {
  sourceString: string;
  previousTermSingular: string;
  previousTermPlural: string;
  newTermSingular: string;
  newTermPlural: string;
}): {
  isPresent: boolean;
  updatedString: string;
} {
  /**
   * Split the string into "replaceable text" and "{{ ... }}" blocks.
   * Even indices → replaceable text
   * Odd indices  → interpolation blocks
   */
  const parts = sourceString.split(/(\{\{[^}]*\}\})/g);
  let isPresent = false;

  const singularPair = {
    previousTerm: previousTermSingular,
    newTerm: newTermSingular,
  };
  const pluralPair = {
    previousTerm: previousTermPlural,
    newTerm: newTermPlural,
  };
  const terms = previousTermSingular
    .toLowerCase()
    .includes(previousTermPlural.toLowerCase())
    ? [singularPair, pluralPair]
    : [pluralPair, singularPair];

  const updatedParts = parts.map((part, index) => {
    // Skip interpolation blocks
    if (index % 2 === 1) {
      return part;
    }

    let updatedPart = part;

    terms.forEach(({ previousTerm, newTerm }) => {
      if (updatedPart.toLowerCase().includes(previousTerm.toLowerCase())) {
        // Replace with initial case
        updatedPart = updatedPart.replaceAll(previousTerm, newTerm);

        // Replace with lower case
        updatedPart = updatedPart.replaceAll(
          previousTerm.toLowerCase(),
          newTerm.toLowerCase(),
        );

        // Replace with first letters in upper case
        updatedPart = updatedPart.replaceAll(
          groupToFirstUpperCase(previousTerm),
          groupToFirstUpperCase(newTerm),
        );

        isPresent = true;
      }
    });

    return updatedPart;
  });

  return {
    isPresent,
    updatedString: updatedParts.join(""),
  };
}
