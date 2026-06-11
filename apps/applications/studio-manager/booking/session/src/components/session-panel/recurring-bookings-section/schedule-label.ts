/**
 * RecurrenceRuleBooking.day_of_week is 0=Monday..6=Sunday.
 * The shared `session.weekdays` i18n keys (common namespace) are ISO 1=Monday..7=Sunday.
 */
export const getWeekdayTranslationKey = (dayOfWeek: number): string =>
  `session.weekdays.${dayOfWeek + 1}`;
