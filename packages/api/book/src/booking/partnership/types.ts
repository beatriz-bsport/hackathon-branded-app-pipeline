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

export enum PartnershipIdentifier {
  WELLHUB = "wellhub",
  MYCLUBS = "myclubs",
  CLASSPASS = "classpass",
  USC = "usc",
  WELLPASS = "wellpass",
}

/**
 * Represents the per-partner spot allocation for a session or offer.
 * Used when `partner_spot_capping_strategy` is `PER_PARTNER`.
 */
export type PartnershipOffer = {
  /** Internal ID of the partnership (aggregator). */
  partnership: number;
  /** Slug identifier of the aggregator (e.g. "wellhub", "classpass"). */
  partnership_identifier: PartnershipIdentifier;
  /** Whether this aggregator is allowed to book spots. */
  allowed_on_partner: boolean;
  /** Maximum spots this aggregator can book. Null means unlimited. */
  spot_limit: number | null;
};

export type FetchActivePartnershipAccountsParams = {
  offer?: number;
  establishment?: number; // Required if offer is not provided
  date_start?: string; // ISO date string, required if offer is not provided
};

/**
 * Represents an active partnership account returned by the `active_for_offer` endpoint.
 */
export type ActivePartnershipAccount = {
  id: string;
  partnership: number;
  partnership_identifier: PartnershipIdentifier;
  external_id: string;
  external_name: string;
  // Establishment is unused for now but the API exposes it so we keep it commented
  // establishments: Establishment[];
  active?: boolean;
  activated_at?: string;
};
