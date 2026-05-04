import type { Establishment } from "@bsport/api-core";

/**
 * Shared booking-side fields exposed for partnership accounts across endpoints.
 * Concrete account types extend this base with endpoint-specific data.
 */
type BasePartnershipAccount = {
  id: string;
  external_id: string;
  external_name?: string;
  active?: boolean;
  activated_at?: string;
};

/**
 * Partnership account returned by the generic partnership-account listing endpoint.
 * This shape includes the establishments linked to the account, but not the
 * booking-context fields used by `active_for_offer`.
 */
export type PartnershipAccount = BasePartnershipAccount & {
  establishments: Establishment[];
};

export type PartnershipAccountStatus = "active" | "pending" | "deactivated";

export type PartnershipCompany = {
  id: number;
  identifier: string;
  associated_establishment_ids: number[];
  company: number;
  date_created: number;
  partnership: number;
  override_establishment_pk: number | null;
};

export type FetchPartnershipAccountsParams = {
  partnership: number;
};

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
