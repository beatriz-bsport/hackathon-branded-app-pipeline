import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";

import type {
  RelationshipsFilterCreatePayload,
  RelationshipsFilterFormValue,
} from "../types";

/**
 * Builds the POST body for a new relationships filter row.
 */
export const toCreatePayload = (
  value: RelationshipsFilterFormValue,
): RelationshipsFilterCreatePayload => ({
  smartlist: value.smartlist,
  comparator_number_relations: value.comparator_number_relations,
  value_number_relations: value.value_number_relations,
  value_number_relations_second:
    value.comparator_number_relations === SMARTLIST_RELATIONS_COMPARATOR.BETWEEN
      ? value.value_number_relations_second
      : 0,
});
