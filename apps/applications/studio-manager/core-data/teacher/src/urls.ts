export const URLS = {
  INDEX: "..",
  ACTIVE: "..",
  ARCHIVED: "archived",
} as const;

export const LEGACY_URLS = {
  DETAILS: (teacherId: number) => `/coach/${teacherId}`,
  CREATE: (predefinedEmail: string) => `/coach/add?email=${predefinedEmail}`,
};
