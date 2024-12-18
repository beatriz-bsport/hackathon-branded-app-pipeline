/**
 * Extracts identifier information from a resource identifier string.
 *
 * Parses a `resourceIdentifier` in the format "identifier:id" and returns an object
 * containing the `identifier` as a string and `id` as a parsed integer. If
 * `resourceIdentifier` is an empty string or undefined, an empty object is returned.
 *
 * @param {string} resourceIdentifier - The resource identifier in the format "identifier:id".
 * @returns {{ identifier?: string, id?: number }} An object with `identifier` (string) and `id` (number)
 * properties, or an empty object if `resourceIdentifier` is falsy.
 *
 * @example
 * extractResourceIdentifierInformation("associated_coach:123");
 * // Returns: { identifier: "associated_coach", id: 123 }
 *
 * @example
 * extractResourceIdentifierInformation("associated_establishment:123");
 * // Returns: { identifier: "associated_establishment", id: 123 }
 *
 * @example
 * extractResourceIdentifierInformation("");
 * // Returns: {}
 */
export const extractResourceIdentifierInformation = (
  resourceIdentifier: string,
) => {
  if (!resourceIdentifier) return {};
  const [identifier, id] = resourceIdentifier.split(':');
  return {
    identifier,
    id: parseInt(id),
  };
};
