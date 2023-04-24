// @ts-nocheck
export const enum PropagateCoachOverrideToSimilarOffers {
  NO_PROPAGATION = 0,
  PROPAGATE_TO_OFFERS_WITH_SAME_COACH_OVERRIDE_ONLY = 1,
  PROPAGATE_TO_ALL = 2,
}

export const SIMILAR_OFFERS_PAGE_SIZE = 5;

export const OFFER_EDIT_FORM_STEPS = {
  GATHER_INFO: 0,
  SHOW_WARNING: 1,
};

export const OFFER_EDIT_FORM_FIELDS = [
  'broadcast_link',
  'establishment',
  'establishment_override',
  'coach',
  'coach_override',
  'duration_minute',
  'effectif',
  'partner_max_booking_count',
  'credit_price_override',
  'waiting_list_max_size',
  'level',
  'meta_activity',
  'coach_payment_rule',
  'whitelist_tags',
  'blacklist_tags',
];
