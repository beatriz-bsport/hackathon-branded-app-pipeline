import { SMARTLIST_RELATIONS_COMPARATOR } from "@bsport/api-cdp/smartlist";

import type { RelationshipsFilterFormValue } from "./types";

const DEFAULT_RELATIONS_FIRST_VALUE = 1;
const DEFAULT_RELATIONS_SECOND_VALUE = DEFAULT_RELATIONS_FIRST_VALUE + 1;

/**
 * Default form values for a new relationships filter row (at least one relationship).
 */
export const createDefaultRelationshipsFilter = (
  smartlistId: number,
): RelationshipsFilterFormValue => ({
  smartlist: smartlistId,
  comparator_number_relations: SMARTLIST_RELATIONS_COMPARATOR.GTE,
  value_number_relations: DEFAULT_RELATIONS_FIRST_VALUE,
  value_number_relations_second: DEFAULT_RELATIONS_SECOND_VALUE,
});
