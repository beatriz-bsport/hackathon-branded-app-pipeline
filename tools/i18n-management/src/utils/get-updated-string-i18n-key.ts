const PLURAL_SUFFIXES = ["_plural", "_one", "_other"];

/**
 * Returns the updated i18n key depending on the override strategy.
 *
 * When `override` is `true`, the source key is returned unchanged.
 * When `override` is `false`, a `_revamp` suffix is added to create
 * a new translation entry.
 *
 * Plural keys (ending with `_plural`, `_one` or `_other`) are preserved by inserting
 * `_revamp` before the plural suffix.
 *
 * @param params - Function parameters
 * @param params.override - Whether to override the existing i18n key
 * @param params.sourceKey - Original i18n key
 *
 * @returns The updated i18n key
 *
 * @example
 * getUpdatedStringI18nKey({
 *   override: false,
 *   sourceKey: "coach",
 * })
 * // "coach_revamp"
 *
 * @example
 * getUpdatedStringI18nKey({
 *   override: false,
 *   sourceKey: "coach_plural",
 * })
 * // "coach_revamp_plural"
 *
 * @example
 * getUpdatedStringI18nKey({
 *   override: true,
 *   sourceKey: "coach",
 * })
 * // "coach"
 */
export function getUpdatedStringI18nKey({
  override,
  sourceKey,
}: {
  override: boolean;
  sourceKey: string;
}) {
  if (override) {
    return sourceKey;
  }
  // Add revamp suffix when override is false to create a new entry
  const i18nKeySuffix = "_revamp";
  const matchedSuffix = PLURAL_SUFFIXES.filter((suffix) =>
    sourceKey.endsWith(suffix),
  );

  if (matchedSuffix.length > 0) {
    const suffix = matchedSuffix[0];
    const sourceKeySingular = sourceKey.slice(
      0,
      sourceKey.length - suffix.length,
    );
    return `${sourceKeySingular}${i18nKeySuffix}${suffix}`;
  }

  return `${sourceKey}${i18nKeySuffix}`;
}
