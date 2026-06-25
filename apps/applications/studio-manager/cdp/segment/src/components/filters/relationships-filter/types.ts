import type {
  CreateRelationsFilterPayload,
  RelationsFilter,
  SmartlistRelationsComparator,
  UpdateRelationsFilterPayload,
} from "@bsport/api-cdp/smartlist";

import type { SegmentFilterCardProps } from "../segment-filters-registry/types";

export type RelationshipsFilterFormValue = {
  id?: number;
  smartlist: number;
  comparator_number_relations: SmartlistRelationsComparator;
  value_number_relations: number;
  value_number_relations_second: number;
  hadDeprecatedSubFiltersAtHydration?: boolean;
};

export type RelationshipsFilterDirtyPatchPayload = UpdateRelationsFilterPayload;

export type RelationshipsFilterCreatePayload = CreateRelationsFilterPayload;

export type RelationshipsFilterCardProps =
  SegmentFilterCardProps<RelationshipsFilterFormValue>;

export type { RelationsFilter };
