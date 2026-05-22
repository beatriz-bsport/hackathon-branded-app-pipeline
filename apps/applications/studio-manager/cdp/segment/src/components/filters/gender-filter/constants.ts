import { GenderFilterValue } from "@bsport/api-cdp/smartlist";

export const GENDER_OPTIONS = {
  male: GenderFilterValue.MALE,
  female: GenderFilterValue.FEMALE,
} as const;

export type GenderOption = (typeof GENDER_OPTIONS)[keyof typeof GENDER_OPTIONS];
