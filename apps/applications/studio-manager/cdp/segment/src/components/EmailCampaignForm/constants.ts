export const EMAIL_TYPE_MARKETING = "marketing" as const;
export const EMAIL_TYPE_INFORMATIONAL = "informational" as const;

export const EMAIL_TYPE_VALUES = [
  EMAIL_TYPE_MARKETING,
  EMAIL_TYPE_INFORMATIONAL,
] as const;

export type EmailType = (typeof EMAIL_TYPE_VALUES)[number];

export const MESSAGE_TYPE_TEXT_ONLY = "text_only" as const;
export const MESSAGE_TYPE_EMAIL_TEMPLATE = "email_template" as const;

export const MESSAGE_TYPE_VALUES = [
  MESSAGE_TYPE_TEXT_ONLY,
  MESSAGE_TYPE_EMAIL_TEMPLATE,
] as const;

export type MessageType = (typeof MESSAGE_TYPE_VALUES)[number];
