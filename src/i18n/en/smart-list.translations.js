import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  // BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  HAS_BOOKED_META_ACTIVITY_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  GT_COMPARATOR,
  E_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

export default {
  modal: {
    delete: {
      title: 'Smart list deletion',
      content:
        'Are syou sure you want to delete this smart list ? This operation is not revertable.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
  },
  detail: {
    tab: {
      member: 'General',
      email: 'Emails',
    },
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
  filters: {
    active_filters: 'Active filters on the list',
    add: 'Add new filter',
    before: 'before',
    after: 'after',
    classic_comparators: {
      [GTE_COMPARATOR]: 'greater',
      [LTE_COMPARATOR]: 'lower',
      [E_COMPARATOR]: 'equal',
      [LT_COMPARATOR]: 'strictly lower',
      [GT_COMPARATOR]: 'strictly greater',
    },
    durations_comparators: {
      [GTE_COMPARATOR]: 'less than',
      [LTE_COMPARATOR]: 'more than',
      [E_COMPARATOR]: 'exactly',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Credit',
      first: 'Members whose credit is',
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
    [PAYMENT_PACK_FILTER_IDENTIFIER]: {
      name: 'Payment pack',
      first: 'Members that already bought payment pack',
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sex',
      first: 'Toggle only',
      men: 'males',
      women: 'females',
    },
    [PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER]: {
      name: 'Payment pack available credits',
      first: 'Members whose payment pack',
      second: 'credits are',
      third: 'than',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: 'Payment pack validity',
      first: 'Members whose payment pack',
      second: 'is usable',
    },
    [HAS_BOOKED_META_ACTIVITY_FILTER_IDENTIFIER]: {
      name: 'Activity booked',
      first: 'Members has booked activity',
      second: 'in the past',
      third: 'days',
    },
    [SENIORITY_FILTER_IDENTIFIER]: {
      name: 'Seniority',
      first: 'Members since',
      second: 'days',
    },
  },
};
