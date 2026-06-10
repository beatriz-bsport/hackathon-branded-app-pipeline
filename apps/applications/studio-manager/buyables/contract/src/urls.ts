const EDITOR_SLUG = ":id";
const OVERVIEW_SEGMENT = "overview";
const PAUSES_SEGMENT = "pauses";
const MEMBERSHIP_PLAN_SEGMENT = "membership-plan";

export const URLS = {
  INDEX: "..",

  EDITOR_SLUG: EDITOR_SLUG,
  EDITOR: (id: number) => String(id),

  OVERVIEW_SLUG: `${EDITOR_SLUG}/${OVERVIEW_SEGMENT}`,
  OVERVIEW: (id: number) => `${id}/${OVERVIEW_SEGMENT}`,

  PAUSES_SLUG: `${EDITOR_SLUG}/${PAUSES_SEGMENT}`,
  PAUSES: (id: number) => `${id}/${PAUSES_SEGMENT}`,

  MEMBERSHIP_PLAN_SLUG: `${EDITOR_SLUG}/${MEMBERSHIP_PLAN_SEGMENT}/:membershipPlanId`,
  MEMBERSHIP_PLAN: (contractId: number, membershipPlanId: number) =>
    `${contractId}/${MEMBERSHIP_PLAN_SEGMENT}/${membershipPlanId}`,
  MEMBERSHIP_PLAN_HISTORY: (contractId: number, membershipPlanId: number) =>
    `${contractId}/${MEMBERSHIP_PLAN_SEGMENT}/${membershipPlanId}/history`,
} as const;

export const LEGACY_URLS = {
  MEMBERSHIP_PLAN: (id: number) => `/subscription/${id}`,

  PAYMENT_LINK: ({
    companyId,
    buyableId,
  }: {
    companyId: number;
    buyableId: number | string;
  }) =>
    `${window?.location?.origin ?? ""}/checkout/${companyId}/subscription/${buyableId}/?force=true`,
} as const;

/**
 * When to use ? When inside a subsegment of the page, React router needs to
 * navigate relatively to the index
 * @param href Relative path from the Root to a page
 */
export const getHrefFromRoot = (href: string) => `${URLS.INDEX}/${href}`;
