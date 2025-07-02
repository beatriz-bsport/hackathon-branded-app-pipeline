export const URLS = {
  INDEX: "..",
  ARCHIVED: "archived",
} as const;

export const LEGACY_URLS = {
  CREATE: "/member/add",
  DETAILS: (memberId: number) => `/member/${memberId}`,
} as const;
