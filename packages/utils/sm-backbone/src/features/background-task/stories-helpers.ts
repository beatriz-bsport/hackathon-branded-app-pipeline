import type { SessionCreationPayload } from "@bsport/api-book";

const generateDates = () => {
  const timestamp = Date.now() / 1000;
  return Array(2)
    .fill(1)
    .map((_, index) => timestamp + (index + 1) * 24 * 60 * 60);
};

export const CREATE_SESSION_PAYLOAD = {
  name_override: "",
  description_override: "",
  manager_only: true,
  credits: 1,
  waiting_list_max_size: 5,
  effectif: 8,
  available_on_partnership: true,
  partner_max_booking_count: null,
  partner_spot_capping_strategy: "UNLIMITED",
  partnership_offers: [
    {
      partnership: 5,
      partnership_identifier: "wellhub",
      allowed_on_partner: true,
      spot_limit: null,
    },
    {
      partnership: 4,
      partnership_identifier: "usc",
      allowed_on_partner: true,
      spot_limit: null,
    },
    {
      partnership: 11,
      partnership_identifier: "myclubs",
      allowed_on_partner: true,
      spot_limit: null,
    },
  ],
  duration_minute: 60,
  level: 1,
  is_hybrid: false,
  coach: 156,
  coach_payment_rule: null,
  broadcast_link: "",
  establishment: 29,
  room_blueprint: 65,
  meta_activity: 8,
  dates: generateDates(),
  wellhub_product_id: 735612,
  allow_guest_offer: true,
  blacklist_tags: [],
  whitelist_tags: [],
} as SessionCreationPayload;
