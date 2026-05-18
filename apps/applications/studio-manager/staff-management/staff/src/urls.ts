const INDEX = "..";

const SEGMENTS = {
  ROLE: "role",
} as const;

export const URLS = {
  INDEX,
  DETAILS_SLUG: ":staffId",
  DETAILS: (id: number) => String(id),
  ROLE: SEGMENTS.ROLE,
  ROLE_DETAILS: `${SEGMENTS.ROLE}/:id`,
} as const;

export const LEGACY_URLS = {
  STAFF: "/settings/staff",
  ROLE: "/settings/role",
} as const;
