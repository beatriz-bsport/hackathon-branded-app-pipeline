const getTranslations = async () => {
  const PAYMENT_METHOD = await import(
    '@bsport/common/lib/master-data/subscription-payment-methods.js'
  );

  const {
    BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
    BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
    BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
  } = PAYMENT_METHOD;

  const {
    BILLING_PLAN_STATUS_NOT_STARTED,
    BILLING_PLAN_STATUS_STARTED,
    BILLING_PLAN_STATUS_STOPPED,
    BILLING_PLAN_STATUS_PAUSED,
    BILLING_PLAN_STATUS_ENDED,
  } = await import('@bsport/common/lib/master-data/subscription-status.js');

  const {
    PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
    PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  } = await import('@bsport/common/lib/master-data/payment-group.js');

  const { BILLING_PLAN_EVENTS } = await import(
    '@bsport/common/lib/master-data/events.js'
  );

  return {
    events: {
      list: { title: 'Last events' },
      [BILLING_PLAN_EVENTS.pause]: 'Paused payments',
      [BILLING_PLAN_EVENTS.pause_deleted]: 'Pause cancelled',
      [BILLING_PLAN_EVENTS.create]: 'Create',
      [BILLING_PLAN_EVENTS.stop]: 'Subscription terminated by',
      [BILLING_PLAN_EVENTS.renew]: 'Automatic renewals',
      [BILLING_PLAN_EVENTS.payment_dispute]: 'Payment: disputed',
      [BILLING_PLAN_EVENTS.payment_success]: 'Payment: successful',
      [BILLING_PLAN_EVENTS.payment_failure]: 'Payment: refused',
      [BILLING_PLAN_EVENTS.update_payment_method]: 'Payment method updated',
      [BILLING_PLAN_EVENTS.update_payment_pack]: 'Modified passes',
      [BILLING_PLAN_EVENTS.update_private_pass]: 'Modified appointment passes',
      [BILLING_PLAN_EVENTS.update_payment_combo]: 'Modified packs',
      [BILLING_PLAN_EVENTS.update]: 'Subscription modified',
    },
    table: { noContent: 'There are no subscribers to display.' },
    subscription: {
      list: { title: 'Current subscriptions' },
      actions: {
        switchPaymentMethod: 'Change the payment method',
        switchPack: 'Edit pass',
        freeze: 'Pause',
        advanceTime: 'Advance the invoice',
        postPone: 'Postpone the invoice',
        changeDate: 'Edit date',
        showInvoice: 'See invoice',
        changePrice: 'Edit price',
        stop: 'Stop after this invoice',
        disableAutoRenew: 'Deactivate automatic renewals',
        enableAutoRenew: 'Activate auto-renew',
      },
      freeze: {
        form: {
          submit: 'Save',
          cancel: 'Cancel',
          explainWarning: "Attention: this action can't be undone.",
          explain:
            'Indicate the number of days that the next and future payments will be postponed with.',
          days: { label: 'Number of days' },
          name: { placeholder: 'Bank holidays', label: 'Note' },
          title: 'Paused',
          explainInvoice:
            "Select from which invoice you'd like to pause this subscription:",
        },
        disabledReasons: {
          month_billing_day: "It's not possible to pause a fixed day contract ",
        },
      },
      switchPack: {
        form: {
          submit: 'Save',
          cancel: 'Cancel',
          warning:
            'Billing will stay the same, if you want to increase/decrease monthly amount, modify each invoice separately.',
          explain:
            'This pass will be replaced on all future invoices and sessions from the previous pass will also be transferred.',
          title: 'Pass modification',
        },
      },
      pauseSection: 'Pauses',
      invoicesSection: 'Invoices',
      actionSection: 'Manage',
      delete: 'Delete',
      register: 'Subscribe',
      edit: 'Edit',
      buy: 'Purchase',
      scheduledStop: {
        title: 'Cancel this subscription',
        explain: 'Choose the last payment for the subscription.',
        listItem: 'Stop this subscription',
        summary:
          'The last payment will be processed on {{-date}}, which corresponds to the last valid pass.',
        notePlaceholder: 'Reason',
      },
      invoice: { label: 'Invoice {{uuid}} : {{price}}' },
      listItem: {
        nextBillingDate: 'Upcoming billing date: {{ d }}',
        startingAt: 'Start date: {{ d }}',
        recurrencePriceIs: 'Recurring payment: {{currencyDisplay}}{{amount }}',
      },
      switchPaymentCombo: {
        form: {
          submit: 'Save',
          cancel: 'Cancel',
          warning:
            'The billing will remain the same. Modify each invoice separately if you wish you increase/decrease the monthly amount.',
          prewarning: 'Cancel the subscription to modify all future invoices.',
          explain:
            'The new pack will replace the previous pack on all invoices after the automatic renewal of the subscription.',
          title: 'Pack has been updated',
        },
      },
      switchPrivatePass: {
        form: {
          submit: 'Save',
          cancel: 'Cancel',
          warning:
            'The billing will remain the same. Modify each invoice separately if you wish you increase/decrease the monthly amount.',
          explain:
            'This appointment pass will be replaced on all future invoices and sessions from the previous appointment pass will also be transferred.',
          title: 'Appointment pass has been updated',
        },
      },
      prorata: {
        helperOnSusscribe:
          'The first payment is pro-rated at {{ priceWithCurrency }} and will be collected on {{-firstBillingDate}}. Subsequent payments will be made on every {{ monthBillingDay }} of the month, in the amount of {{ recurrentPrice }}',
      },
    },
    contract: {
      registerManager: {
        title: 'Recurring payment',
        explainChoseContract:
          "Select a subscription that'll be billed on a monthly basis",
        actions: { cancel: 'Cancel' },
        explainCustomSubscriptionForm: 'Add a custom subscription',
      },
      description: 'Description',
      legal: 'Terms',
      commitmentPeriod: {
        label: 'Commitment period',
        explain: {
          day: 'This subscription will commit the member for {{ commitment_period_value }} day.',
          day_plural:
            'This subscription will commit the member for {{ commitment_period_value }} days.',
          week: 'This subscription will commit the member for {{ commitment_period_value }} week.',
          week_plural:
            'This subscription will commit the member for {{ commitment_period_value }} weeks.',
          month:
            'This subscription will commit the member for {{ commitment_period_value }} month.',
          month_plural:
            'This subscription will commit the member for {{ commitment_period_value }} months.',
          year: 'This subscription will commit the member for {{ commitment_period_value }} year.',
          year_plural:
            'This subscription will commit the member for {{ commitment_period_value }} years.',
        },
      },
      actions: {
        iAcceptCondition: 'I accept the terms.',
        iwanttostarton: 'Preferred starting date of this subscription: ',
        subscribe: 'Subscribe',
        create: 'Add a subscription',
        iAcceptGeneralCondition: ' I accept the terms.',
        alertPastDateSameMonth:
          'Please note that you have chosen a past date, if the subscription includes a pass, the validity of the pass will start on the selected date. In the case of a one month validity, your member will lose {{lostDays}} days of validity.',
        title: 'Past date',
        iAcceptContractTerms: 'I accept the <0>terms</0>.',
        acceptContractTerms: 'Agree to the <0>terms and conditions</0>',
      },
      duration: '{{month}} bills',
      autoRenewal: 'Automatic renewal',
      list: {
        title: 'Subscriptions',
        isEmpty: 'No contract',
        addButton: 'Add a subscription',
        register: 'Subscribe a member',
        titleManagerOnly: 'Unavailable subcriptions',
        titleCustomerAvailable: 'Available subscriptions',
        titleInactive: 'Archived subscriptions',
      },
      form: {
        title: 'Add a subscription',
        name: { label: 'Name' },
        nb_interval: {
          label: 'Number of invoices:',
          error: 'The number of billings should not exceed 90',
          errorForFixedBillingDay:
            'The number of billings should not exceed 12',
          restrictionForFixedBillingDay:
            'The number of billings must be between 2 and 12 for fixed-day billing',
        },
        managerOnly: { label: 'Unavailable for purchase' },
        autoRenewal: {
          label: 'Activate the automatic renewal',
          germanMarketWarning:
            'To comply with the German Fair Consumers Contract Act, after 2 years of subscription, the new subscription cycles must be for less than a year. Please make sure you follow these conditions.',
        },
        nbIntervalAfterAutoRenewal: {
          firstLabel: 'Change subscription billing for next cycles',
          secondLabel: 'Number of bills *',
        },
        recurrent_price: {
          label: 'Recurring payment',
          infoBox:
            'You are about to change your subscription price. Only the price of newly created subscriptions will be affected. The price of existing subscriptions and renewal subscriptions will not change (even after renewal).',
        },
        contract: {
          label: 'Terms',
          placeholder:
            'Enter here all legal terms and conditions (refund etc...).',
        },
        flat_fee: {
          helperText: 'The joining fee will be added to the first invoice.',
          label: 'Joining fee',
        },
        description: {
          label: 'Description',
          placeholder: 'Annual VIP subscription',
        },
        object_type: {
          paymentPack: 'Passes',
          privatePass: 'Appointment passes',
          label: 'Included',
          paymentCombo: 'Packs',
        },
        error: {
          missingObject: 'This field is required',
          missingPaymentPack: 'You must select one pass',
          missingPrivatePass: 'You must select one appointment pass',
          missingPaymentCombo: 'You must select one pack',
          moreThanThreeDecimalPrice:
            'It looks like you’ve entered more than two decimal places. Please adjust the amount to the nearest cent.',
        },
        recurrence_basis: {
          intervalName: {
            week: 'week',
            week_plural: 'weeks',
            day: 'day',
            day_plural: 'days',
            month: 'month',
            month_plural: 'months',
            year: 'year',
            year_plural: 'years',
          },
          label: 'Repeat every',
        },
        recurrence: {
          explain:
            'This subscription will be billed evert {{ recurrence_basis }}{{ interval }}, has a total duration of {{ total_interval_duration }}{{ interval }}, and members will be invoiced {{ nb_interval }} times in total.',
          section: 'Frequency',
        },
        interval: {
          label: 'BIlling',
          helperText: 'How often will clients be charged?',
        },
        settings: { title: 'Conditions' },
        invoicing: {
          invoicing_type_readonly:
            'It is not possible to change the billing type',
          fixed_day: {
            explain:
              'Members will be invoiced on the chosen day. The first payment will be pro-rated if necessary.',
            label: 'Invoice on a fixed day',
            modification_not_apply_to_past:
              'You are about to change the billing day of your subscription. Only new subscriptions created will be affected. Existing subscriptions and subscriptions with renewals will not change (even after renewal)',
            end_of_month_explain:
              'If a month does not have a {{ month_billing_day }}, the invoice will be issued on the last day of the month.',
            recurrence_explain: {
              month:
                'Members will be invoiced on the {{ month_billing_day }} of each month for a total of {{ nb_interval }} months. The first payment will be pro-rated if necesssary.',
            },
          },
          same_day_as_subscription: {
            recurrence_explain: {
              year: 'The subscription will be invoiced every year for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of the subscription.',
              year_plural:
                'The subscription will be invoiced every {{ recurrence_basis }} years for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of the subscription.',
              month:
                'The subscription will be invoiced every month for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of the subscription.',
              month_plural:
                'The subscription will be invoiced every {{ recurrence_basis }} months for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of the subscription.',
              day: 'The subscription will be invoiced every day for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of the subscription.',
              day_plural:
                'The subscription will be invoiced every {{ recurrence_basis }} days for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of their subscription.',
              week: 'The subscription will be invoiced every week for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of the subscription.',
              week_plural:
                'The subscription will be invoiced every {{ recurrence_basis }} weeks for a total duration of {{ total_subscription_duration }} {{ time_unit }} and will generate {{ nb_interval }} {{ invoice }}. The customer will be able to choose the start date of their subscription.',
            },
            explain:
              'Members will be invoiced depending on the day of purchase.',
            label: 'Invoice on date of purchase',
          },
          invoice: 'bill',
          invoice_plural: 'bills',
          title: 'Invoicing',
        },
        price: { title: 'Price' },
        general_info: { title: 'General information' },
        unusableByStaff: { label: 'Hidden to staff' },
        month_billing_day: {
          label2: 'of each month.',
          label1: 'Invoice on the',
        },
        highlightedAsRecommended: {
          label: 'Mark as recommended',
          helperText:
            "Highlight this subcription to your members by promoting it in the 'recommended' section of the booking flow.",
        },
        advancedOptions: {
          title: 'Advanced',
          tag: {
            tagsOnAcquisition: 'Apply tags after purchase',
            tagsOnAcquisitionHelper:
              'Tag members who have paid their first invoice to quickly identify them in the future.',
            selectTags: 'Select tags',
            tagGroupDuplicated:
              'Please note that selected items contain tags of the same category.',
          },

          selectTags: 'Select tags',
        },
        notEditable:
          'This contract originates from a previously completed data migration. Some fields may not be editable to preserve the data.',
        commitmentPeriod: {
          label: 'Commitment period',
          helperText:
            "Remember to check your country's laws regarding the right of withdrawal for subscription and add the required information in your terms and conditions.",
          error: "The commitment period can't exceed 90.",
          explain: {
            day: 'This subscription will commit the member for {{ commitment_period_value }} day. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            day_plural:
              'This subscription will commit the member for {{ commitment_period_value }} days. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            week: 'This subscription will commit the member for {{ commitment_period_value }} week. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            week_plural:
              'This subscription will commit the member for {{ commitment_period_value }} weeks. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            month:
              'This subscription will commit the member for {{ commitment_period_value }} month. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            month_plural:
              'This subscription will commit the member for {{ commitment_period_value }} months. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            year: 'This subscription will commit the member for {{ commitment_period_value }} year. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
            year_plural:
              'This subscription will commit the member for {{ commitment_period_value }} years. Changes to the subscription commitment period in settings will not affect any subscriptions that have already been purchased.',
          },
        },
      },
      deleteForm: {
        actions: { confirm: 'Delete', cancel: 'Cancel' },
        content: 'Do you really want to delete the contract ?',
        title: 'Delete the contract',
      },
      paymentPack: 'Associated pass',
      no: 'No',
      yes: 'Yes',
      privatePass: 'Associated appointment pass',
      interval: {
        week: 'week',
        week_plural: 'weeks',
        day: 'day',
        day_plural: 'days',
        year: 'year',
        year_plural: 'years',
        month: 'month',
        month_plural: 'months',
      },
      item: {
        intervalLabel: {
          year: 'Yearly',
          year_plural: 'Every {{ count }} years',
          day: 'Daily',
          day_plural: 'Every {{ count }} days',
          week: 'Weekly',
          week_plural: 'Every {{ count }} weeks',
          month: 'Monthly',
          month_plural: 'Every {{ count }} months',
        },
        recurrentPriceLabel: '{{ currencyDisplay }}{{ recurrent_price  }}',
        identifier: 'Subscription',
      },
      frequency: { week: 'weekly', month: 'monthly' },
      billingFrequency: 'Billing frequency',
      paymentCombo: 'Associated pack',
      pastDate: {
        cancel: 'Cancel',
        validate: 'Confirm',
        payment: {
          manualInfo:
            'Past invoices will be indicated as manually paid and future invoices will be debited to the payment method entered by the member.',
          registeredInfo:
            'All future and past invoices will be debited within 24 hours to the payment method indicated on the subscription.',
          manualPayment: 'Manual payment',
          pastInvoicesPayment: 'Payment of past invoices',
          registeredMethodPayment: 'Debit to the registered payment method',
        },
        futureInvoicesPayment: 'Payment of future invoices',
        valuePastInvoicesInputError:
          'The value does not correspond. Please try again',
        alertDifferentMonthInput: 'Value of past invoices',
        alertDifferentMonthConfirmAsk:
          'You are about to charge {{valuePastInvoicesPrice}} to your member. To confirm this action type {{valuePastInvoices}}',
        alertDifferentMonth:
          'Please note that you have chosen a date in a past month. Your member may have one or more passes billed that have already expired.',
        alertSameMonth:
          'Please note that you have chosen a past date, if the subscription includes a pass, the validity of the pass will start on the selected date. In the case of a one month validity, your member will lose {{lostDays}} days of validity.',
        title: 'Past date',
      },
      monthBillingDay: 'Invoiced every {{ month_billing_day }} of the month',
      recurrenceInfo: {
        day: 'per day',
        day_plural: 'every {{count}} days',
        week: 'per week',
        week_plural: 'every {{count}} weeks',
        month: 'per month',
        month_plural: 'every {{count}} months',
        year: 'per year',
        year_plural: 'every {{count}} years',
      },
      recurrenceInfoFixedDay: 'every {{day}} of the month',
      autoRenewalInfo: 'Auto-renewal',
      durationInfo: {
        day: '{{count}} day',
        day_plural: '{{count}} days',
        week: '{{count}} week',
        week_plural: '{{count}} weeks',
        month: '{{count}} month',
        month_plural: '{{count}} months',
        year: '{{count}} year',
        year_plural: '{{count}} years',
      },
      nbIntervalAfterAutoRenewal: {
        title: 'Second billing plan',
        details: {
          day: 'After renewal, the subscription will be modified to a {{durationAfterAutoRenewal}}-day plan.',
          week: 'After renewal, the subscription will be modified to a {{durationAfterAutoRenewal}}-week plan.',
          month:
            'After renewal, the subscription will be modified to a {{durationAfterAutoRenewal}}-month plan.',
          year: 'After renewal, the subscription will be modified to a {{durationAfterAutoRenewal}}-year plan.',
        },
      },
    },
    germanNbIntervalAlert:
      'To comply with the German Fair Consumers Contract Act, the number of billings has to be less than 24.',
    GermanMarketSetSubscriptionAutoRenewalAlert: {
      title: 'Automatic renewal',
      content:
        'To comply with the German Fair Consumers Contract Act, after 2 years of subscription, the new subscription cycles must be for less than a year. Are you sure you want to continue?',
    },
    contractTemplate: {
      backofficeEditWarning:
        "The subscription is shared through the Master Account. Certain settings have been predefined by said Master Account and can't be modified.",
      list: {
        isEmpty: 'No shared contracts',
      },
      icons: {
        restore: 'Restore',
      },
      dialog: {
        delete: {
          title: 'Delete confirmation',
          content: 'Are you sure you want to delete the shared subscription?',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
      },
      filter: {
        noFilters: 'All subscriptions',
        availableForEveryone: 'Available for everyone',
        memberOnly: 'Member only',
        staffOnly: 'Staff only',
        unavailableForEveryone: 'Unavailable for everyone',
        availability: 'Availability',
        searchPlaceholder: 'Search a subscription',
        studios: 'Studios',
        passes: 'Passes',
        appointmentPasses: 'Appointment passes',
        productType: 'Product',
        associatedPass: 'Associated pass',
      },
      detailPage: {
        sharedStudios: 'Shared with the following studios:',
      },
      form: {
        title: 'Subscription',
        sharedPassesSelectorTooltip:
          'Studios that have access to this shared pass will also have access to the subscription',
        sharedAppointmentPassesSelectorTooltip:
          'Studios that have access to this shared appointment pass will also have access to the subscription',
      },
    },
    recap: {
      willBecharged: ' will be charged ',
      every: ' every ',
      month: 'month ',
      times: ' times ',
      forObject: ' for ',
      from: 'From ',
      to: ' until ',
      forATotalOf: 'For a total of ',
      includingFreeTrialOf1: ' including ',
      includingFreeTrialOf2: ' not billed ',
    },
    form: {
      check: 'Check',
      submit: 'Pay now',
      title: 'New recurring invoice',
      cancel: 'Discard',
      note: { label: 'Note' },
    },
    plannedInvoiceStatus: {
      pending: 'Pending',
      canceled: 'Discarded',
      failed: 'Payment: refused',
      succeeded: 'Billed',
      processing: 'Payment processing',
      reverted: 'Cancelled',
    },
    subscriptionStatus: {
      pending: 'Processing',
      canceledOn: 'Discarded on ',
      hasEnded: 'Billing finished',
      isPaused: 'Paused',
    },
    action: {
      stop: 'Stop',
      stopExplain:
        'Future payments, invoices, and bookings will be discarded deleted.',
      revertCurrentExplain: 'Cancel the last invoice and block the pass',
      revertCurrentExplainHelper:
        'If the payment was valid, a credit will be attributed to the customer, you can also enter the invoice and click refund on the payment. If the payment was failed, the debt will be cancelled.',
      planStop: 'Terminate',
    },
    parameters: {
      parameters: 'Settings',
      autoRenew: 'Activate the automatic renewal',
      subscribeAgain: 'Resubscribe',
      voucher: 'Promotion',
      trial_nb: 'Number of free invoices',
      recurrent_voucher: 'Discount on each invoice',
      name: 'Name',
      member: 'Member',
      dateCreated: 'Date of creation',
      nbInterval: 'Number of billings',
      secondBillingPlanEnabled: 'Second billing plan enabled',
      recurrent_price: 'Recurring payment',
      paymentPack: 'Pass',
      nbMonths: 'Number of billings',
      dateStart: 'First billing',
      firstBilling: 'First billing',
      payment_pack: 'Passes',
      flat_fee: 'Joining fee : {{price_with_currency}}',
      status: 'Status',
      payment_method: {
        [BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT]: 'Internal account balance',
        [BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB]: 'Card',
        [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]: 'SEPA Transfer',
        label: 'Payment method',
        paymentOnline: 'Online payment',
      },
      source_company: 'Bought at',
      private_pass: 'Appointment pass',
      privatePass: 'Appointment pass',
      note: 'Note',
      payment_method_group: {
        [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: 'Card',
        [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: 'SEPA',
        14: 'Internal account',
      },
      paymentCombo: 'Pack',
      payment_combo: 'Pack',
      contractTermsAccepted:
        '<0>Terms</0> have been accepted on the {{- dateAccepted}}.',
      stopNote: 'Cancellation note',
    },
    schedule: {
      provisionalTitle: 'Provisional schedule',
      paymentMethodTitle: 'Payment method',
    },
    paymentMethod: {
      sepa: 'SEPA Direct Debit',
      card: 'Card',
      credit: {
        explain:
          "Use this payment method to bill members if there is no direct payment method available, such as a card or IBAN. The member's internal account balance will be billed and this payment method can be changed later on.",
      },
      bsportCredit: 'Credit account',
      bacs_debit: 'Bacs Direct Debit',
    },
    mandate: {
      name: 'Full name',
      email: 'Email',
      contentIban:
        'By providing your IBAN and confirming your payment, you authorise bsport and Stripe, our payment system, to send debit instructions to your bank in accordance with the payment schedule. You may request a refund from your bank in accordance with the terms of your contract with your bank. A refund must be requested within 8 weeks of the first debit.',
      contentBacsDebit:
        'By providing your bank details and confirming your payment, you authorise bsport and Stripe, our payment system, to send debit instructions to your bank in accordance with the payment schedule. You may request a refund from your bank in accordance with the terms of your contract with your bank. You can request your bank to cancel the Direct Debit mandate at any time.',
      accountNumber: 'Account number',
      sortCode: 'Sort code',
    },
    plannedInvoice: {
      priceUpdater: {
        submit: 'Save',
        cancel: 'Cancel',
        explain: 'Only this invoice will be modified',
        price: 'New amount',
        title: 'Payment modification',
        updateAll: 'Update all futures debits up until the automatic renewal',
        updateRecurrentPrice:
          'Apply changes to all the payments after the automatic renewal',
        nonNullDiscount:
          'This subscription currently includes a coupon. This coupon will not be taken into account when the price is updated.',
        nonNullFlatFees:
          'This subscription currently includes an administration fee of {{ flatFeesAmount }} {{ currencyDisplay }}. This handling fee will not be taken into account when the price is updated.',
      },
      list: { titleNext: 'Upcoming withdrawals' },
      dateUpdater: {
        title: 'Edit future invoice(s)',
        label: 'Payment date',
        actions: { submit: 'Save', cancel: 'Cancel' },
        explain: 'Only this future invoice will be modified',
      },
    },
    save: 'save',
    cancel: 'cancel',
    noContracts:
      'In this module, you can add subscriptions to automatically bill your members on a daily, weekly, monthly, or yearly basis.',
    copyLink: 'Copy the direct link to the payment page',
    listItem: {
      valid: 'Valid',
      paused: 'Paused',
      expired: 'Expired',
      canceled: 'Stopped',
      subscribedOn: 'Subscription started on {{- date}}',
      willSubscribeOn: 'Subscription will start on {{- date}}',
    },
    noAssociatedSubscription: 'There are no saved subscriptions to display.',
    associatedSubscriptions: 'Subscribed members',
    register: {
      dialog: {
        success:
          'Your subscription {{- name }} has been registered successfully.',
        error: 'Impossible to register the subscription, please retry later.',
        info: 'Your subscription is being registered, we will inform you when it is ready.',
      },
    },
    status: {
      hasEnded: 'Ended',
      hasStopped: 'Paused',
      hasNotStartedYet: 'Inactive',
      hasStarted: 'Active',
      isPaused: 'Paused',
    },
    franchiseUserProfile: {
      pleaseSelectASubscription:
        'Select a subscription for a more detailed overview.',
      associatedInvoices: 'Associated invoices',
      associatedPassValidity: 'Valid for ',
    },
    filters: {
      all: 'All subscriptions',
    },
    billingPlanStatus: {
      canceled: 'Terminated',
      expired: 'Expired',
      paused: 'Paused',
      valid: 'Valid',
    },
    scheduledStop: {
      label: 'Terminated',
      unscheduleStop: 'Unschedule the stop',
      stoppedByManager: 'Terminated by {{ name }}',
      stoppedByMember: 'Terminated by the member',
    },
    end: { renew: 'Auto-renew', noRenew: 'End the subscription' },
    seeMore: 'Show more',
    search: 'Search a subscription',
    notificationToolTip: 'Notifications are set for this subscription',
    addNotification: 'Add a notification',
    notificationForm: {
      title: 'Notification rules',
      subtitle: 'Subscription',
      typeSection: {
        title: 'Status to be notified',
        contractStart: 'Start of subscription',
        contractEnd: 'End of subscription',
      },
      triggeringEvent: {
        title: 'Triggering event',
        contractCreation: 'Subscription creation',
        firstBilling: 'First invoice',
      },
      notificationType: {
        title: 'Type of notification',
        day: 'Day',
        day_plural: 'Days',
        hour: 'Hour',
        hour_plural: 'Hours',
        before: 'Before',
        after: 'After',
        afterSubcriptionCreation: 'After creation of the subscription.',
        firstBilling: 'The first invoice of the subscription.',
        warningDayFirst:
          'The number of days indicated is in relation to the date of the first invoice at midnight',
        warningDayLast:
          'The number of days indicated is in relation to the date of the last invoice at midnight',
        warningHourLast:
          'The number of hours indicated is in relation to the date of the last invoice at midnight',
        contractEnd: 'End of subscription.',
        warningHourFirst:
          'The number of hours indicated is in relation to the date of the first invoice at midnight',
      },
      sendingMethod: {
        title: 'Sending method',
        notificationPush: 'Push notification',
        email: 'Email',
      },
      emailNotification: {
        parameters: 'Email settings',
        emailToSend: 'Email to send',
      },
      notificationPush: {
        parameters: 'Notification settings',
        title: 'Title',
        content: 'Content',
        addTag: 'Add a variable',
        warning:
          'Be careful, push notifications should be used sparingly. Too many push notifications can lead some members to uninstall the application.',
      },
      buttons: { cancel: 'Cancel', submit: 'Save' },
      warning:
        'Notify your members when their subscription has a change of status : end of subscription, start of subscription.',
      smartLists: {
        createSmartList: 'Add a Smartlist',
        smartListHelperInclude:
          'Only send the notification if the member is present in one of the following Smartlists',
        smartListHelper:
          "Don't send the notification if the member is present in one of the following Smartlists",
        advanced: 'Advanced',
        warning:
          "By selecting no Smartlist at all, you might notify members who've already bought another pass.",
        smartListSelection: '(Optional) Select Smartlist(s)',
      },
    },
    notification: {
      title: 'Notify {{count}} {{periodScale}} {{notificationKind}}',
      creation: 'After creation',
      beforefirstBilling: 'Before the first invoice',
      afterfirstBilling: 'After the first invoice',
      afterSubscriptionEnd: 'After the end of the subscription',
      days: 'Day',
      days_plural: 'Days',
      hours: 'Hour',
      hours_plural: 'Hours',
      beforeSubscriptionEnd: 'Before the end of the subscription',
    },
    contractNotification: {
      creation: 'At the creation of the subscription',
      firstBilling: 'At the first invoice',
    },
    pauseV2: {
      subscriptionPause: {
        eventItems: {
          pauseDeleted: 'Reason for previous pause: {{pause_name}}',
          pauseCreatedThenDeleted: 'This pause has been deleted or modified.',
        },
        deleteDialogContent: 'Are you sure you want to deprogram this pause?',
        form: {
          failureStep: {
            contentUnknownError:
              'An unforeseen error has occurred. We apologise for any inconvenience caused.',
            contentSubscriptionHasNotStarted:
              'The pause was not completed because the pause date range is before the start of the subscription.',
            contentCanNotCreateAPauseInThePast:
              'The pause cannot start in the past.',
            contentCanNotEditPauseEndBeforeToday:
              'The new start date for the break cannot be set before today.',
            contentCanNotEditPauseStartWhenHasStarted:
              'The start date of the pause cannot be changed once it has begun.',
            contentSubscriptionWillEndBeforePause:
              'The subscription cannot be paused over this period because it will have ended earlier or its renewal has not yet been executed at this time.',
            contentCanNotCancelPause:
              'As the pause has already started or has already passed, it cannot be cancelled.',
            contentInvalidTimedelta: 'The pause should last at least one day.',
            contentOverlapPause:
              'The {{- subscriptionName}} subscription of {{- subscriberName }} could not be paused because a pause is already scheduled from {{- fromDate}} to {{- untilDate}}.',
            contentIncomingBill:
              'The {{- subscriptionName}} subscription of {{- subscriberName }} could not be paused because an invoice in the pause interval will be billed within 24 hours or has a payment in progress. Please change the start date of the break.',
            title: 'Pause Failed',
          },
          successStep: {
            content:
              'The {{- subscriptionName}} subscription of {{- subscriberName }} has been paused from {{- fromDate}} to {{- untilDate}} included.',
            title: 'Pausing the subscription',
          },
          initStep: {
            information2:
              'The expiry date of the pass will be extended by the number of days of the pause and the pass will remain valid during the pause.',
            information1:
              'The subscription will be paused from {{- fromDate}} to {{- untilDate}} included. The next billing following the pause will be shifted by {{count}} day, as well as all future billings.',
            information1_plural:
              'The subscription will be paused from {{- fromDate}} to {{- untilDate}} included. The next billing following the pause will be shifted by {{count}} days, as well as all future billings.',
            titleUpdate: 'Change the pause',
            titleCreation: 'Paused',
          },
        },
      },
      contractPause: {
        sections: {
          error: '{{count}} subscription could not be paused automatically',
          error_plural:
            '{{count}} subscriptions could not be paused automatically',
          success: '{{count}} subscription paused',
          success_plural: '{{count}} subscriptions paused',
        },
        updateNameDialogTitle: 'Change of reason for pause',
        deleteDialogContent:
          'Are you sure you want to cancel this pause for all subscriptions?',
        form: {
          thirdStep: {
            successExplanation:
              '{{ count }} subscription has been paused from {{- fromDate}} to {{- untilDate}} included.',
            successExplanation_plural:
              '{{ count }} subscriptions have been paused from {{- fromDate}} to {{- untilDate}} included.',
            title: 'Global pause of the subscription',
          },
          secondStep: {
            incompatibleSubscriptions:
              'The following subscriptions could not be paused for one of the following reasons: a payment within the pause interval is due within 24 hours, a payment for a future invoice is in progress, the selected period overlaps with another already scheduled pause, the subscription has not yet started.',
            noCompatibleSubscriptions: 'No subscription can be paused.',
            sectionFailure: 'Pause Failed ',
            sectionSuccess: 'Subscription freezed',
            title: 'Verification',
          },
          firstStep: {
            information2:
              'The expiry date of the pass will be extended by the number of days of the pause and the pass will remain valid during the pause.',
            information1:
              'Subscriptions will be paused from {{- fromDate}} to {{- untilDate}} included. Their next billing will be delayed by {{count}} day, as well as all future billings and passes.',
            information1_plural:
              'Subscriptions will be paused from {{- fromDate}} to {{- untilDate}} included. Their next billing will be delayed by {{count}} days, as well as all future billings and passes.',
            titleUpdate: 'Change the global pause',
            titleCreation: 'Pause all subscriptions',
          },
        },
        title: 'Pause all subscriptions',
      },
      common: {
        menu: {
          cancelForbidden:
            'You cannot cancel a pause whose start date has already passed.',
          changeForbidden: 'You cannot edit a pause that has already ended.',
          changeContractForbidden:
            'You cannot edit a pause created at subscription level.',
          changeName: 'Change the reason',
          change: 'Change the dates',
          delete: 'Deactivate',
        },
        listItem: {
          isUpdated: 'Edited pause',
          label: 'Pause from {{- fromDate}} to {{- untilDate}}',
          pausedAt: '{{ days }} days - On {{- date}}',
          deletedAt: 'Cancelled on {{- dateDeletion}}',
          deletedAtBy: 'Cancelled on {{- dateDeletion}} by {{- staffName }}',
          createdAt: 'Created on {{- dateCreation}}',
          createdAtBy: 'Created on {{- dateCreation}} by {{- staffName }}',
          fromToUntil: 'Pause from {{- fromDate}} to {{- untilDate}}',
        },
        deleteDialog: { title: 'Cancel the pause' },
        form: {
          duration: {
            warning: 'The end date cannot be earlier than the start date',
            end: 'End date (included)',
            start: 'Start date (included)',
            title: 'Duration of the pause',
          },
          reasonPlaceholder: 'Reason *',
        },
        actions: {
          continue: 'Continue',
          save: 'Save',
          goBack: 'Back',
          previous: 'Previous',
          verify: 'Check',
          pause: 'Pause this subscription',
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
      },
    },
    billing_plan_status: {
      [BILLING_PLAN_STATUS_STARTED]: 'In progress',
      [BILLING_PLAN_STATUS_NOT_STARTED]: 'Not yet started',
      [BILLING_PLAN_STATUS_STOPPED]: 'Stopped',
      [BILLING_PLAN_STATUS_PAUSED]: 'Paused',
      [BILLING_PLAN_STATUS_ENDED]: 'Finished',
    },
    invisibleForStaffToolTip: 'Invisible for the staff',
    alreadySubscribed: {
      dialog: {
        title: 'Already subscribed',
        content:
          "You have already purchased this subscription recently. If you don't see it yet, please wait a few minutes. However, if you wish to purchase it again, please wait a few minutes and try again.",
        validate: 'Ok',
      },
    },
    subscriptionNotFound: {
      explanation:
        'This subscription no longer exists. Please choose another one or contact your studio manager.',
      title: 'Subscription not found',
    },
    newCheckout: {
      error: {
        button: {
          userRegistration: 'See my subscription',
          registerBackground: 'Close',
        },
        text: {
          userRegistration:
            'Your subscription has been created and your payment method will be debited shortly. However, your booking could not be registered.',
          registerBackground:
            'Your subscription and booking could not be created. The payment method has not been debited.',
        },
        title: 'An error has occurred',
      },
      payment: {
        tooltip:
          "This payment method will be retained for billing in accordance with the contract. Don't worry, you can change it later from your account.",
        details: 'Payment details',
      },
      subscriptionBasketSummary: {
        message: 'You can view your subscription on your member profile',
        payNow: 'Pay now',
      },
      terms: {
        acceptTerms: 'I accept the <0>legal terms</0>.',
        seeLess: 'See less',
        seeMore: 'See more',
        title: 'Terms of contract',
      },
      subscriptionSummary: {
        billingInterval: {
          day: 'Every day',
          day_plural: 'Every {{ count }} days',
          year: 'Every year',
          year_plural: 'Every {{ count }} years',
          week: 'Every week',
          week_plural: 'Every {{ count }} weeks',
          month: 'Every month',
          month_plural: 'Every {{ count }} months',
        },
        prorataPriceText:
          '{{proratedPrice}} due the {{-today}}, then {{recurrentPrice}} each {{monthBillingDay}} day of the month.',
        item: '{{count}} item',
        item_plural: '{{count}} items',
        unlimited: 'Unlimited',
        credit: '{{count}} credit',
        credit_plural: '{{count}} credits',
        startDate: 'Start date',
      },
      processingPaymentModal: {
        timeEstimation: 'This can take up to a minute',
        text: 'Please wait for the payment to be processed. Do not leave or reload this page.',
        title: 'Payment in progress',
      },
      title: 'Subscription',
    },
  };
};

exports.default = getTranslations();
