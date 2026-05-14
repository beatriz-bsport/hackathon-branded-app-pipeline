import { getCurrencyDisplayWithPrice } from "@bsport/currency";

import type {
  CompatibilityLookup,
  CompatiblePass,
  PassFlags,
} from "#src/types";
import type { TFunction } from "#src/utils/i18n";

export const hasAnyFlag = (pass: PassFlags): boolean =>
  pass.linked_private_pass !== null ||
  pass.manager_only ||
  !pass.is_usable_by_staff ||
  pass.new_member_only;

export type OffPeakDay = {
  day: string;
  ranges: string[];
};

type CompatibilitySection = {
  heading: string;
  chips: string[];
};

export type CompatibilityResult =
  | { kind: "all"; text: string }
  | { kind: "sections"; sections: CompatibilitySection[] };

export const formatCompatibilitySections = (
  pass: Pick<CompatiblePass, "SCTs" | "metaActivities" | "establishments">,
  compatibilityLookup: CompatibilityLookup,
  t: TFunction,
): CompatibilityResult => {
  const hasSCTs = pass.SCTs.length > 0;
  const hasMetaActivities = pass.metaActivities.length > 0;
  const hasEstablishments = pass.establishments.length > 0;

  if (!hasSCTs && !hasMetaActivities && !hasEstablishments)
    return {
      kind: "all",
      text: t("classDetail.compatiblePasses.panel.compatibilityAll"),
    };

  const sections: CompatibilitySection[] = [];

  // Categories (SCTs): show only when restricted — no "All categories" filler
  if (hasSCTs) {
    sections.push({
      heading: t("classDetail.compatiblePasses.panel.compatibilityCategories"),
      chips: pass.SCTs.map(
        (id) => compatibilityLookup.sctNames.get(id) ?? String(id),
      ),
    });
  }

  // Services (metaActivities): show chips when restricted, "All services" filler otherwise
  sections.push(
    hasMetaActivities
      ? {
          heading: t(
            "classDetail.compatiblePasses.panel.compatibilityServices",
          ),
          chips: pass.metaActivities.map(
            (id) => compatibilityLookup.metaActivityNames.get(id) ?? String(id),
          ),
        }
      : {
          heading: t(
            "classDetail.compatiblePasses.panel.compatibilityAllServices",
          ),
          chips: [],
        },
  );

  // Locations (establishments): show chips when restricted, "All locations" filler otherwise
  sections.push(
    hasEstablishments
      ? {
          heading: t(
            "classDetail.compatiblePasses.panel.compatibilityLocations",
          ),
          chips: pass.establishments.map(
            (id) =>
              compatibilityLookup.establishmentNames.get(id) ?? String(id),
          ),
        }
      : {
          heading: t(
            "classDetail.compatiblePasses.panel.compatibilityAllLocations",
          ),
          chips: [],
        },
  );

  return { kind: "sections", sections };
};

// Pass.price is a legacy API inconsistency: some endpoints return a raw number, others a parsed decimal object.
export const formatPassPrice = (
  price: CompatiblePass["price"],
  freeLabel: string,
): string => {
  const numeric = typeof price === "number" ? price : price.parsedValue;
  return numeric === 0 ? freeLabel : getCurrencyDisplayWithPrice(numeric);
};

// API returns schedule keyed by ISO weekday numbers (1=Mon … 7=Sun).
// We preserve that order by iterating over this constant rather than Object.keys().
const ISO_DAY_ORDER = [1, 2, 3, 4, 5, 6, 7] as const;

// Converts an ISO weekday number (1–7) into a locale-aware short label ("Mon", "Lun", …).
// Trick: 2024-01-01 is a Monday, so new Date(2024, 0, N) where N=1…7 lands on Mon–Sun
// of that first week. Any year whose Jan 1 is a Monday works equally (e.g. 2018).
const getDayLabel = (isoDay: number, locale: string): string =>
  new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    new Date(2024, 0, isoDay),
  );

export const formatOffPeakSchedule = (
  schedule: CompatiblePass["off_peak_schedule"],
  locale: string,
): OffPeakDay[] => {
  if (!schedule || Object.keys(schedule).length === 0) return [];

  return ISO_DAY_ORDER.filter((day) => schedule[String(day)]?.length > 0).map(
    (day) => ({
      day: getDayLabel(day, locale),
      ranges: schedule[String(day)].map((range) => range.join("–")),
    }),
  );
};
