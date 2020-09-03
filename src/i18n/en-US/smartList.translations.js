const {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKINGS_NUMBER_FILTER_IDENTIFIER,
  BOOKINGS_FILTER_IDENTIFIER,
  GTE_COMPARATOR,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  FIRST_BOOKING_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  E_COMPARATOR,
  BETWEEN_COMPARATOR,
  PRIVATE_PASS_FILTER_IDENTIFIER,
  PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
} = require('@bsport/common/lib/master-data/smart-list');

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
const DURATION_BEFORE_PAST = 9;
const DURATION_EXACT_PAST = 10;
const DURATION_BETWEEN_PAST = 11;

exports.default = {
  duplicate: 'Duplicate',
  name: 'Name of the list',
  search: 'Search a smartlist',
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
    buyables: {
      helperText: 'select categories',
      helperSelectedText: 'catégories sélected',
      textFieldPlaceholder: 'Search a category',
      helperAllSelectedText: 'all products',
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
    privatePass: {
      helperText: 'select private passes',
      helperSelectedText: 'selected private passes',
      textFieldPlaceholder: 'Search a private pass',
      helperAllSelectedText: 'all private passes',
      warning: 'Select at least one',
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
        [DURATION_BEFORE_PAST]: { first: 'More than', second: 'days ago' },
        [DURATION_EXACT_PAST]: { first: '', second: 'days ago' },
        [DURATION_BEFORE]: {
          first: 'in less than',
          second: 'days',
        },
        [DURATION_AFTER]: {
          first: 'in more than',
          second: 'days',
        },
        [DURATION_EXACT]: { first: 'In', second: 'days' },
        [DURATION_BETWEEN]: {
          first: 'in more than',
          third: 'days',
          second: 'days and less than',
        },
        [DURATION_BETWEEN_PAST]: {
          first: 'more than',
          third: 'days ago',
          second: 'days ago and less than',
        },
      },
      select: {
        [DATE_BEFORE]: 'The or before the',
        [DATE_AFTER]: 'The or after the',
        [DATE_EXACT]: 'The',
        [DATE_BETWEEN]: 'Between two dates',
      },
      selectduration: {
        selector: {
          [DURATION_BEFORE_PAST]: 'More than X days ago',
          [DURATION_EXACT_PAST]: 'X days ago',
          [DURATION_AFTER]: 'In more than X days',
          [DURATION_EXACT]: 'In X days',
          [DURATION_BETWEEN]: 'In more than X days and less than Y days',
          [DURATION_BETWEEN_PAST]:
            'More than X days ago and less than Y days ago',
        },
        [DURATION_BEFORE_PAST]: { first: 'More than', second: 'days ago' },
        [DURATION_EXACT_PAST]: { first: '', second: 'days ago' },
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
          first: 'In more than',
          second: 'days',
          third: 'and less than',
        },
        [DURATION_BETWEEN_PAST]: {
          first: 'More than',
          second: 'days ago',
          third: 'days ago and less than',
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
    comparators: {
      [GTE_COMPARATOR]: 'greater (⩾)',
      [LTE_COMPARATOR]: 'lower (⩽)',
      [E_COMPARATOR]: 'equal',
      [BETWEEN_COMPARATOR]: 'between two',
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
      explanation: 'Has X € on his account',
      between: 'and',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Last booking',
      first: 'Last booking was before',
      second: 'days',
      explanation: 'The last lesson booked happened X days ago',
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sex',
      first: 'Toggle only',
      men: 'males',
      women: 'females',
      explanation: 'Is male or female',
    },
    [TAG_FILTER_IDENTIFIER]: {
      name: 'Tags',
      first: 'Filter on tags',
      explanation: 'Has tag A and B',
    },
    [FIRST_BOOKING_FILTER_IDENTIFIER]: {
      name: 'First booking',
      explanation:
        'Has booked his first lesson of activity A, in establishment B...',
    },
    [EXPENSES_COMPLETE_FILTER_IDENTIFIER]: {
      explanation: 'Has spent X € on products A and B',
      shop: 'Shop',
      pack: 'Pass',
      combo: 'Pack',
      between: 'and',
      private_pass: 'Private pass',
      workshop: 'Pass only workshop',
      name: 'Expenses',
      first: 'Has spent',
      second: '€ for products',
      date: { first: 'expenses done' },
    },
    [MEMBER_DATE_JOINED_FILTER_IDENTIFIER]: {
      name: 'Date of registration',
      exlanation: 'Has register to the club the...',
      first: 'Has register to the club  ',
    },
    [PRIVATE_BOOKINGS_FILTER_IDENTIFIER]: {
      name: 'Number of private bookings',
      explanation:
        'Has booked X private bookings with coach A, in location B, with booking card C...',
      first: 'Has booked',
      second: 'private bookings',
      between: 'and',
      establishment: {
        first: 'in establishments',
        second: 'or',
        third: 'at home',
      },
      private_pass: {
        first: 'with private cards',
      },
      coach: {
        first: 'with coaches',
      },
      date: { first: 'filter by date' },
      hour: {
        first: 'the hour of the lesson is between',
        second: 'hour and',
        third: 'hour',
      },
    },
    [BOOKINGS_NUMBER_FILTER_IDENTIFIER]: {
      name: 'Booking number',
      first: 'Has booked his ',
      explanation:
        'Has booked his X th lesson of activity A, in establishment B...',
      second_singular: 'st lesson',
      second_plural: 'th lesson',
      activity: {
        first: 'of',
      },
      establishment: {
        first: 'in',
      },
      payment_pack: {
        first: 'with passes',
      },
      coach: {
        first: 'with coaches',
      },
      date: { first: 'filter by date' },
      hour: {
        first: 'the hour of the lesson is between',
        second: 'hour and',
        third: 'hour',
      },
    },
    [BOOKINGS_FILTER_IDENTIFIER]: {
      name: 'booking number',
      first: 'Has booked',
      explanation:
        'Has booked X lessons of activity A, in establishment B, with pass C...',
      second: 'lessons',
      between: 'and',
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
      hour: {
        first: 'the hour of the lesson is between',
        second: 'hour and',
        third: 'hour',
      },
    },
    [PAYMENT_PACK_FILTER_IDENTIFIER]: {
      name: 'Passes',
      first: 'one of passes',
      has: 'Has',
      has_not: "Doesn't have",
      second: 'and',
      third: 'à',
      explanation: 'Has bought payment pack A at date B and has C credits...',
      credits: { first: 'credits:' },
      date_bought: { first: 'purchase date' },
      expiration: {
        first_will_expire: 'expires',
        first_has_expire: 'has expired',
      },
      infoIcon: "Filter on credit doesn't apply to unlimited passes",
    },
    [PRIVATE_PASS_FILTER_IDENTIFIER]: {
      name: 'Private passes',
      first: 'one of private passes',
      has: 'Has',
      has_not: "Doesn't have",
      second: 'and',
      third: 'à',
      explanation: 'Has bought private pass A at date B and has C credits...',
      credits: { first: 'credits:' },
      date_bought: { first: 'purchase date' },
      expiration: {
        first_will_expire: 'expires',
        first_has_expire: 'has expired',
      },
    },
    [BASKET_ABANDONMENT_FILTER_IDENTIFIER]: {
      explanation: 'Has abandonned a basket of X €',
      name: 'Abandoned baskets',
      between: 'and',
      first: 'Has abandoned a basket worth',
      second: 'to',
      third: 'euros',
      date: { first: 'Abandoned basket', second: 'days' },
    },
  },
};
