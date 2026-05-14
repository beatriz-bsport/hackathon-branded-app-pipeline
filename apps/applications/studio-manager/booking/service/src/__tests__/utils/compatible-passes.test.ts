import { describe, expect, it, vi } from "vitest";

import type { CompatibilityLookup } from "#src/types";
import {
  formatCompatibilitySections,
  formatOffPeakSchedule,
  formatPassPrice,
  hasAnyFlag,
} from "#src/utils/compatible-passes";

vi.mock("@bsport/currency", () => ({
  getCurrencyDisplayWithPrice: (value: number) => `€${value}`,
}));

const t = (key: string) => key;

const emptyLookup: CompatibilityLookup = {
  sctNames: new Map(),
  metaActivityNames: new Map(),
  establishmentNames: new Map(),
};

// ---------------------------------------------------------------------------
// hasAnyFlag
// ---------------------------------------------------------------------------

describe("hasAnyFlag", () => {
  it("returns false when no flag is set", () => {
    expect(
      hasAnyFlag({
        linked_private_pass: null,
        manager_only: false,
        is_usable_by_staff: true,
        new_member_only: false,
      }),
    ).toBe(false);
  });

  it("returns true when linked_private_pass is set", () => {
    expect(
      hasAnyFlag({
        linked_private_pass: 42,
        manager_only: false,
        is_usable_by_staff: true,
        new_member_only: false,
      }),
    ).toBe(true);
  });

  it("returns true when manager_only", () => {
    expect(
      hasAnyFlag({
        linked_private_pass: null,
        manager_only: true,
        is_usable_by_staff: true,
        new_member_only: false,
      }),
    ).toBe(true);
  });

  it("returns true when not usable by staff", () => {
    expect(
      hasAnyFlag({
        linked_private_pass: null,
        manager_only: false,
        is_usable_by_staff: false,
        new_member_only: false,
      }),
    ).toBe(true);
  });

  it("returns true when new_member_only", () => {
    expect(
      hasAnyFlag({
        linked_private_pass: null,
        manager_only: false,
        is_usable_by_staff: true,
        new_member_only: true,
      }),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// formatCompatibilitySections
// ---------------------------------------------------------------------------

describe("formatCompatibilitySections", () => {
  it('returns kind="all" when no restrictions', () => {
    const result = formatCompatibilitySections(
      { SCTs: [], metaActivities: [], establishments: [] },
      emptyLookup,
      t,
    );
    expect(result).toEqual({
      kind: "all",
      text: "classDetail.compatiblePasses.panel.compatibilityAll",
    });
  });

  it('returns kind="sections" with SCT heading when SCTs restricted', () => {
    const lookup: CompatibilityLookup = {
      sctNames: new Map([[1, "Yoga"]]),
      metaActivityNames: new Map(),
      establishmentNames: new Map(),
    };
    const result = formatCompatibilitySections(
      { SCTs: [1], metaActivities: [], establishments: [] },
      lookup,
      t,
    );
    expect(result.kind).toBe("sections");
    if (result.kind !== "sections") return;
    const sctSection = result.sections.find(
      (s) =>
        s.heading ===
        "classDetail.compatiblePasses.panel.compatibilityCategories",
    );
    expect(sctSection?.chips).toEqual(["Yoga"]);
  });

  it("falls back to string id when name not found in lookup", () => {
    const result = formatCompatibilitySections(
      { SCTs: [99], metaActivities: [], establishments: [] },
      emptyLookup,
      t,
    );
    expect(result.kind).toBe("sections");
    if (result.kind !== "sections") return;
    expect(result.sections[0].chips).toEqual(["99"]);
  });

  it('shows "all services" filler when services are unrestricted', () => {
    const result = formatCompatibilitySections(
      { SCTs: [1], metaActivities: [], establishments: [] },
      emptyLookup,
      t,
    );
    expect(result.kind).toBe("sections");
    if (result.kind !== "sections") return;
    const servicesSection = result.sections.find(
      (s) =>
        s.heading ===
        "classDetail.compatiblePasses.panel.compatibilityAllServices",
    );
    expect(servicesSection).toBeDefined();
    expect(servicesSection?.chips).toEqual([]);
  });

  it('shows "all locations" filler when establishments are unrestricted', () => {
    const result = formatCompatibilitySections(
      { SCTs: [1], metaActivities: [], establishments: [] },
      emptyLookup,
      t,
    );
    expect(result.kind).toBe("sections");
    if (result.kind !== "sections") return;
    const locationsSection = result.sections.find(
      (s) =>
        s.heading ===
        "classDetail.compatiblePasses.panel.compatibilityAllLocations",
    );
    expect(locationsSection).toBeDefined();
    expect(locationsSection?.chips).toEqual([]);
  });

  it("shows establishment chips when restricted", () => {
    const lookup: CompatibilityLookup = {
      sctNames: new Map(),
      metaActivityNames: new Map(),
      establishmentNames: new Map([[5, "Paris Studio"]]),
    };
    const result = formatCompatibilitySections(
      { SCTs: [], metaActivities: [], establishments: [5] },
      lookup,
      t,
    );
    expect(result.kind).toBe("sections");
    if (result.kind !== "sections") return;
    const locationsSection = result.sections.find(
      (s) =>
        s.heading ===
        "classDetail.compatiblePasses.panel.compatibilityLocations",
    );
    expect(locationsSection?.chips).toEqual(["Paris Studio"]);
  });
});

// ---------------------------------------------------------------------------
// formatPassPrice
// ---------------------------------------------------------------------------

describe("formatPassPrice", () => {
  it("returns free label when price is 0 (number)", () => {
    expect(formatPassPrice(0, "Free")).toBe("Free");
  });

  it("returns free label when parsedValue is 0", () => {
    expect(formatPassPrice({ parsedValue: 0 } as never, "Free")).toBe("Free");
  });

  it("returns formatted price for non-zero number", () => {
    expect(formatPassPrice(1500, "Free")).toBe("€1500");
  });

  it("returns formatted price for non-zero parsedValue", () => {
    expect(formatPassPrice({ parsedValue: 900 } as never, "Free")).toBe("€900");
  });
});

// ---------------------------------------------------------------------------
// formatOffPeakSchedule
// ---------------------------------------------------------------------------

describe("formatOffPeakSchedule", () => {
  it("returns empty array for null schedule", () => {
    expect(formatOffPeakSchedule(null as never, "en-GB")).toEqual([]);
  });

  it("returns empty array for empty schedule", () => {
    expect(formatOffPeakSchedule({}, "en-GB")).toEqual([]);
  });

  it("returns days in ISO weekday order (Mon before Fri)", () => {
    const schedule = {
      "5": [["09:00", "12:00"]], // Friday
      "1": [["07:00", "09:00"]], // Monday
    };
    const result = formatOffPeakSchedule(schedule, "en-GB");
    expect(result).toHaveLength(2);
    expect(result[0].day).toBe(
      new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
        new Date(2024, 0, 1),
      ),
    ); // Monday
    expect(result[1].day).toBe(
      new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
        new Date(2024, 0, 5),
      ),
    ); // Friday
  });

  it("skips days with empty ranges", () => {
    const schedule = {
      "1": [],
      "3": [["10:00", "11:00"]],
    };
    const result = formatOffPeakSchedule(schedule, "en-GB");
    expect(result).toHaveLength(1);
  });

  it("joins range pairs with en dash", () => {
    const schedule = {
      "2": [
        ["08:00", "10:00"],
        ["14:00", "16:00"],
      ],
    };
    const result = formatOffPeakSchedule(schedule, "en-GB");
    expect(result[0].ranges).toEqual(["08:00–10:00", "14:00–16:00"]);
  });
});
