import type { SessionWithActivity } from "@bsport/api-book";
import { fromIsoString } from "@bsport/datetime-manipulation";

import type { SessionEditFormData } from "#src/components/SessionForm/types";

export const fromSessionToFormData = (
  session: SessionWithActivity,
): SessionEditFormData => {
  const startDateTime = fromIsoString(session.date_start).toJSDate();

  return {
    // Date/time
    startDateTime,
    duration_minute: session.duration_minute,
    // Details
    name_override: session.name_override
      ? session.name_override
      : (session.name ?? ""),
    description_override: session.description_override
      ? session.description_override
      : (session.metaActivity?.description ?? ""),
    // Settings
    manager_only: session.manager_only,
    credits: session.credit_price,
    waiting_list_max_size: session.waiting_list_max_size,
    effectif: session.effectif,
    available_on_partnership: session.available_on_partnership,
    partner_max_booking_count: session.partner_max_booking_count,
    level: session.level,
    broadcast_link: session.broadcast_link ?? "",
    // Teacher and establishment
    coach: session.coach,
    overrideTeacherPayrollRule: false,
    coach_payment_rule: session.coach_payment_rule_id,
    establishment: session.establishment,
    room_blueprint: session.room_blueprint,
    roomBlueprintCapacity: null,
    sync_on_spivi: undefined,
    recurrence_id: session.recurrence_id ?? undefined,
    wellhub_product_id: null,
    // Advanced options
    allow_guest_offer: session.allow_guest_offer,
    whitelist_tags: session.whitelist_tags ?? [],
    blacklist_tags: session.blacklist_tags ?? [],
    // Edit-specific fields
    meta_activity: session.meta_activity,
    coach_override: session.coach_override ?? null,
    credit_price_override: session.credit_price_override,
    custom_selection_ids: [],
    custom_selection: false,
    modifyAllDates: false,
    notifyConsumers: false,
    propagate_coach_override_value: 0,
  };
};
