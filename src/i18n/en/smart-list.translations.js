import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKINGS_NUMBER_FILTER_IDENTIFIER,
  BOOKINGS_FILTER_IDENTIFIER,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  FIRST_BOOKING_FILTER_IDENTIFIER,
  GT_COMPARATOR,
  TAG_FILTER_IDENTIFIER,
  E_COMPARATOR,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

const DATE_AFTER = 0;
const DATE_BEFORE = 1;
const DATE_BETWEEN = 2;
const DATE_EXACT = 3;

const DURATION_AFTER = 4;
const DURATION_BEFORE = 5;
const DURATION_EXACT = 6;
const DURATION_BETWEEN = 7;
const DURATION_AFTER_PAST = 8;
const DURATION_BEFORE_PAST = 9;
const DURATION_EXACT_PAST = 10;
const DURATION_BETWEEN_PAST = 11;

export default {
  duplicate: 'Duplicate',
  name: 'Name of the list',
  description: 'Description',
  mails: 'Mails',
  multiSelector: {
    selectAll: 'Select all',
    paymentPacks: {
      helperText: 'select passes',
      helperSelectedText: 'selected passes',
      textFieldPlaceholder: 'Search a pass',
      helperAllSelectedText: 'all passes',
    },
    metaActivities: {
      helperText: 'select activities',
      helperSelectedText: 'selected activities',
      textFieldPlaceholder: 'Search an activity',
      helperAllSelectedText: 'all activities',
    },
    selectNothing: 'Unselect all',

    establishments: {
      helperText: 'select establishments',
      helperSelectedText: 'selected establishments',
      textFieldPlaceholder: 'Search an establishment',
      helperAllSelectedText: 'all establishments',
    },
    coaches: {
      helperText: 'select coaches',
      helperSelectedText: 'selected coaches',
      textFieldPlaceholder: 'Search a coach',
      helperAllSelectedText: 'all coaches',
    },
  },
  selectToShowPreview: 'Please select a template',
  exportList: 'Export list',
  membersInList: 'Members in the list:',
  modal: {
    delete: {
      title: 'Smart list deletion',
      content:
        'Are you sure you want to delete this smart list ? This operation is not revertable.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
  },
  graphs: {
    bookings: 'Bookings',
    expensesSegments: {
      title: { first: 'Expenses between', second: 'and' },
      label: {
        0: 'No expenses',
        1: 'First quartile',
        2: 'Moyen',
        3: 'Last quartile',
      },
    },
    bookingsSegments: {
      title: 'Last booking',
      label: {
        0: 'Last month',
        1: 'Between 1 and 12 months',
        2: 'More than 1 year',
      },
    },
  },
  detail: {
    tab: {
      member: 'General',
      campaign: 'Campaign',
    },
  },
  mail: {
    sendMail: 'Send email',
    sendMailTitle: 'Send mail to the list',
    cancel: 'Cancel',
    send: 'Send',
    noMailAvailable: 'No mail available, think about creating one',
    sendSuccess: 'Mail sending',
    sendError: 'Error while sending mail',
  },
  smart_list: {
    card: {
      description: 'Description',
    },
    actions: {
      configure: 'Configure',
    },
    list: { title: 'Smart lists', detailTitle: 'Details of the list' },
    name: 'Name',
    description: 'Description',
    submit: 'Save',
    cancel: 'Cancel',
    add: 'Add a list',
    detail: 'Details of the list',
    createTitle: 'Smart-list form',
  },
  filterCategory: {
    [MEMBER_INFO]: 'Members info',
    [PAYMENT_PACK]: 'Passes',
    [BOOKING]: 'Bookings',
    [BUY]: 'Buys',
  },
  filters: {
    calendarPicker: {
      text: {
        [DATE_BEFORE]: { first: 'the or before the' },
        [DATE_AFTER]: { first: 'the or after the' },
        [DATE_EXACT]: { first: 'the' },
        [DATE_BETWEEN]: { first: 'between', second: 'and' },
        [DURATION_BEFORE_PAST]: {
          first: 'before those',
          second: 'last days',
        },
        [DURATION_AFTER_PAST]: {
          first: 'in those',
          second: 'last days',
        },
        [DURATION_EXACT_PAST]: { first: '', second: 'days ago' },
        [DURATION_EXACT]: { first: 'in ', second: 'days' },
        [DURATION_AFTER]: { first: 'in more than', second: 'days' },
        [DURATION_BEFORE]: { first: 'in less than', second: 'days' },

        [DURATION_BETWEEN_PAST]: {
          first: 'from',
          second: 'to',
          third: 'days ago',
        },
        [DURATION_BETWEEN]: {
          first: 'in ',
          second: 'to',
          third: 'days',
        },
      },
      select: {
        [DATE_BEFORE]: 'The or before the',
        [DATE_AFTER]: 'The or after the',
        [DATE_EXACT]: 'The',
        [DATE_BETWEEN]: 'Between two dates',
      },
      selectduration: {
        [DURATION_BEFORE_PAST]: { first: '', second: 'days ago or more' },
        [DURATION_AFTER_PAST]: {
          first: '',
          second: 'days ago or less',
        },
        [DURATION_EXACT_PAST]: { first: ' ', second: 'days ago' },
        [DURATION_BEFORE]: {
          first: 'In less than',
          second: 'days',
        },
        [DURATION_AFTER]: {
          first: 'In more than',
          second: 'days',
        },
        [DURATION_EXACT]: { first: 'In', second: 'days' },
        [DURATION_BETWEEN]: {
          first: 'In a future period',
          second: 'days',
          third: 'and',
        },
        [DURATION_BETWEEN_PAST]: {
          first: 'In a past period',
          second: 'days',
          third: 'and',
        },
      },
      duration: 'days',
      durationTitle: 'Duration',
      dateTitle: 'Date',
    },
    booking_status: {
      canceled: 'canceled',
      booked: 'booked',
    },
    active_filters: 'Active filters on the list',
    add_filter: 'Add new filter',
    add: 'Add',
    before: 'before',
    after: 'after',
    classic_comparators: {
      [GTE_COMPARATOR]: 'greater (⩾)',
      [LTE_COMPARATOR]: 'lower (⩽)',
      [E_COMPARATOR]: 'equal',
      [LT_COMPARATOR]: 'strictly lower',
      [GT_COMPARATOR]: 'strictly greater',
    },
    durations_comparators: {
      [GTE_COMPARATOR]: 'less than (⩽)',
      [LTE_COMPARATOR]: 'more than (⩾)',
      [E_COMPARATOR]: 'exactly',
      [BETWEEN_COMPARATOR]: 'between two',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Credit',
      first: 'Credit is',
      second: ' than',
      third: 'euros',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Last booking',
      first: 'Last booking was before',
      second: 'days',
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sex',
      first: 'Toggle only',
      men: 'males',
      women: 'females',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: 'Passes validity',
      first: 'Passes',
      second: 'are usable',
    },
    [PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER]: {
      name: 'Purchase date and credits per pass',
      infoIcon: 'Unlimited passes are not filtered on credit',
      first: 'Has bought pass',
      second: 'between',
      third: 'and',
      fourth: 'and has',
      fifth: 'credits on it',
    },
    [TAG_FILTER_IDENTIFIER]: {
      name: 'Tags',
      first: 'Filter on tags',
    },
    [FIRST_BOOKING_FILTER_IDENTIFIER]: {
      name: 'First booking',
    },
    [EXPENSES_FILTER_IDENTIFIER]: {
      shop: 'Shop',
      pack: 'Pass',
      combo: 'Pack',
      private_pass: 'Private pass',
      workshop: 'Pass only workshop',
      name: 'Expenses',
      first: 'Has spent',
      second: '€ between the',
      third: 'and the',
      fourth: 'for the products',
      selector: 'Select products',
    },
    [MEMBER_DATE_JOINED_FILTER_IDENTIFIER]: {
      name: 'Date of registration',
      first: 'Has register to the club  ',
    },
    [BOOKINGS_NUMBER_FILTER_IDENTIFIER]: {
      name: 'Booking number',
      first: 'Has booked his ',
      second_singular: 'st lesson',
      second_plural: 'th lesson',
      activity: {
        first: 'of',
      },
      establishment: {
        first: 'in',
      },
      date: { first: 'Filter by date' },
    },
    [BOOKINGS_FILTER_IDENTIFIER]: {
      name: 'booking number',
      first: 'Has booked',
      second: 'lessons',
      activity: {
        first: 'of activities',
      },
      establishment: {
        first: 'in establishments',
      },
      payment_pack: {
        first: 'with passes',
      },
      coach: {
        first: 'with coaches',
      },
    },
    [PAYMENT_PACK_FILTER_IDENTIFIER]: {
      name: 'Passes',
      first: 'one of passes',
      has: 'Has',
      has_not: "Doesn't have",
      second: 'and',
      third: 'à',
      credits: { first: 'Credits:' },
      date_bought: { first: 'Purchase date' },
      expiration: {
        first_will_expire: 'Expires',
        first_has_expire: 'Has expired',
      },
      infoIcon: "Filter on credit doesn't apply to unlimited passes",
    },
    [BASKET_ABANDONMENT_FILTER_IDENTIFIER]: {
      name: 'Abandoned baskets',
      first: 'Has abandoned a basket worth',
      second: 'to',
      third: 'euros',
      date: { first: 'Abandoned basket', second: 'days' },
    },
  },
};
