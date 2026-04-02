/**
 * Defines how partner spots (aggregators) are allocated within a session.
 *
 * - `UNLIMITED` — Partners can book any available spot; no dedicated pool is reserved for them.
 * - `COMBINED`  — A single shared spot pool applies to all partners combined.
 * - `PER_PARTNER` — Each partner has its own individual spot allocation.
 */
export enum PartnerSpotCappingStrategy {
  UNLIMITED = "UNLIMITED",
  COMBINED = "COMBINED",
  PER_PARTNER = "PER_PARTNER",
}
