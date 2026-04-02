import { useCallback } from "react";

import { PartnerSpotCappingStrategy } from "@bsport/api-book";

export const useSpotCappingInfo = () => {
  const getSpotCappingInfo = useCallback(
    ({
      partner_max_booking_count,
      partner_spot_capping_strategy,
    }: {
      partner_max_booking_count: number;
      partner_spot_capping_strategy: PartnerSpotCappingStrategy;
    }) => {
      let partnerMaxBookingCount: number | null = partner_max_booking_count;
      const partnerSpotCappingStrategy = partner_spot_capping_strategy;

      switch (partner_spot_capping_strategy) {
        case PartnerSpotCappingStrategy.UNLIMITED:
          partnerMaxBookingCount = null;
          break;
        case PartnerSpotCappingStrategy.COMBINED:
          // partnerMaxBookingCount is already set to the combined limit
          break;
        case PartnerSpotCappingStrategy.PER_PARTNER:
          partnerMaxBookingCount = null;
          //TODO: handle per-aggregator limits here
          break;
      }

      return { partnerMaxBookingCount, partnerSpotCappingStrategy };
    },
    [],
  );

  return { getSpotCappingInfo };
};
