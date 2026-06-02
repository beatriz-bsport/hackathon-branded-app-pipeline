import type { SmartlistFilterPayload } from "../../shared/types";

/**
 * Smartlist tag filter data contract.
 * Endpoint family: /customer-data-platform/v1/smartlist/tag_filter/
 */
export type TagFilter = SmartlistFilterPayload & {
  company_id: number;
  tags_included: number[];
  tags_excluded: number[];
};

export type CreateTagFilterPayload = Omit<
  TagFilter,
  "id" | "company_id" | "filter_identifier"
>;

export type UpdateTagFilterPayload = Partial<
  Pick<TagFilter, "tags_included" | "tags_excluded">
>;
