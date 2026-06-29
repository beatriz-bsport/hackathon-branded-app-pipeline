import { describe, expect, it } from "vitest";

import { getEstablishmentCellVariant } from "#src/components/AppointmentList/get-establishment-cell-variant";

describe("getEstablishmentCellVariant", () => {
  it("returns the establishment name when present", () => {
    expect(
      getEstablishmentCellVariant({
        establishmentName: "Studio Bastille",
        is_at_home: false,
      }),
    ).toEqual({ kind: "name", name: "Studio Bastille" });
  });

  it("prefers the name even for an at-home booking", () => {
    expect(
      getEstablishmentCellVariant({
        establishmentName: "Studio Bastille",
        is_at_home: true,
      }),
    ).toEqual({ kind: "name", name: "Studio Bastille" });
  });

  it("returns at-home when there is no establishment and the booking is at home", () => {
    expect(
      getEstablishmentCellVariant({ establishmentName: "", is_at_home: true }),
    ).toEqual({ kind: "atHome" });
  });

  it("returns none when there is neither an establishment nor at-home", () => {
    expect(
      getEstablishmentCellVariant({ establishmentName: "", is_at_home: false }),
    ).toEqual({ kind: "none" });
  });
});
