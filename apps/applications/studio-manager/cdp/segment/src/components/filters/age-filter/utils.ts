import type { TFunction } from "#src/utils/i18n";

/**
 * Resolves a pluralized year suffix for numeric age inputs.
 */
export const getAgeYearSuffix = (
  translate: TFunction,
  count: number | null,
): string =>
  translate("filters.101.fields.yearSuffix", {
    count: count ?? 0,
  });
