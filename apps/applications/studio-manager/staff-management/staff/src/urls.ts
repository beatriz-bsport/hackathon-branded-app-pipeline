const INDEX = "..";

const SEGMENTS = {
  STAFF: "staff",
  ROLE: "role",
} as const;

export const URLS = {
  INDEX,
  STAFF: SEGMENTS.STAFF,
  STAFF_INDEX: `${INDEX}/${SEGMENTS.STAFF}`,
  STAFF_DETAILS_SLUG: `${SEGMENTS.STAFF}/:staffId`,
  STAFF_DETAILS: (id: number) => `${INDEX}/${SEGMENTS.STAFF}/${id}`,
  ROLE: SEGMENTS.ROLE,
  ROLE_INDEX: `${INDEX}/${SEGMENTS.ROLE}`,
  ROLE_DETAILS_SLUG: `${SEGMENTS.ROLE}/:id`,
  ROLE_DETAILS: (id: number) => `${INDEX}/${SEGMENTS.ROLE}/${id}`,
} as const;

export const LEGACY_URLS = {
  STAFF: "/settings/staff",
  ROLE: "/settings/role",
} as const;
