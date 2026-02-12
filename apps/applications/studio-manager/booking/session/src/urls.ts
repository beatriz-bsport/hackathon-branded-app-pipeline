const DETAILS_SLUG = ":id";

export const URLS = {
  DETAILS_SLUG: DETAILS_SLUG,
  DETAILS: (id: number) => String(id),
} as const;
