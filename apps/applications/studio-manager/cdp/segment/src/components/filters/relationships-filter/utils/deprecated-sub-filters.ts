import type { RelationsFilter } from "@bsport/api-cdp/smartlist";

/**
 * Returns whether any deprecated legacy sub-filter is active on the API row.
 */
export const hasActiveDeprecatedSubFilters = (
  filter: RelationsFilter,
): boolean =>
  filter.date_filter_active ||
  filter.number_relations_consumer_payment_packs_filter_active ||
  filter.number_relations_consumer_private_passes_filter_active ||
  filter.number_relations_bookings_filter_active ||
  filter.relation_receive_copy_of_email_filter_active ||
  filter.relation_accept_sms_filter_active ||
  filter.relation_accept_email_filter_active;

/**
 * Builds a PATCH body that deactivates all deprecated sub-filters.
 */
export const buildDeactivateDeprecatedSubFiltersPatch = () => ({
  date_filter_active: false,
  number_relations_consumer_payment_packs_filter_active: false,
  number_relations_consumer_private_passes_filter_active: false,
  number_relations_bookings_filter_active: false,
  relation_receive_copy_of_email_filter_active: false,
  relation_accept_sms_filter_active: false,
  relation_accept_email_filter_active: false,
});
