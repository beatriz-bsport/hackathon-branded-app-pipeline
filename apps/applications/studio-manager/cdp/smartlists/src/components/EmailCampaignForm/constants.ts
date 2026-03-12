export const EMAIL_TYPE_MARKETING = "marketing" as const;
export const EMAIL_TYPE_INFORMATIONAL = "informational" as const;

export const EMAIL_TYPE_VALUES = [
  EMAIL_TYPE_MARKETING,
  EMAIL_TYPE_INFORMATIONAL,
] as const;

export type EmailType = (typeof EMAIL_TYPE_VALUES)[number];
