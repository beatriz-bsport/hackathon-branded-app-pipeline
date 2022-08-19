// GRAPH FAMILIES
export const GRAPH_FAMILY_TEMPORAL = 'temporal';
export const GRAPH_FAMILY_QUALITATIVE = 'qualitative';
export const GRAPH_FAMILY_WEEK_TIMESLOTS = 'week_timeslots';
// ------------------------------------------

// GRAPH FAMILY PARAM NAMES
export const GRAPH_FAMILY_TEMPORAL_DATE_FIELD = 'date';
export const GRAPH_FAMILY_TEMPORAL_VALUE_FIELD = 'date_value';

export const GRAPH_FAMILY_QUALITATIVE_GROUP_BY_FIELD = 'group_by';
export const GRAPH_FAMILY_QUALITATIVE_VALUE_FIELD = 'group_by_value';
// ------------------------------------------

// GLOBAL PARAM NAMES
export const GRAPH_FAMILIES = 'graph_families';
export const GRAPH_FILTERABLE_DATE = 'filterable_date';

// GRAPH DATE TYPES
export const GRAPH_DATE_TYPE_RANGE = 'range';
export const GRAPH_DATE_TYPE_SINGLE = 'single';
export const GRAPH_DATE_TYPE_NONE = 'none';
// ------------------------------------------

export const CHART_COMPONENTS_CHOICES_PER_GRAPH_FAMILY = {
  temporal: ['bar', 'area'],
  qualitative: ['pie', 'qualitativeBar'],
  week_timeslots: ['timeslots'],
};

export const IDENTIFIER_NEEDING_TRANSLATION_FOR_VALUES = [
  'source',
  'attendance',
  'is_recurrent_booking',
  'activity_kind',
  'gender',
  'is_unpaid',
];

export const MEMBER_GRAPH_IDENTIFIER = 'graph_members';
export const BOOKING_GRAPH_IDENTIFIER = 'graph_bookings';
export const PRIVATE_BOOKING_GRAPH_IDENTIFIER = 'graph_private_bookings';
export const PAYMENT_GRAPH_IDENTIFIER = 'graph_payments';
export const SUBSCRIPTION_GRAPH_IDENTIFIER = 'graph_subscriptions';
