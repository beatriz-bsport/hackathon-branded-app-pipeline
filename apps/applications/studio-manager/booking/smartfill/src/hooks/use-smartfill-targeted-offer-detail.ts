import { useQuery } from "@tanstack/react-query";

import type { SmartfillOfferDisplay } from "#src/hooks/use-smartfill-targeted-offers";
import { fetch } from "#src/utils/fetch";

export type SmartfillNotificationMember = {
  id: number;
  full_name: string;
  avatar_url: string;
};

export type SmartfillNotification = {
  id: number;
  run_id: number;
  communication_sent_id: number;
  date_created: string;
  date_sent: string | null;
  member_id: number;
  member: SmartfillNotificationMember | null;
  booked: boolean;
};

export type SmartfillTargetedOfferDetail = {
  id: number;
  offer_id: number;
  offer: SmartfillOfferDisplay | null;
  date_created: string;
  notifications_count: number;
  booked_count: number;
  latest_run_date_created: string | null;
  notifications: SmartfillNotification[];
};

export const SMARTFILL_TARGETED_OFFER_DETAIL_QUERY_KEY = (id: number) =>
  ["@sm-smartfill", "targeted-offers", id] as const;

export const useSmartfillTargetedOfferDetail = (id: number | null) =>
  useQuery({
    queryKey: SMARTFILL_TARGETED_OFFER_DETAIL_QUERY_KEY(id ?? -1),
    queryFn: async () => {
      const { data } = await fetch<SmartfillTargetedOfferDetail>(
        `book/v1/smartfill/targeted-offers/${id}/`,
      );
      return data;
    },
    enabled: id != null,
  });
