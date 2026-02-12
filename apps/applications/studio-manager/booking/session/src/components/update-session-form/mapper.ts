import type { SessionWithActivity } from "@bsport/api-book";
import { fromIsoString } from "@bsport/datetime-manipulation";

import type { SessionEditFormData } from "#src/components/SessionForm/types";
import {
  CustomRecurrenceUnit,
  MonthlyRecurrencePattern,
  RecurrenceType,
} from "#src/helpers/recurrence/types";

const DEFAULT_RECURRENCE_WEEKDAYS = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
} as const;

export const fromSessionToFormData = (
  session: SessionWithActivity,
): SessionEditFormData => {
  const startDateTime = fromIsoString(session.date_start).toJSDate();

  return {
    // Date/time
    startDateTime,
    duration_minute: session.duration_minute,
    isRecurring: false,
    recurrenceType: RecurrenceType.WEEKLY,
    recurrenceWeekdays: { ...DEFAULT_RECURRENCE_WEEKDAYS },
    recurrenceUnit: CustomRecurrenceUnit.WEEKS,
    recurrenceInterval: 1,
    recurrencePattern: MonthlyRecurrencePattern.DAY_OF_MONTH,
    recurrenceEndDate: null,
    // Details
    allowCustomNameAndDescription: !!(
      session.name_override || session.description_override
    ),
    name_override: session.name_override
      ? session.name_override
      : (session.name ?? ""),
    description_override: session.description_override
      ? session.description_override
      : (session.meta_activity?.description ?? ""),
    // Settings
    manager_only: session.manager_only,
    credits: session.credit_price,
    waiting_list_max_size: session.waiting_list_max_size,
    effectif: session.effectif,
    available_on_partnership: session.available_on_partnership,
    partner_max_booking_count: session.partner_max_booking_count,
    level: session.level,
    // TODO: remove is_hybrid as it's only used in the creation form
    is_hybrid: !!session.linked_hybrid_offer_id,
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
    id: session.id,
    meta_activity: session.meta_activity?.id,
    coach_override: session.coach_override ?? null,
    credit_price_override: session.credit_price_override,
    custom_selection_ids: [],
    custom_selection: false,
    modifyAllDates: false,
    notifyConsumers: false,
    propagate_coach_override_value: 0,
  };
};
