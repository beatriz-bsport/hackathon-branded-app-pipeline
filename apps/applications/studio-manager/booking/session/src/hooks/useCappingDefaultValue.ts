import { useEffect } from "react";

import {
  type ActivePartnershipAccount,
  type PartnershipOffer,
} from "@bsport/api-book";
import { useFormContext } from "@bsport/form";

import { SessionFormData } from "#src/components/SessionForm/schemas";

import { useFetchActivePartnershipAccounts } from "./use-fetch-active-partnership-accounts";

const DEFAULT_SPOT_LIMIT_RATIO = 0.2;

type UseCappingDefaultValueProps = {
  isEditMode?: boolean;
};

type UseCappingDefaultValueReturn = {
  activeAccounts: ActivePartnershipAccount[] | undefined;
};

/**
 * Manages default capping values for both COMBINED and PER_PARTNER strategies.
 *
 * - COMBINED: sets `partner_max_booking_count` to 20% of `effectif` and syncs
 *   `partnership_offers` (allowed_on_partner per partner, spot_limit: null).
 *   In edit mode, only fills in partner_max_booking_count if empty/zero.
 *
 * - PER_PARTNER: fetches active partnership accounts and syncs
 *   `partnership_offers` with per-partner spot limits (effectif * 20% / n).
 *   Existing values are preserved.
 *
 * Returns `{ activeAccounts, isLoading }` for downstream rendering.
 */
export const useCappingDefaultValue = ({
  isEditMode = false,
}: UseCappingDefaultValueProps = {}): UseCappingDefaultValueReturn => {
  const { watch, setValue } = useFormContext<SessionFormData>();

  const effectif = watch("effectif");
  const partnerMaxBookingCount = watch("partner_max_booking_count");
  const partnershipOffers = watch("partnership_offers");

  const establishment = watch("establishment");
  const startDateTime = watch("startDateTime");
  const dateStart = startDateTime?.toISODate() ?? null;

  const { data: activeAccounts } = useFetchActivePartnershipAccounts({
    establishment,
    dateStart,
  });

  // ── COMBINED: auto-fill partner_max_booking_count ──────────────────────────
  useEffect(() => {
    const hasExistingValue =
      isEditMode &&
      partnerMaxBookingCount != null &&
      partnerMaxBookingCount > 0;
    if (hasExistingValue) return;

    const computed = Math.max(
      1,
      Math.floor(effectif * DEFAULT_SPOT_LIMIT_RATIO),
    );
    setValue("partner_max_booking_count", computed, { shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectif, isEditMode]); // intentionally omit partnerMaxBookingCount/setValue

  // ── Sync partnership_offers for any non-UNLIMITED strategy ───────────────
  // spot_limit default: effectif * 20% for COMBINED, divided by n for PER_PARTNER.
  // The BE ignores spot_limit for COMBINED but having a real default avoids nulls
  // if the user switches strategies.
  useEffect(() => {
    if (!activeAccounts) return;

    const activeAccountsCount = Math.max(1, activeAccounts.length);
    const defaultSpotLimit = Math.max(
      1,
      Math.floor((effectif * DEFAULT_SPOT_LIMIT_RATIO) / activeAccountsCount),
    );

    const syncedOffers: PartnershipOffer[] = activeAccounts.map((account) => {
      const existing = partnershipOffers.find(
        (po) => po.partnership === account.partnership,
      );
      return {
        partnership: account.partnership,
        partnership_identifier: account.partnership_identifier,
        allowed_on_partner: existing?.allowed_on_partner ?? true,
        spot_limit: existing?.spot_limit ?? defaultSpotLimit,
      };
    });

    setValue("partnership_offers", syncedOffers, { shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccounts, effectif]); // intentionally omit partnershipOffers/setValue

  return { activeAccounts };
};
