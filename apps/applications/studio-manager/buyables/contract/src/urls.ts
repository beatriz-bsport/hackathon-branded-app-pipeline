const EDITOR_SLUG = ":id";
const OVERVIEW_SEGMENT = "overview";
const PAUSES_SEGMENT = "pauses";

export const URLS = {
  INDEX: "..",

  EDITOR_SLUG: EDITOR_SLUG,
  EDITOR: (id: number) => String(id),

  OVERVIEW_SLUG: `${EDITOR_SLUG}/${OVERVIEW_SEGMENT}`,
  OVERVIEW: (id: number) => `${id}/${OVERVIEW_SEGMENT}`,

  PAUSES_SLUG: `${EDITOR_SLUG}/${PAUSES_SEGMENT}`,
  PAUSES: (id: number) => `${id}/${PAUSES_SEGMENT}`,
} as const;

/**
 * When to use ? When inside a subsegment of the page, React router needs to
 * navigate relatively to the index
 * @param href Relative path from the Root to a page
 */
export const getHrefFromRoot = (href: string) => `${URLS.INDEX}/${href}`;
