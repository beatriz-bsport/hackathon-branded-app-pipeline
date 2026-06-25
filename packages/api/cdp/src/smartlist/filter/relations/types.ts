import type { SmartlistFilterPayload } from "../../shared/types";
import type { SmartlistRelationsComparator } from "./constants";

export type { SmartlistRelationsComparator } from "./constants";

/**
 * Deprecated sub-filter fields returned by hydration.
 * Not exposed in studio UI; may be patched to deactivate legacy configuration.
 *
 * @deprecated Backend-only legacy fields — not editable in studio UI.
 */
export type RelationsFilterDeprecatedSubFilters = {
  date_filter_active: boolean;
  date: string;
  date_second: string;
  date_filter_type: number;
  duration: number | null;
  duration_second: number | null;
  number_relations_consumer_payment_packs_filter_active: boolean;
  value_number_relations_consumer_payment_packs: number;
  value_number_relations_consumer_payment_packs_second: number;
  comparator_number_relations_consumer_payment_packs: number;
  consumer_payment_packs_must_be_valid: boolean;
  number_relations_consumer_private_passes_filter_active: boolean;
  value_number_relations_consumer_private_passes: number;
  value_number_relations_consumer_private_passes_second: number;
  comparator_number_relations_consumer_private_passes: number;
  consumer_private_passes_must_be_valid: boolean;
  number_relations_bookings_filter_active: boolean;
  value_number_relations_bookings: number;
  value_number_relations_bookings_second: number;
  comparator_number_relations_bookings: number;
  relation_receive_copy_of_email_filter_active: boolean;
  relation_receive_copy_of_email: boolean;
  relation_accept_sms_filter_active: boolean;
  relation_accept_sms: boolean;
  relation_accept_email_filter_active: boolean;
  relation_accept_email: boolean;
};

/**
 * Primary smartlist relationships filter fields (studio UI scope).
 */
export type RelationsFilterPrimaryFields = {
  comparator_number_relations: SmartlistRelationsComparator;
  value_number_relations: number;
  value_number_relations_second: number;
};

/**
 * Smartlist relationships filter.
 * Endpoint family: `/customer-data-platform/v1/smartlist/relations/`.
 */
export type RelationsFilter = {
  company: number;
} & SmartlistFilterPayload &
  RelationsFilterPrimaryFields &
  RelationsFilterDeprecatedSubFilters;

export type CreateRelationsFilterPayload = Pick<
  RelationsFilter,
  "smartlist" | "comparator_number_relations" | "value_number_relations"
> &
  Partial<Pick<RelationsFilter, "value_number_relations_second">>;

export type UpdateRelationsFilterPayload = Partial<
  RelationsFilterPrimaryFields & RelationsFilterDeprecatedSubFilters
>;

export type UpsertRelationsFilterVariables = {
  filterId?: number;
  createPayload?: CreateRelationsFilterPayload;
  updatePayload?: UpdateRelationsFilterPayload;
};
