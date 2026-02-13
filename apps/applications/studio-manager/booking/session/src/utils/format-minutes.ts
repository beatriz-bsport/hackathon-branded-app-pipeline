import { TFunction } from "#src/utils/i18n";

/**
 * Converts a number of minutes into a human-readable duration string.
 * e.g. 1300 → "21 h 40 min", 90 → "1 h 30 min", 45 → "45 min"
 */
export function formatMinutes(minutesNumber: number, t: TFunction) {
  if (minutesNumber === 999999) {
    return t("w:never");
  }

  const dayIdentifier = "table.datetime.shortDayIdentifier";
  const hourIdentifier = "table.datetime.shortHourIdentifier";
  const minuteIdentifier = "table.datetime.shortMinuteIdentifier";

  const minutesMinusDays = minutesNumber % (60 * 24);
  const minutesMinusHours = minutesNumber % 60;

  const days = parseInt((minutesNumber / (60 * 24)).toString(), 10);
  const hours = parseInt((minutesMinusDays / 60).toString(), 10);

  let readableDuration = "";
  if (days) {
    readableDuration += `${days}${"\u00A0"}${t(dayIdentifier, { count: days })} `;
  }
  if (hours) {
    readableDuration += `${hours}${"\u00A0"}${t(hourIdentifier)} `;
  }

  if (minutesMinusHours || readableDuration === "") {
    readableDuration += `${minutesMinusHours}${"\u00A0"}${t(minuteIdentifier)}`;
  }

  return readableDuration;
}
