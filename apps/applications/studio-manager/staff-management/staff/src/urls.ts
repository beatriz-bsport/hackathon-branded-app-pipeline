const INDEX = "..";

const SEGMENTS = {
  ROLE: "role",
} as const;

export const URLS = {
  INDEX,
  ROLE_LIST: SEGMENTS.ROLE,
  DETAILS_SLUG: ":staffId",
  DETAILS: (id: number) => String(id),
} as const;
