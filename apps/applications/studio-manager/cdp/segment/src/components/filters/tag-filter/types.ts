import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

/**
 * Form model for a single smartlist tag filter row (include / exclude sections).
 */
export type TagFilterFormValue = {
  id?: number;
  smartlist: number;
  includeSectionEnabled: boolean;
  excludeSectionEnabled: boolean;
  tagsIncluded: number[];
  tagsExcluded: number[];
};

export type TagFilterCardProps = SegmentFilterCardProps<TagFilterFormValue>;

/**
 * Minimal tag fields required to render the picker (matches CDP tagging API).
 */
export type TagFilterTagCatalogEntry = {
  id: number;
  group: number;
  name: string;
  color: string;
};

export type TagFilterTagGroupCatalogEntry = {
  id: number;
  name: string;
};
