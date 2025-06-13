const getTranslations = async () => {
  const SMARTLIST = await import(
    '@bsport/common/lib/master-data/smart-list.js'
  );

  const {
    CREDIT_ACCOUNT_FILTER_IDENTIFIER,
    FILTER_BOOKING_LAST,
    GENDER_FILTER_IDENTIFIER,
    HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
    USER_HAS_PASSWORD_FILTER,
    LTE_COMPARATOR,
    EXPENSES_FILTER_IDENTIFIER,
    MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
    PAYMENT_PACK_FILTER_IDENTIFIER,
    BASKET_ABANDONMENT_FILTER_IDENTIFIER,
    BOOKINGS_NUMBER_FILTER_IDENTIFIER,
    BOOKINGS_FILTER_IDENTIFIER,
    EXPENSES_COMPLETE_FILTER_IDENTIFIER,
    GTE_COMPARATOR,
    FIRST_BOOKING_FILTER_IDENTIFIER,
    TAG_FILTER_IDENTIFIER,
    E_COMPARATOR,
    BETWEEN_COMPARATOR,
    PRIVATE_PASS_FILTER_IDENTIFIER,
    PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
    WAIVER_FILTER_IDENTIFIER,
    PAYMENT_METHOD_FILTER_IDENTIFIER,
    ACTIVE_PASSES_FILTER_IDENTIFIER,
    AGE_FILTER_IDENTIFIER,
    CUSTOM_FORMS_FILTER_IDENTIFIER,
    USER_MARKETING_NOTIFICATIONS_FILTER,
    NOTES_FILTER_IDENTIFIER,
    RELATIONS_FILTER_IDENTIFIER,
    USER_HAS_PHONE_FILTER_IDENTIFIER,
    TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
    FIRST_PURCHASE_FILTER_IDENTIFIER,
    REFERRER_FILTER_IDENTIFIER,
    REFERRED_MEMBERS_FILTER_IDENTIFIER,
  } = SMARTLIST;

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

  return {
    duplicate: 'Duplicate',
    name: 'Name of the Smartlist',
    usedInFranchiseCommmunication: 'Used in a campaign by your franchise',
    search: 'Search a Smartlist',
    description: 'Description',
    mails: 'Emails',
    multiSelector: {
      selectAll: 'Select all',
      paymentPacks: {
        helperText: 'select passes',
        helperSelectedText: 'selected passes',
        textFieldPlaceholder: 'Search a pass',
        helperAllSelectedText: 'all passes',
        warning: 'Select at least one pass',
      },
      metaActivities: {
        helperText: 'select activities',
        helperSelectedText: 'selected activities',
        textFieldPlaceholder: 'Search an activity',
        helperAllSelectedText: 'all activities',
        warning: 'Select at least one activity',
      },
      selectNothing: 'Unselect all',
      establishments: {
        helperText: 'select establishments',
        helperSelectedText: 'selected establishments',
        textFieldPlaceholder: 'Search an establishment',
        helperAllSelectedText: 'all establishments',
        warning: 'Select at least one establishment',
      },
      coaches: {
        helperText: 'select teachers',
        helperSelectedText: 'selected teachers',
        textFieldPlaceholder: 'Search a teacher',
        helperAllSelectedText: 'all teachers',
        warning: 'Select at least one teacher',
      },
      buyables: {
        helperAllSelectedText: 'all products',
        textFieldPlaceholder: 'Search for a product category',
        helperSelectedText: 'selected categories',
        helperText: 'select categories',
      },
      privatePass: {
        warning: 'Select at least one appointment pass',
        helperAllSelectedText: 'all appointment passes',
        textFieldPlaceholder: 'Search an appointment pass',
        helperSelectedText: 'selected appointment passes',
        helperText: 'select appointment passes',
      },
      privateServices: {
        warning: 'Select at least one appointment',
        helperAllSelectedText: 'all appointments',
        textFieldPlaceholder: 'Search an appointment',
        helperSelectedText: 'selected appointments',
        helperText: 'select appointments',
      },
      level: {
        beginner: 'beginner',
        advanced: 'advanced',
        select: 'select a level',
        warning: 'Select at least one level',
        intermediary: 'intermediate',
        all: 'all levels',
      },
      activePasses: {
        warning: 'Select at least one pass or one appointment pass',
        privatePassHelperText: 'There are no appointment passes to display.',
        paymentPackHelperText: 'no pass',
      },
      customForms: {
        warning: 'Select at least one form',
        helperAllSelectedText: 'all forms',
        textFieldPlaceholder: 'Search for a form',
        helperSelectedText: 'selected forms',
        helperText: 'select forms',
      },
      userMarketingNotifications: {
        warning: 'Activate at least one of the two options',
      },
    },
    selectToShowPreview: 'Select an email to see a preview of it.',
    exportList: 'Export Smartlist',
    downLoadSavedExport: 'Download previous export',
    membersInList: 'Members in this Smartlist',
    modal: {
      delete: {
        title: 'Delete Smartlist',
        content:
          "Are you sure that you want to delete this Smartlist? This action can't be undone.",
        cancel: 'Cancel',
        confirm: 'Delete',
        linkedToAFranchiseCommunication:
          'This smartlist is used by your franchise and cannot be deleted',
      },
      validate: 'Confirm',
    },
    graphs: {
      bookings: 'Bookings',
      expensesSegments: {
        title: { first: 'Expenses between', second: 'and' },
        label: {
          0: 'No expenses',
          1: 'First quartile',
          2: 'Average',
          3: 'Last quartile',
        },
      },
      bookingsSegments: {
        title: 'Closing of booking window',
        label: {
          0: 'Last month',
          1: 'Between 1 and 12 months',
          2: 'More than 1 year',
        },
      },
    },
    detail: {
      tab: { member: 'General', campaign: 'Campaign', statistic: 'Statistics' },
      statTitle: 'Statistics',
    },
    mail: {
      sendMail: 'Send a message',
      sendMailTitle: 'Send a message',
      cancel: 'Cancel',
      send: 'Send',
      noMailAvailable: 'There are no email templates available to display.',
      sendSuccess: 'Sending email...',
      sendError: 'Error while sending email',
    },
    smart_list: {
      actions: { configure: 'Configure', campaign: 'Campaigns' },
      list: { title: 'Smartlists', detailTitle: 'Smartlist details' },
      name: 'Name',
      description: {
        isEmpty: "There's no description to display.",
        label: 'Description',
      },
      submit: 'Save',
      cancel: 'Cancel',
      add: 'Add a Smartlist',
      detail: 'Smartlist details',
      createTitle: '[Form] Smartlist',
    },
    filterCategory: {
      [MEMBER_INFO]: 'Member information',
      [PAYMENT_PACK]: 'Passes',
      [BOOKING]: 'Bookings',
      [BUY]: 'Payments',
    },
    filters: {
      [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
        name: 'Account balance',
        first:
          'The account balance of the member is (including unpaid invoices)',
        second: ' than   ',
        third: '{{ currencyDisplay }}',
        explanation:
          'Segment members with a certain amount in their account balances',
        between: 'and',
      },
      [FILTER_BOOKING_LAST]: {
        explanation:
          'Segment customers according to when they last booked a class',
        second: 'day(s) ago and no upcoming bookings have been registered.',
        first: 'The last booking was more than',
        name: 'Last booking',
      },
      [MEMBER_DATE_JOINED_FILTER_IDENTIFIER]: {
        name: 'Sign-up date',
        first: 'Joined your studio on',
        explanation:
          'Segment members who joined on, after, before, or between certain dates',
      },
      [GENDER_FILTER_IDENTIFIER]: {
        name: 'Gender',
        first: 'Segment only',
        men: 'males',
        women: 'females',
        explanation:
          'Segment members according to if they identify as male or female',
      },
      [FIRST_BOOKING_FILTER_IDENTIFIER]: {
        name: 'First booking',
        explanation: "Display an overview of all members' first booking",
      },
      [EXPENSES_COMPLETE_FILTER_IDENTIFIER]: {
        name: 'Purchase history',
        workshop: 'Passes for workshops',
        private_pass: 'Appointment pass',
        between: 'and',
        combo: 'Pack',
        pack: 'Pass',
        shop: 'Webshop',
        explanation: 'Segment customers who have bought certain products',
        date: { first: 'completed purchases' },
        second: '{{ currencyDisplay }} for the products',
        first: 'Has spent',
      },
      [BASKET_ABANDONMENT_FILTER_IDENTIFIER]: {
        name: 'Abandoned carts',
        first: 'The value of the abandoned basket is',
        second: 'to',
        third: '{{ currencyDisplay }}',
        date: { first: 'Abandoned basket', second: 'days' },
        explanation:
          'Segment members who have products in their cart but have not completed their purchase',
        between: 'and',
      },
      [BOOKINGS_NUMBER_FILTER_IDENTIFIER]: {
        name: 'Segment customers with a certain number of bookings',
        first: 'Members that booked ',
        first_v2: 'Members that booked their ',
        second_singular: 'session(s)',
        second_singular_v2: 'th session',
        second_plural: 'session(s)',
        activity: { first: 'of' },
        establishment: { first: 'in' },
        date: { first: 'Filter by date' },
        hour: {
          third: 'hours',
          second: 'hours and',
          first: 'the beginning time of the session is between',
        },
        explanation:
          'Segment customers according to how many sessions they have booked, in which room, by which teacher, purchased by which pass',
        coach: { first: 'with the teachers' },
        payment_pack: { first: 'with the passes' },
        attendance: 'status:',
        level: { first: 'level ' },
      },
      [BOOKINGS_FILTER_IDENTIFIER]: {
        name: 'Number of bookings',
        first: 'Booked',
        second: 'session(s)',
        activity: { first: 'of activities' },
        establishment: { first: 'in establishments' },
        payment_pack: { first: 'with passes' },
        coach: { first: 'with teachers' },
        hour: {
          third: 'hours',
          second: 'hours and',
          first: 'starting between',
        },
        date: { first: 'occurring on' },
        explanation:
          'Segment customers according to how many classes they have booked, in which room, by which teacher, purchased with which pass',
        between: 'and',
        attendance: 'with status',
        level: { first: 'level' },
      },
      [PRIVATE_BOOKINGS_FILTER_IDENTIFIER]: {
        hour: {
          third: 'hours',
          second: 'hours and',
          first: 'beginning between',
        },
        date: { first: 'occurring on' },
        coach: { first: 'with the teachers' },
        private_pass: { first: 'with appointment pass' },
        establishment: {
          third: 'at home',
          second: 'or',
          first: 'in establishments',
        },
        between: 'and',
        second: 'appointment(s)',
        first: 'Booked',
        explanation:
          'Segment customers according to how many appointments they have booked, in which room, by which teacher, purchased by which pass',
        name: 'Number of appointments',
        private_service: { first: 'for appointments' },
      },
      [PAYMENT_PACK_FILTER_IDENTIFIER]: {
        name: 'Passes',
        first: 'one of the following passes',
        has: 'Owns',
        has_not: "Doesn't own",
        second: 'and',
        third: 'à',
        credits: {
          first: 'credits:',
          second: 'and',
          helperText: 'Filtered on {{count}} credit',
          helperText_plural: 'Filtered on {{count}} credits',
        },
        date_bought: { first: 'purchase date' },
        expiration: {
          first_will_expire: 'expires',
          first_has_expire: 'has expired',
        },
        infoIcon: "Filter on credit doesn't apply to unlimited passes",
        explanation:
          'Segment customers who have bought a pass on a certain date, with X number of remaining credits',
      },
      [PRIVATE_PASS_FILTER_IDENTIFIER]: {
        expiration: {
          first_has_expire: 'has expired',
          first_will_expire: 'expires',
        },
        date_bought: { first: 'purchase date' },
        credits: {
          second: 'and',
          first: 'credits:',
          helperText: 'Filtered on {{count}} credit',
          helperText_plural: 'Filtered on {{count}} credits',
        },
        third: 'at',
        second: 'and',
        has_not: "Doesn't own",
        has: 'Has',
        first: 'one of the appointment passes',
        name: 'Appointment passes',
        explanation:
          'Segment customers who have bought an appointment pass on a certain date, with X number of remaining credits',
      },
      [ACTIVE_PASSES_FILTER_IDENTIFIER]: {
        info: 'Blocked passes and blocked appointment passes are also taken into account',
        fourth: 'in total.',
        third: 'or',
        second: 'valid passes. Including',
        between: 'and',
        first: 'Members who have',
        name: 'Valid passes',
        explanation:
          'Segment customers who have X number of valid passes or appointment passes',
      },
      [USER_HAS_PASSWORD_FILTER]: {
        explanation:
          'Segment members who have registered a password with your bsport account',
        name: 'Password',
        explain:
          'Segment members who have registered a password with your bsport account',
      },
      [WAIVER_FILTER_IDENTIFIER]: {
        explanation:
          'Segment all members who have accepted your liability waiver',
        name: 'Liability waiver',
        explain: 'Segment all members who have accepted your liability waiver',
      },
      [PAYMENT_METHOD_FILTER_IDENTIFIER]: {
        expiryDateLabel: 'with an expiration date',
        owns: 'Select at least one payment method',
        does_not_own: 'There are no saved payment methods to display',
        labelFirst: 'Only filter on members',
        title: 'Saved payment method',
        explanation:
          'Segment members according to who has saved a payment method or not',
        name: 'Payment methods',
      },
      [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
        name: 'Validity of the passes',
        first: 'Passes',
        second: 'are usable',
        explanation: 'Owns valid pass X',
      },
      [TAG_FILTER_IDENTIFIER]: {
        name: 'Tags',
        first: 'Segment by tags',
        explanation: 'Segment members according to their tags',
      },
      [EXPENSES_FILTER_IDENTIFIER]: {
        shop: 'Webshop',
        pack: 'Pass',
        combo: 'Pack',
        private_pass: 'Appointment pass',
        workshop: 'Passes for workshops',
        name: 'Expenditure',
        first: 'Has spent',
        second: '{{ currencyDisplay }} between',
        third: 'and',
        fourth: 'for the products',
        selector: 'Select products',
        explanation: 'Has bought A and B',
      },
      [AGE_FILTER_IDENTIFIER]: {
        explanation: 'Segment members according to their age',
        second: 'years (included)',
        to: ' ',
        between: 'and',
        first: 'Is',
        name: 'Age',
      },
      [CUSTOM_FORMS_FILTER_IDENTIFIER]: {
        hasCompletedNone: 'Has completed',
        date: { first: 'completed for the last time' },
        explanation:
          'Segment members by how many forms they have completed on certain dates',
        between: 'and',
        to: ' ',
        third: 'at a percentage',
        all: 'all forms',
        atLeastOne: 'at least one form',
        first: 'Has completed',
        second: 'among',
        none: 'no form',
        hasNotCompleted: 'Has not completed',
        hasCompleted: 'Has completed',
        name: 'Forms',
      },
      [USER_MARKETING_NOTIFICATIONS_FILTER]: {
        explanation:
          'Segment members who have given consent for notifications by SMS or Email',
        email: 'to receive notifications by email',
        sms: 'to receive notifications by SMS',
        false: "Doesn't accept",
        true: 'Accepts',
        and: 'And',
        or: 'Or',
        oneNeeded: 'At least one of the activated conditions must be filled',
        allNeeded: 'All activated conditions must be filled',
        name: 'Consent for notifications',
      },
      [NOTES_FILTER_IDENTIFIER]: {
        explanation: 'Segment members who have at least one note',
        date: { first: 'which was created' },
        info: 'The so-called medical notes correspond to those listed in the "Alerts" section on the member\'s form',
        nonMedical: 'non-medical',
        medical: 'medical',
        medicalOrNot: 'medical or not',
        first: 'Has at least one note',
        name: 'Informative notes',
      },
      [RELATIONS_FILTER_IDENTIFIER]: {
        explanation:
          'Segment members who have relationships (such as dependents) or shared passes',
        acceptEmail: {
          second: 'emails',
          false: "doesn't accept",
          true: 'accepts',
          first: 'the relationship',
        },
        acceptSms: {
          second: 'SMS',
          false: "doesn't accept",
          true: 'accepts',
          first: 'the relationship',
        },
        receiveCopyOfEmail: {
          second: 'with a copy to the member',
          false: 'are not sent',
          true: 'are also sent',
          first: 'emails sent to the relationship',
        },
        info: {
          consumerPrivatePasses:
            '"valid" means that the pass can be used now to book an appointment',
          consumerPaymentPacks:
            '"valid" means that the pass can be used now to book a group activity',
        },
        validOrNot: 'valid or not',
        valid: 'valid',
        bookings:
          'of group activities and appointments thanks to a pass shared by the member',
        consumerPrivatePasses: 'of appointment passes',
        consumerPaymentPacks: 'of passes',
        fourth: 'the relationship has booked a number',
        third: 'the member has shared with the relationship a number',
        second: 'of relations that respect the selected filters:',
        first: 'Has a number',
        between: 'and',
        to: ' ',
        date: { first: 'the relationship has been established' },
        name: 'Shared passes',
      },
      [USER_HAS_PHONE_FILTER_IDENTIFIER]: {
        explanation: 'Segment members who have provided a phone number',
        first: 'a phone number',
        true: 'Filled in',
        false: "Didn't fill in",
        name: 'Phone number',
      },
      [TERMS_AND_CONDITIONS_FILTER_IDENTIFIER]: {
        explanation:
          'Segment members who have accepted the general conditions of use',
        first: 'your conditions of use',
        false: 'Did not accept',
        true: 'Has accepted',
        name: 'Conditions of use',
      },
      [FIRST_PURCHASE_FILTER_IDENTIFIER]: {
        name: 'First purchase',
        explanation:
          'Segment members who have completed their first purchase between certain dates',
        booleanChoice: {
          before: 'The first purchase is',
          is: 'done',
          is_not: 'not yet done',
        },
        filterByDate: {
          before: 'Filter by date',
        },
        numbersComparator: {
          payment: {
            before: 'The amount of the first purchase was',
            between: 'and',
            after: '{{currency}}',
          },
        },
      },
      [REFERRER_FILTER_IDENTIFIER]: {
        name: 'Referrers',
        explanation: 'Segment members who have referred other members',
        numbersComparator: {
          reward: {
            before: 'The member obtained',
            between: 'and',
            after: 'rewards as a referrer',
          },
          referred: {
            before: 'The member referred',
            between: 'and',
            after: 'members',
            tooltip:
              'Members who have not referred anyone may also be included',
          },
          money: {
            before: 'The member obtained',
            between: 'and',
            after: '{{currency}} as a referrer',
          },
        },
      },
      [REFERRED_MEMBERS_FILTER_IDENTIFIER]: {
        name: 'Referred members',
        explanation:
          'Segement members who have used a referral link to sign up',
        booleanChoice: {
          before: 'The member',
          is: 'is',
          is_not: 'is not',
          after: 'a referred member',
        },
        numbersComparator: {
          money: {
            before: 'The member obtained',
            between: 'and',
            after: '{{currency}} as a referred member',
          },
        },
      },
      calendarPicker: {
        text: {
          [DATE_BEFORE]: { first: 'on or before' },
          [DATE_AFTER]: { first: 'the or after the' },
          [DATE_EXACT]: { first: 'the' },
          [DATE_BETWEEN]: { first: 'between', second: 'and' },
          [DURATION_BEFORE_PAST]: {
            first: 'before those',
            second: 'last days',
          },
          [DURATION_AFTER_PAST]: { first: 'in those', second: 'last days' },
          [DURATION_EXACT_PAST]: { first: 'There is ', second: 'days ago' },
          [DURATION_EXACT]: { first: 'in ', second: 'days' },
          [DURATION_AFTER]: { first: 'in more than', second: 'days' },
          [DURATION_BEFORE]: { first: 'in less than', second: 'days' },
          [DURATION_BETWEEN_PAST]: {
            first: 'from',
            second: 'to',
            third: 'days ago',
          },
          [DURATION_BETWEEN]: {
            first: 'in more than',
            second: 'to',
            third: 'days',
          },
        },
        select: {
          [DATE_BEFORE]: 'On or before',
          [DATE_AFTER]: 'On or after',
          [DATE_EXACT]: 'On',
          [DATE_BETWEEN]: 'Between two dates',
        },
        selectduration: {
          selector: {
            [DURATION_BEFORE_PAST]: 'There is more than X days',
            [DURATION_EXACT_PAST]: 'There is X days',
            [DURATION_AFTER]: 'In more than X days',
            [DURATION_EXACT]: 'In X days',
            [DURATION_BETWEEN]: 'In more than X days and less than Y days',
            [DURATION_BETWEEN_PAST]:
              'There is more than X days and less than Y days',
          },
          [DURATION_BEFORE_PAST]: {
            first: 'There is more than',
            second: 'days ago or more',
          },
          [DURATION_EXACT_PAST]: { first: ' ', second: 'days ago' },
          [DURATION_BEFORE]: { first: 'In less than', second: 'days' },
          [DURATION_AFTER]: { first: 'In more than', second: 'days' },
          [DURATION_EXACT]: { first: 'In', second: 'days' },
          [DURATION_BETWEEN]: {
            first: 'In more than',
            second: 'days',
            third: 'days and less than',
          },
          [DURATION_BETWEEN_PAST]: {
            first: 'There is more than',
            second: 'days',
            third: 'days and less than',
          },
        },
        duration: 'days',
        durationTitle: 'Duration',
        dateTitle: 'Date',
      },
      booking_status: { canceled: 'canceled', booked: 'booked' },
      active_filters: 'Parameters active in this Smartlist',
      add_filter: 'Add parameters',
      add: 'Add',
      before: 'before',
      after: 'after',
      durations_comparators: {
        [LTE_COMPARATOR]: 'less than (⩽)',
        [GTE_COMPARATOR]: 'more than (⩾)',
        [E_COMPARATOR]: 'exactly',
        [BETWEEN_COMPARATOR]: 'between two',
      },
      all: 'All',
      isEmpty:
        'This segment shows all of your members as no parameters have been set.',
      comparators: {
        [GTE_COMPARATOR]: 'more than (⩾)',
        [LTE_COMPARATOR]: 'less than (⩽)',
        [E_COMPARATOR]: 'equal to',
        [BETWEEN_COMPARATOR]: 'between two',
      },
      attendanceTrue: 'present',
      attendanceFalse: 'absent',
      attendanceWarning: 'Select a status',
    },
    noSmartLists:
      'Smartlists are specific segments of your member data base. Add filters to directly send messages (emails, push notifications, SMSes) to these target audiences and gather detailed information about the opening rates, click rates, etc. for increasing customer retention and client value.',
    delete: 'Delete',
    edit: 'Configure',
    tag_rules: {
      tag_group: 'Main Tag',
      tag_name: 'Sub Tag',
      cancel: 'Cancel',
      display_tag_rules: 'Automatic Tagging',
      associated_tag: 'Associated tag',
      create: 'Add a rule',
      tag_on_left: 'Tag if a member has left this Smartlist',
      tag_on_join_and_untag_on_left:
        'Tag if a member is present in this Smartlist',
      tag_on_join: 'Tag if a member enters this Smartlist',
      type_of_rule: 'Type of rule',
      activeSince: 'Activated on: {{ since }}',
      asyncDialog: {
        message: 'All tags for customers in this Smartlist will be updated.',
        title: 'Update tagging rules',
      },
      tag: 'Tag',
    },
    memberBase: {
      options: {
        0: 'Archived and Non-archived',
        1: 'Non-archived',
        2: 'Archived',
      },
      helperText: 'Choose which members you want to show in this Smartlist:',
    },
    popup: { sendPopup: 'Send a pop-up' },
    cadenceListDialog: { close: 'Close', title: 'List of the cadences' },
    cadence: {
      content: 'Used in the cadence: {{- cadence_name }}',
      content_plural: 'Used in {{ count }} cadences',
    },
    cannotBeDeletedDialog: {
      content:
        'You cannot delete this smartlist as long as it is used in the following cadence:',
      content_plural:
        'You cannot delete this smartlist as long as it is used in the following cadences:',
      cancel: 'Close',
      title: 'Used in one of the cadences',
    },
    audienceListDialog: {
      title: 'List of the {{ workflowPluralLowerCase }}',
    },
    audience: {
      content: 'Used in the {{ workflowLowerCase }}: {{- workflow_name }}',
      content_plural: 'Used in {{ count }} {{ workflowPluralLowerCase }}',
    },
    cannotBeDeletedDialogAudience: {
      content:
        'You cannot delete this smartlist as long as it is used in the following {{ workflowLowerCase }}:',
      content_plural:
        'You cannot delete this smartlist as long as it is used in the following {{ workflowPluralLowerCase }}:',
      title: 'Used in one of the {{ workflowPluralLowerCase }}',
    },
    generateExport: 'Generate export',
    generateHelperText: 'Generate export to download smartlist',
    lastGenerated: 'Last export generated on : {{-date}} {{time}}',
    generateReport: 'Generate report',
    downloadReport: 'Download report',
    communication: {
      scheduled: {
        nextScheduledMessage: 'Next scheduled message',
        isEmpty: 'There are no messages scheduled.',
        viewAll: 'See all',
        total: 'Total scheduled messages: {{ count }}',
      },
    },
  };
};

exports.default = getTranslations();
