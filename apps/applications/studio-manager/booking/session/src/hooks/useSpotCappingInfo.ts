import { useCallback } from "react";

import {
  PartnerSpotCappingStrategy,
  type PartnershipOffer,
} from "@bsport/api-book";

export const useSpotCappingInfo = () => {
  const getSpotCappingInfo = useCallback(
    ({
      partner_max_booking_count,
      partner_spot_capping_strategy,
      partnership_offers,
    }: {
      partner_max_booking_count: number;
      partner_spot_capping_strategy: PartnerSpotCappingStrategy;
      partnership_offers: PartnershipOffer[];
    }) => {
      let partnerMaxBookingCount: number | null = partner_max_booking_count;
      const partnerSpotCappingStrategy = partner_spot_capping_strategy;
      let activePartnershipOffers: PartnershipOffer[] | undefined;

      switch (partner_spot_capping_strategy) {
        case PartnerSpotCappingStrategy.UNLIMITED:
          partnerMaxBookingCount = null;
          activePartnershipOffers = partnership_offers.map(
            (partnership_offer) => ({
              ...partnership_offer,
              spot_limit: null,
            }),
          );
          break;
        case PartnerSpotCappingStrategy.COMBINED:
          activePartnershipOffers = partnership_offers.map(
            (partnership_offer) => ({
              ...partnership_offer,
              spot_limit: null,
            }),
          );
          break;
        case PartnerSpotCappingStrategy.PER_PARTNER:
          partnerMaxBookingCount = null;
          activePartnershipOffers = partnership_offers ?? [];
          break;
      }

      return {
        partnerMaxBookingCount,
        partnerSpotCappingStrategy,
        partnershipOffers: activePartnershipOffers,
      };
    },
    [],
  );

  return { getSpotCappingInfo };
};
