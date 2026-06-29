import type { EnrichedAppointment } from "#src/types";

export type EstablishmentCellVariant =
  | { kind: "name"; name: string }
  | { kind: "atHome" }
  | { kind: "none" };

export const getEstablishmentCellVariant = (
  row: Pick<EnrichedAppointment, "establishmentName" | "is_at_home">,
): EstablishmentCellVariant => {
  if (row.establishmentName) {
    return { kind: "name", name: row.establishmentName };
  }
  if (row.is_at_home) {
    return { kind: "atHome" };
  }
  return { kind: "none" };
};
