import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  PAYMENT_PACK_EXPIRATION_IDENTIFIER,
  PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  GT_COMPARATOR,
  E_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

export default {
  mails: 'Mails',
  multiSelector: {
    selectAll: 'Select all',
    paymentPacks: {
      helperText: 'select passes',
      helperSelectedText: 'selected passes',
      textFieldPlaceholder: 'Search a pass',
    },
    metaActivities: {
      helperText: 'select activities',
      helperSelectedText: 'selected activities',
      textFieldPlaceholder: 'Search an activity',
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
      email: 'Emails',
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
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Credit',
      first: 'Credit is',
      second: ' than',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Last booking',
      first: 'Last booking was before',
      second: 'days',
    },
    [DATE_JOINED_FILTER_IDENTIFIER]: {
      name: 'Subscription date',
      first: 'Member subscribed',
      second: ' the   ',
      before: 'before',
      after: 'after',
    },
    [PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER]: {
      name: 'Pass (not) bought',
      first: 'Member',
      second: 'bought one of the following passes',
      has_bought: 'has',
      hasnt_bought: 'has never',
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sex',
      first: 'Toggle only',
      men: 'males',
      women: 'females',
    },
    [PAYMENT_PACK_EXPIRATION_IDENTIFIER]: {
      name: 'Expiration',
      first: "One of the following passes'",
      second: 'expires in',
      third: 'days',
    },
    [PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER]: {
      name: 'Passes available credits',
      first: 'Passes',
      second: 'credits are',
      third: 'than',
      infoIcon: 'Only concerns passes in validity',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: 'Passes validity',
      first: 'Passes',
      second: 'are usable',
    },
    [WENT_TO_ACTIVITY_FILTER_IDENTIFIER]: {
      name: 'Activity attendance',
      first: 'Went to activity',
      second: 'in the past',
      third: 'days',
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
    [BOOKING_ATTENDANCE_FILTER_IDENTIFIER]: {
      name: 'Number of lessons attendance',
      first: 'Attended to ',
      second: 'lessons those',
      third: 'last days',
    },
    [SENIORITY_FILTER_IDENTIFIER]: {
      name: 'Seniority',
      first: 'Member since',
      second: 'days',
    },
    [TAG_FILTER_IDENTIFIER]: {
      name: 'Tags',
      first: 'Filter on tags',
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
  },
};
