import { MEMBER_BASE, type MemberBaseValue } from "@bsport/api-cdp/smartlist";

export const MEMBER_BASE_OPTIONS = [
  MEMBER_BASE.ACTIVE,
  MEMBER_BASE.ARCHIVED,
  MEMBER_BASE.BOTH,
] as const;

/**
 * Returns whether a numeric value is a supported `member_base` option.
 */
export const isMemberBaseValue = (value: number): value is MemberBaseValue =>
  MEMBER_BASE_OPTIONS.includes(value as MemberBaseValue);

/**
 * Parses a Select item id into a supported `member_base` value.
 */
export const parseMemberBaseSelectValue = (
  value: string,
): MemberBaseValue | null => {
  const parsedValue = Number(value);

  return isMemberBaseValue(parsedValue) ? parsedValue : null;
};
