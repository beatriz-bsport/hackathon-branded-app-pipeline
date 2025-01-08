const getTranslations = async () => {
  const {
    UNEVEN_INVOICE_ALERT,
    NEW_ORDER_ALERT,
    REMINDER_NOTE_ALERT_KIND,
    UNREAD_COMMUNICATION,
    PRIVATE_BOOKING_INCOMPLETE_ALERT,
    COMPANY_ONBOARDING_ALERT,
    UNPAID_PRIVATE_BOOKING_ALERT,
    NEW_TUTORIAL_SECTION_OR_LESSON,
    REPLACEMEMENT_REQUEST_LATE_ALERT_KIND,
  } = await import('@bsport/common/master-data/alerting_kind.js');

  return {
    list: {
      title: 'Notifications',
      emptyAlerting: 'No new notification to display.',
    },
    alert_kind: {
      [UNEVEN_INVOICE_ALERT.alert_kind]: 'Billing',
      [NEW_ORDER_ALERT.alert_kind]: 'Orders',
      [REMINDER_NOTE_ALERT_KIND.alert_kind]: 'Tasks',
      [PRIVATE_BOOKING_INCOMPLETE_ALERT.alert_kind]: 'Appointment to complete',
      [UNREAD_COMMUNICATION.alert_kind]: 'Inbox',
      [COMPANY_ONBOARDING_ALERT.alert_kind]: 'Legal information',
      [UNPAID_PRIVATE_BOOKING_ALERT.alert_kind]: 'Unpaid appointments',
      [NEW_TUTORIAL_SECTION_OR_LESSON.alert_kind]: 'Tutorials',
      [REPLACEMEMENT_REQUEST_LATE_ALERT_KIND.alert_kind]: 'Late substitutions',
    },
    showMore: 'Show more',
    unevenInvoice: {
      title: 'Unpaid invoices',
      explainUneven:
        'Invoice <1>{{ invoice_identifier }}</1> has not been finalised yet.',
      priceDue: 'Amount due: {{ price_due }}.',
      pricePayed: 'Amount paid: {{price_payed }}.',
    },
    newOrder: {
      title: 'Pending Order',
      explain: 'Paid by <1>{{- name }}</1> on the store.',
      price: 'Amount: {{ price }}.',
    },
    task: { name: '{{ name }}' },
    privateBookingIncomplete: {
      explain: 'The appointment of <1>{{- name }}</1> has no assigned teacher.',
      name: 'Member: {{- user_name }}',
      date: 'Date: {{ date_start }}',
    },
    companyOnboarding: {
      creation: {
        content:
          'Please check your legal and banking information to be able to process online payments.',
        title: 'Online payments are currently disabled',
      },
      payout: {
        content:
          'Payouts cannot be processed due to the fact that the account verification has not been completed or has been done so incorrectly.',
        title: 'Incomplete banking details',
      },
      verification: {
        warning: 'Online payments may be <1> deactivated </1> after this date!',
        content:
          'Several documents are pending validation to verify your account. The deadline is: <1> {{date}} </1>.',
        title: 'Business management',
      },
      paypal: {
        title: 'PayPal payments are disabled',
        primary_email_confirmation:
          'The email for your PayPal account requires confirmation. Please check your PayPal account to resolve this issue.',
        requires_more_information:
          'Your PayPal account requires additional information or validation from PayPal. Please check your PayPal account to resolve this issue.',
        issue_check_account:
          'There is an issue with your PayPal account. Please check your PayPal account to resolve this issue.',
        issue_repeat_onboarding:
          'There is an issue with your PayPal account. Please repeat the connection process using the same account to resolve this issue.',
      },
    },
    unpaidPrivateBooking: { credits_due: '{{ credits }} unpaid credit(s)' },
    newTutorialSectionOrLesson: {
      newLesson: {
        content: 'Added to the {{- name}} section',
        title: 'New lesson {{- name}}',
      },
      newSection: {
        content: 'The {{- name}} tutorial has been added, get trained now.',
        title: 'New Section',
      },
    },
    readAll: 'Mark all as read',
    lateReplacementRequest: {
      content:
        'requested a substitution for the following session: {{- activity_name}} - {{-date_start}}',
      title: 'Late substitution',
    },
  };
};

exports.default = getTranslations();
