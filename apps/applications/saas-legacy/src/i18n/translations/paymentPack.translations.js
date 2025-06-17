const getTranslations = async () => {
  const PAYMENT_PACK_NOTIFICATION_DAY_LEFT = 0;
  const PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT = 1;
  const PAYMENT_PACK_NOTIFICATION_DAY_PAST = 2;
  const {
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_SCT_INCOMPATIBLE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ESTABLISHMENT_INCOMPATIBLE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ACTIVITY_INCOMPATIBLE,
    CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_ENOUGH_CREDIT,
    CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_DISABLED,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_HAS_EXPIRED,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DATES_NOT_COMPATIBLE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_LATER_FIRST_BOOKING,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_LATER_FIRST_ATTENDANCE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_INCOMPATIBLE_WITH_OFF_PEAK_SCHEDULE,
    CONSUMER_PAYMENT_PACK_REFUND_AMOUNT_EXCEEDS_PURCHASE,
    CONSUMER_PAYMENT_PACK_REFUND_CREDITS_EXCEED_PASS,
    CONSUMER_PAYMENT_PACK_REFUND_LOCK_ACQUISITION_ERROR,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js'
  );

  return {
    consumerPaymentPack: {
      addExtension: 'Extend validity',
      details: {
        actions: {
          refund: 'Partial refund',
          applyVoucher: 'Apply a discount',
        },
      },
      refund: {
        actions: { submit: 'Save', cancel: 'Cancel' },
        explain:
          'Specify the amount to refund to the internal account and, if needed, the number of credits to deduct from the pass',
        credits: {
          label: 'Credits to deduct',
          decimalCredit: {
            helperText: '{{count}} credit will be deducted',
            helperText_plural: '{{count}} credits will be deducted',
          },
        },
        note: { label: 'Note' },
        description: '{{credits}} credit - {{note}}',
        description_plural: '{{credits}} credits - {{note}}',
        price: { label: 'Amount to refund' },
        title: 'Partial refund to internal account',
        warningSecond:
          'To refund via the original payment method, cancel the entire invoice instead.',
        warningFirst: 'Warning: This action is irreversible',
        blockUnlimited: 'Block pass',
        error: {
          default: 'An error occurred. Please retry.',
          [CONSUMER_PAYMENT_PACK_REFUND_AMOUNT_EXCEEDS_PURCHASE]:
            'The refund amount exceeds the purchase amount. Please retry with a lower amount.',
          [CONSUMER_PAYMENT_PACK_REFUND_CREDITS_EXCEED_PASS]:
            'The number of credits to deduct exceeds the number of credits on the pass. Please retry with a lower number.',
          [CONSUMER_PAYMENT_PACK_REFUND_LOCK_ACQUISITION_ERROR]:
            'An error occurred. Please retry.',
        },
      },
      maxout: {
        dialog_message:
          'Please note that this pass has already reached its limit of {{count}} booking(s) by {{unit}}. Do you still want to book with this pass? ',
        dialogTitle: 'Reservation limit reached',
        months: 'month',
        weeks: 'week',
        days: 'day',
        limit_reach: 'The booking limit has been reached for this {{unit}}',
      },
    },
    notificationToolTip: 'Notifications are defined for this pass',
    notification: {
      [PAYMENT_PACK_NOTIFICATION_DAY_LEFT]: {
        first: "Send this notification if there's ",
        second: 'days of validity remaining on the pass',
      },
      [PAYMENT_PACK_NOTIFICATION_DAY_PAST]: {
        first: 'Send this notification when the pass has expired for ',
        second: 'day(s)',
      },
      [PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT]: {
        first: "Send this notification if there's",
        second: 'credit(s) remaining on the pass',
      },
      listItem: {
        mail: 'Email ',
        deleteModal: {
          title: 'Delete notification',
          cancel: 'Cancel',
          confirm: 'Delete',
          content:
            "Are you sure that you want to delete this notification? This action can't be undone.",
        },
        smartList: 'Excluded Smartlist(s)',
        smartListInclude: 'Included Smartlist(s)',
      },
      addButton: 'Add a notification',
      form: {
        noMailAvailable: 'There are no email templates to display.',
        selectToShowPreview: 'Select an email to see a preview of it.',
        mailTitle: 'Select the email template that will be sent',
        typeTitle: 'Trigger',
        generalTitle: 'General',
        notificationNamePlaceholder: 'Notification name',
        creditType: 'Remaining credits',
        daysType: 'Remaining validity',
        daysPastType: 'Expiration',
        mailSelection: 'Select an email template',
        smartListSelection: '(Optional) Select Smartlist(s)',
        showMail: 'Show email',
        settingTitle: 'Settings',
        hideMail: 'Hide email',
        submit: 'Confirm',
        cancel: 'Cancel',
        createSmartList: 'Add a Smartlist',
        warning:
          "By selecting no Smartlist at all, you might notify members who've already made a recent purchase!",
        smartListHelper:
          "Don't send the notification if the member is present in one of the following Smartlists",
        smartListHelperInclude:
          'Only send the notification if the member is present in one of the following Smartlists',
        pushTitle: 'Settings',
        mailSettings: 'Content',
        chooseTime: {
          secondOnOfferStart: 'hour(s) after the end of the session',
          secondOnBooking: 'hour(s) after the booking',
          first: 'Send a notification',
        },
        creditNotificationType: {
          onOfferStart: 'Send the notification after the end of the session',
          onBooking: 'Send the notification after completing the booking',
        },
        contractTitle: 'Subscription',
        infoContract:
          'Members who got this pass as part of a subscription will only receive notifications about the subscription and not about the card. By deactivating this option they will receive both.',
        dontSendIfInContract:
          'Do not send when the pass is part of a subscription',
      },
      daysPast: {
        second: 'day(s).',
        first: 'Send this message when this pass has expired for',
      },
      daysLeft: {
        second: 'remaining day(s) of validity left',
        first: 'Send this notification when this pass has',
      },
      creditsLeft: {
        second: 'credit(s) remaining',
        first: "Send a notification when there's",
        helperText:
          'This notification will be triggered when there’s {{count}} credit remaining',
        helperText_plural:
          'This notification will be triggered when there’s {{count}} credits remaining',
      },
      daysPastLabel:
        'This notification will be sent when the pass has expired for {{day}} day.',
      daysPastLabel_plural:
        'This notification will be sent when the pass has expired for {{day}} days.',
      daysLeftLabel:
        'This notification will be sent when the pass expires in {{day}} day.',
      daysLeftLabel_plural:
        'This notification will be sent when the pass expires in {{day}} days.',
      creditsLeftLabel:
        'This notification will be sent when the pass has {{count}} remaining credit.',
      creditsLeftLabel_plural:
        'This notification will be sent when the pass has {{credit}} remaining credits.',
      creditsLeftOnOfferStart: '{{hours}} hour(s) after the end of the session',
      creditsLeftOnBooking: '{{hours}} hour(s) after completing a booking',
    },
    search: 'Search a pass',
    extension: {
      nbDaysAdded: '+{{count}} day',
      nbDaysAdded_plural: '+{{count}} days',
      seeLess: 'See less',
      seeMore: 'See more',
      addedOn: 'Added on: ',
      delete: {
        title: 'Delete validity extension',
        explain: 'Are you sure you want to delete this validity extension ?',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
      create: {
        title: 'Extend the validity of the pass',
        cancel: 'Cancel',
        submit: 'Create',
        note: { label: 'Notes' },
        explain: { oldDate: 'Original: ', newDate: 'New date: ' },
        warning:
          'Please check that the new date is included in the same fiscal year as the old one. If not, please check with your accounting this operation is correct.',
        nbDays: { label: 'Nb of additional days' },
        datePicker: { label: 'New date' },
      },
      options: {
        selectNewEndDate: 'Set a new end of validity date',
        addNumberOfDays: 'Extend the validity by adding a number of days',
      },
    },
    form: {
      paymentPack: {
        noNotificationsWarning:
          'You have no notifications set up yet. To create new notifications, please go to <strong>Marketing > Notifications.</strong>',
        detailsAndRestrictions: 'Details and conditions',
        notification: 'Notifications',
        from: 'From ',
        until: 'Until ',
        newMemberOnly: 'Only available for new customers',
        onsitePaymentAvailable: 'Enable in-studio payments',
        managerOnly: 'Unavailable for purchase',
        tax: { label: 'VAT / Sales tax' },
        startOnFirstUse: 'The validity starts on the day of the first booking',
        name: { label: 'Name', helperText: 'Name for the payment pack' },
        credits: {
          label: 'Credit(s)',
          helperText:
            'This is the amount of the included credits for this pass. Leave blank to make it unlimited.',
          bewareChange:
            'Attention: modifying the credits will affect all previous purchases as well.',
        },
        maxBookingPerWeek: {
          helperText: 'Leave this field empty to not set up any restrictions.',
          label: 'Maximum usage per week',
        },
        unlimited: 'Unlimited',
        theoricalMarginValue: {
          label:
            'Theoretical Margin Value per Booking (only applies to unlimited passes)',
          helperText:
            'This is used to calculate the payroll of the teachers. Example: {{currency}}10 for 1 booking means that the teacher will be paid {{currency}}10.  When left empty, the marginal value will be calculated as PRICE / NUMBER OF BOOKINGS.',
        },
        expirationDaysBeforeFirstUse: {
          label:
            'Amount of days in which the pass expires if no booking is made:',
          helperText:
            'Amount of days in which the pass expires if no booking is made:',
        },
        helper: {
          starting_date:
            'Start of the validity of the pass. Leave blank to make it available at once.',
          ending_date:
            'End of the validity of the pass. Leave blank to make it unlimited.',
        },
        start_date_method: {
          on_purchase: 'Valid from the billing date',
          on_booking: 'Valid from the 1st booking',
          on_attendance: 'Valid from the 1st attendance',
        },
        timeSettingsTitle: 'Validity',
        generalSettingsTitle: 'General',
        validByDuration:
          'This pass is valid for X amount of days after purchase',
        validByDaterange: 'This pass is valid between X and Y',
        durationDays: {
          label: 'Validity period (in days)',
          helperText:
            'Numbers of days for which the pass will stay active after purchase ',
        },
        durationMonths: {
          label: 'Additional duration (in months)',
          helperText: 'This will be added to the number of days',
        },
        durationYears: {
          label: 'Additional duration (in years)',
          helperText: 'This will be added to the number of days and months',
        },
        restrictionsTitle: 'Restrictions',
        noneMeansAll: 'Leave this field empty to implement no restrictions',
        update: {
          success: 'Pass: operation succeeded',
          error: 'Pass: operation failed',
        },
        actions: {
          skip: 'Skip',
          edit: 'Edit',
          create: 'Save',
          submit: 'Save',
          cancel: 'Cancel',
          next: 'Next',
          back: 'Back',
        },
        sports: 'Category',
        activities: 'Activity',
        establishments: 'Establishment',
        delete: {
          title: 'Delete pass:',
          askConfirmation:
            "Attention: this action can't be undone. The pass won't be visible anymore and it'll become unavailable for purchase.",
          thereAreConsumers:
            "Attention: it's possible that members have already bought this pass. Members will continue to be able to use their credits. If you'd like to entirely delete or block the use of this pass right now, we recommend that you reduce the amount of credits the pass includes to 0. Furthermore, the pass will no longer appear for sale.",
          actions: { cancel: 'Cancel', submit: 'Delete' },
          isUsedInCombo:
            "Attention! Deleting this pass will also make it unavailable for purchase for the packs it's used for.",
        },
        priceIncludingTax: {
          label: 'Price (including VAT/Sales Tax) * ',
          helperText: 'The total selling price of the pass.',
        },
        startOnFirstUseHelper: 'Otherwise it starts on the billing date',
        notEditable:
          'This pass originates from a previously completed data migration. Some fields may not editable to preserve the data. Compatible activities/categories can still be modified.',
        maxPurchasePerMember: {
          helperText: 'Leave this field blank to not set any limits',
          label: 'Maximum purchase per member',
        },
        maxBookingPerDay: {
          helperText: 'Leave this field empty to not set up any restrictions.',
          label: 'Maximum usage per day',
        },
        full_vod_access: 'Provides access to Video On Demand (if available)',
        maxBookingPerMonth: {
          helperText: 'Leave this field empty to not set up any restrictions.',
          label: 'Maximum usage per month',
        },
        penalty: {
          account: {
            helperText: 'A charge of {{value}} will be applied for this member',
            label: 'Penalty fine:',
          },
          block: {
            helperText: 'The pass will be blocked for {{nb_days}} days',
            label: 'Duration of the blocking period (in days):',
          },
          kind: {
            account: 'Apply a fine',
            block: 'Temporarily block the pass',
            label: 'Select the type of penalty to apply',
          },
          nb_days: 'Number of days:',
          nb_cancellations: 'Number of late cancellations:',
          explain:
            'A penalty will be applied if there are {{nb_cancellations}} late cancellations over a period of {{nb_days}} days',
          checkbox:
            'Apply a penalty in the event of too many late cancellations',
          title: 'Penalties',
          deleteNoShowDialog: {
            text: 'No more unlimited passes with no-show penalties. We have disabled the "roll call" feature, so you no longer have to call the roll for each session.',
            title: 'Penalties removed',
          },
          noShowDialog: {
            alert:
              'You can set the no show conditions in the customization settings.',
            text: 'You have just created no-show penalties.  We have activated the "roll call" feature, you must now call the roll for each session to activate the penalties.',
            title: 'Penalties on no shows',
          },
          bothPenaltiesInfo:
            'A penalty will be applied if there is {{penalityNumberNoShow}} late cancelation or no show within a {{penalityNumberDay}} days period',
          bothPenaltiesInfo_plural:
            'A penalty will be applied if there are {{penalityNumberNoShow}} late cancelations or no shows within a {{penalityNumberDay}} days period',
          bothPenaltiesNumber: 'Number of cancellations and no-shows',
          noShowPenaltyInfo:
            'A penalty will be applied if there is {{penalityNumberNoShow}} no show within a {{penalityNumberDay}} days period',
          noShowPenaltyInfo_plural:
            'A penalty will be applied if there are {{penalityNumberNoShow}} no shows within a {{penalityNumberDay}} days period',
          noShowPenaltyNumber: 'Number of no shows',
          noShowPenaltyAlert:
            'To define when a member is considered absent (no show) please go to Settings>Personalization',
          penaltyParamsText:
            'Apply the same count for late cancellations and no shows',
          penaltyParams: 'Penalty settings',
          bothPenaltiesTitle: 'Penalties for late cancellations and no shows',
          noShowPenaltyTitle: 'No show penalties',
          cancellationsPenaltyTitle: 'Penalties for late cancellations',
          errorNoPenaltyRule:
            'Unable to save your changes, you must choose a penalty or disable penalties to continue',
          noShowCheckbox: 'Too many no shows',
          cancellationsCheckbox: 'Too many late cancelations',
          titleCheckbox: 'Apply a penalty for',
          helperText:
            'Apply a penalty to members with too many no-shows or late cancellations ',
          label: 'Apply a penalty',
        },
        only_vod_access: 'Only for Video On Demand',
        error: {
          start_date_method_type:
            'Please indicate the beginning of validity of the pass.',
        },
        category: {
          label: '(Optional) Category',
          helperText: 'Name of the category',
        },
        advancedOptions: {
          tag: {
            notAllowedFor: 'Refused for',
            notAllowed: 'Not available',
            allowedFor: 'Approved for',
            allowed: 'Available',
            header: 'Tags',
            doNotSelectToAllowAllMembers:
              'Leave this field empty to make it available to all members.',
            helperText:
              'Use tags to make this pass available or not available for purchase to certain segments of your customer base.',
            selectTags: 'Select tags',
            tagsOnAcquisition: 'Apply tags after purchase',
            tagsOnAcquisitionHelper:
              'Tag members who have bought this pass to quickly identify them in the future.',
          },
          header: 'Advanced',
          appliesForPayroll: {
            header: 'Teacher payroll',
            helperText:
              "Classes are billed to the studio and included in the teacher's payroll by default. Deactivate this setting to ensure classes associated with this pass will no longer appear in teachers' payrolls.",
            label:
              "Classes bought with this pass are included in teacher's payroll",
          },
        },
        universalPass: {
          deativatedTags: 'Deactivated for universal passes',
          marketplaceLabel:
            'A universal pass may be used for group activities and appointments.',
          label: 'Universal pass',
          helperText:
            "Universal passes can be used by members to book both group activities and appointments. Every time a universal pass is purchased, we'll automatically add a 'twin' appointment pass to share the credits between the two pass types.",
          warningIsUniversalPass:
            'Twin appointment passes are automatically created for a universal pass. All fields modified here will also be edited on the twin passes, except the categories. This also applies to notifications, validity extensions, and credit changes.',
        },
        highlightedAsRecommended: {
          label: 'Mark as recommended',
          helperText:
            "Highlight this pass to your members by promoting it in the 'recommended' section of the booking flow.",
        },
      },
    },
    details: {
      pleaseSelectAPack: 'Select a pass for a more detailed overview.',
      shareAPass: 'Share a pass',
      invoiceTitle: 'Associated invoice',
      bookingsTitle: 'Associated bookings',
      extensionsTitle: 'Validity extension',
      refundTitle: 'Associated refund',
      trackModifiedCreditTitle: 'History',
      penaltyAccount:
        'Additional billing of {{account_value}} {{currencyDisplay }}',
      penaltyBlock: 'This pass is blocked for {{nb_days}} day(s).',
      penaltyTitle: 'Penalties applied',
    },
    newMemberOnly: 'Only available for new members (with no payments)',
    publicPacksTitle: 'Available passes',
    privatePacksTitle: 'Unavailable passes',
    subscribeToOffer: 'Register',
    use: 'Use',
    isNonCompatible: 'non-compatible',
    disableConsumer: 'Block',
    enableConsumer: 'Unblock',
    credit: { updated: 'Changes saved' },
    consumer: {
      isFromShare: 'Shared from another account',
      isOwnerOfShares: 'Shared (Master Pass)',
      isFromDisabledShare: 'Sharing stopped',
      expiresOn: 'Expires on ',
      bookingsThisWeek: 'réservations cette semaine',
    },
    maxNBookingsByWeek1: 'Max ',
    maxNBookingsByWeek2: ' bookings per week',
    validity: 'Valid from ',
    validForNdays1: 'Valid for ',
    validForNdays2: ' day(s) after purchase',
    validFrom: 'Valid from ',
    validTo: ' to ',
    bookingsLeftThisWeek: 'Max bookings per week',
    addButton: 'Add a pass',
    noPaymentPackSubscribed: 'No pass subscribed',
    validUntil: 'Valid until',
    expirationDate: 'Expiration date',
    never: 'Never',
    unlimitedCredits: 'Unlimited',
    credits: 'Credit',
    credits_plural: 'Credits',
    availableOnFollowingSports: 'Available on following categories: ',
    availableOnFollowingEstablishments:
      'Available on following establishments: ',
    anySport: 'Any category',
    availableOnFollowingActivities: 'Available on following activities: ',
    anyActivity: 'Any activity',
    boughtConsumerPaymentPacks: 'Subscribers',
    noRestrictionOnActivityType:
      'All categories, activities, and establishments are compatible with this pass.',
    disabled: 'Disabled',
    noConsumerPack: 'There are no members with this pass to display.',
    reverted: 'Invoice reverted',
    link: {
      copied: 'Link copied',
      copyLink: 'Copy the direct link to the payment page',
    },
    actions: {
      delete: 'Delete',
      edit: 'Edit',
      scaleCredit: 'Mult / div credits',
      massExtension: 'Extend validity',
      close: 'Close',
    },
    specifications: {
      unlimitedCredits: 'Unlimited',
      nbCredits: '{{credits}} credit',
      nbCredits_plural: '{{credits}} credits',
    },
    ht: 'Excl. VAT / Sales Tax',
    validForDuration: {
      years: '{{ count }} year',
      years_plural: '{{ count }} years',
      months: '{{ count }} month(s)',
      days: '{{ count }} day',
      days_plural: '{{ count }} days',
      and: ' and ',
      attendance: 'Valid from the 1st attendance',
      booking: 'Valid from the 1st booking',
      purchase: 'Valid from the billing date',
      daysMonths:
        '{{ duration_months }} month(s) and {{ duration_days }} day(s)',
      valid: 'Validity: ',
      validFor: 'for ',
    },
    paymentPackDisabled: {
      error: 'Impossible to delete',
      success: 'Pass deleted',
    },
    scaleCredit: {
      actions: { submit: 'Save', cancel: 'Cancel' },
      factor: { label: 'Scale factor' },
      scaleUp: 'Multiply',
      scaleDown: 'Divide',
      parameterLegend: 'Settings',
      explain:
        'You can multiply the credit on the card (3/7 x2 becomes 6/14) or divide them in case of error (3/7 ÷ 2 becomes 1/3): rounded down.',
      title: '[Form] Changing credits',
    },
    notificationForm: 'Notification form',
    noPaymentPack:
      'Members need a valid pass to book your group activities and workshops.',
    disabledPacks: {
      hide: 'Hide archived passes',
      show: 'See the archived passes',
    },
    disabledPacksTitle: 'Archived passes',
    filters: {
      hasCreditNull: 'Without credits',
      hasCreditLeft: 'With credits',
      isActive: 'Active',
      isExpired: 'Expired',
      invoice: 'Invoices',
      reverted: 'Cancelled invoices',
      notReverted: 'Valid invoices',
      credits: 'Credits',
      expiration: 'Validity',
      all: 'All passes',
      isValidToday: 'Valid',
      company: 'Purchasing studio',
      companyGroup: 'Category',
      companyGroupPlaceholder: 'Select categories',
    },
    multipleBookingTooltip: 'Multiple bookings',
    maxNBookingsByMonth2: ' bookings per month',
    blockedCpp: 'Card blocked from {{-blocked_from}} to {{-blocked_until}}',
    penalty: {
      account:
        'A penalty of {{account_value}} will be applied if {{nb_cancellations}} late cancellation(s) are registered within {{nb_days}} day(s).',
      block:
        'This pass will be blocked for {{days_blocked}} day(s) if {{nb_cancellations}} late cancellation(s) are registered within {{nb_days}} day(s).',
      title: 'Cancellation policy',
    },
    only_vod_access: 'Only for Video On Demand',
    massExtension: {
      listItemNbDays: '+{{ count }} day',
      listItemNbDays_plural: '+{{ count }} days',
      createdAt: 'Added the {{date}}',
      listItemDate: 'Expiring between the {{ minDate }} and the {{ maxDate }}',
      cancel: 'Cancel',
      submit: 'Validate',
      title: 'Extend validity',
      titleDialog: 'Extend the validity for all members',
      maxDate: 'The latest the',
      minDate: 'The soonest the',
      dateHelpText: 'Only extend the passes expiring between the',
      helpText: 'This operation can not be reverted',
      error: {
        minEndingDate: 'Please enter a valid minimum date',
        maxEndingDate: 'Please enter a valid maximum date',
        nbDays: 'Please enter a positive number',
        note: 'The maximum number of characters for this field is 500',
      },
      listItem: { seeMore: 'See more', seeLess: 'See less' },
    },
    section: { massExtension: 'Validity extension' },
    category: {
      add: 'Add a category',
      popover: { delete: 'Delete', edit: 'Rename' },
      deleteModal: {
        title: 'Deletion',
        content:
          'Are you sure you want to delete this category? All items in it will be placed in the uncategorized course cards section',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
      form: {
        dialog: {
          name: 'Name of the category',
          titleNew: 'New category',
          titleEdit: 'Category',
          helper:
            'Categories are a useful way to organize your passes. These names will appear to your members on the Marketplace and Mobile App. ',
          update: 'Rename',
          create: 'Add',
          cancel: 'Cancel',
        },
      },
      category: 'Pass categories',
    },
    noCategory: {
      help: 'These passes will appear in an unnamed category on the marketplace.',
      name: 'No category',
      empty: 'There are no passes associated with this category to display.',
    },
    paymentPackTemplate: {
      specification: {
        companySharedWithTitle: 'Shared with the following studios:',
      },
      actions: {
        create: 'Add a shared pass',
        createUniversalPass: 'Add a shared universal pass',
      },
      deleteForm: {
        actions: { submit: 'Delete', close: 'Close' },
        content:
          'Members will still be able to use the pass at the studio where they bought it. Any subscription linked to this pass will remain valid at that same studio.',
        title: 'Delete shared pass',
      },
      form: {
        notEditable:
          'This pass originates from a previously completed data migration. Some fields may not be editable to preserve the data.',
        actions: { submit: 'Save', close: 'Close' },
        submit: 'Save',
        close: 'Close',
        title: '[Form] Shared pass',
        universalPassTitle: 'Shared universal pass',
        universalPassTooltip:
          'Universal passes may be used for group activities and appointments. Twin appointment passes are created for every universal pass to link the number of credits. Once one of these passes has been purchased, the other will be automatically added without any additional costs.',
        editConfirmation: {
          title: 'Edit confirmation',
          content:
            'Your changes will also be applied to subscriptions linked to this shared pass. Are you sure you want to proceed and save your edits?',
          cancel: 'Cancel',
          confirm: 'Save anyway',
        },
      },
      section: {
        titleManagerOnly: 'Not available for purchase',
        titleAvailable: 'Available for purchase',
      },
      isEmptyExplain:
        'Members can purchase and use this pass at any of the associated studios.',
      widget: { choose: 'Select the desired passes for sharing' },
      pass: 'Passes',
    },
    paymentPackTemplateInstance: {
      actions: { addCompany: 'Add a studio', buy: 'Purchase' },
      companyEmpty: 'No studios have been configured with this pass',
      deleteForm: {
        actions: { submit: 'Stop sharing', close: 'Close' },
        content:
          'If you stop sharing with this studio, passes purchased at that studio will still be valid, but only within that specific studio. Passes from other studios will no longer be valid there. This also applies to linked subscriptions.',
        title: 'Stop sharing with a studio',
      },
      form: {
        actions: { submit: 'Save', close: 'Close' },
        explain2:
          'Members who have purchased this pass or a linked subscription will be able to use it at any of the newly compatible studios.',
        explain1:
          "The following studios will automatically offer this pass, but won't be able to change its price or credit number.",
        title: 'Availability',
      },
      consumerPaymentPackSharedFromOtherFranchisee: 'Shared with a studio',
      isFromShareTooltip: 'This pass is shared from another franchise studio',
      paymentPackSharedFromFranchisor: 'Master Account Pass',
    },
    selector: {
      noAvailable: 'There are no compatible passes to display.',
      noManagerOnly: 'Visible on Marketplace',
      managerOnly: 'Hidden to members',
      filterManagerOnly: 'Visible to all',
      filterCategory: 'All categories',
      titleSort: 'Sort',
      titleManagerOnly: 'Visibility',
      titleCategory: 'Categories',
      sorting: {
        descendingCredit: 'Credits: descending',
        ascendingCredit: 'Credits: ascending',
        descendingPrice: 'Price: descending',
        ascendingPrice: 'Price: ascending',
        customSort: 'Additional orders (MarketPlace and App)',
      },
      unusableByStaff: 'Hidden to staff',
    },
    noUnauthorizedTag: 'There are no refused tags to display.',
    noAuthorizedTag: 'There are no authorized tags to display.',
    blackList: 'Refused tags',
    whiteList: 'Approved tags',
    activities: 'Activities',
    categories: 'Categories',
    establishments: 'Establishments',
    accessibility: {
      onsitePayment: 'Enable in-studio payments',
      managerOnly: 'Unavailable for purchase',
      newMembers: 'Only available for new customers',
    },
    tags: {
      blackList: '{{ count }} refused tag',
      blackList_plural: '{{ count }} refused tags',
      whiteList: '{{ count }} approved tag',
      whiteList_plural: '{{ count }} approved tags',
    },
    full_vod: 'Provides access to Video On Demand',
    seeAll: 'Show all',
    compatibility: {
      and: ' and ',
      establishments: '{{ count }} establishment',
      establishments_plural: '{{ count }} establishments',
      activities: '{{ count }} activity',
      activities_plural: '{{ count }} activities',
      categories: '{{ count }} categorie',
      categories_plural: '{{ count }} categories',
      compatible: 'Compatible with ',
      all: 'This pass is compatible with all categories, activities, and establishments.',
    },
    cardDetails: {
      packBlocking2: ' late cancellation(s) within a week',
      packBlocking1: ' day(s) blocked after ',
      maxPurchasePerMember: 'Maximum number of purchases: ',
      maxBookingPerDay: 'Maximum usage per day: ',
      maxBookingPerWeek: 'Maximum usage per week: ',
      maxBookingPerMonth: 'Maximum usage per month: ',
      universalPass:
        'Universal passes may be used for group activities and appointments.',
    },
    detailTitles: {
      vod: 'Video On Demand',
      restrictions: 'Restrictions',
      tags: 'Tags',
      accessibility: 'Accessibility',
      compatibility: 'Compatibility',
      validity: 'Validity',
      credit_quantity: 'Credits',
      universalPass: 'Universal pass',
      compatibilityPaymentPack: 'Compatibility for group activities',
      offPeak: 'Time slots',
    },
    unlimitedAndCalculatedMargin:
      ' The marginal value per booking is calculate as PRICE / NUMBER Of BOOKINGS ',
    unlimitedAndMargin: ' The marginal value per booking is ',
    validityTo: ' until ',
    unlimitedPlural: 'Unlimited',
    addPaymentPack: {
      doorAccess: 'Door access',
      accessControlInfo:
        'Members with this pass can unlock studio doors. To control when doors can’t be accessed, set time rules on the Kisi platform.',
      accessControlBetaAlert:
        'During this beta, pass restrictions like tags, usage limits, locations, activities, categories, and time slots don’t apply to door access. “Restrict usage to Video on Demand” must be turned off for door access to work.',
      enableAccessControl: 'Grant studio access',
      sumNotZero: "The final number of days can't be 0",
      only_vod_access: 'Restrict usage to Video On Demand',
      vodAccessCard: 'Enable access to Video On Demand',
      vod: 'Video On Demand',
      compatibility:
        'This pass will only be compatible with the selected classes, activities, categories, or establishments.',
      letBlank: 'Leave blank to not limit this pass',
      activities: 'Activities',
      room: 'Establishments',
      categories: 'Categories',
      inShopPayment: 'Enable on-site payments',
      notForSell: 'Hidden to members',
      newClientOnly: 'Only visible to new members',
      maxUseMember: 'Maximum purchases per member',
      maxUseMonth: 'Maximum usage per month',
      maxUseWeek: 'Maximum usage per week',
      maxUseHelper: 'Leave blank to not set a usage limit',
      maxUseDay: 'Maximum usage per day',
      restriction: 'Conditions',
      penalityAccountHelper:
        "Members' account balance will be charged {{ currencyDisplay }}{{penalityBlockAccount}}.",
      penalityBlockDayHelper:
        "Members' passes will be blocked for {{penalityBlockDay}} day(s).",
      penalityAccountPrice: 'Amount to charge',
      penalityBlockDay: 'Blocking period (in days)',
      penalityType: 'Penalty settings',
      penalityAccount: "Charge the member's account balance",
      penalityBlock: 'Temporarily block the pass',
      penalityInfo:
        'A penalty will be applied if {{penalityNumberCancel}} late cancellation(s) are registered within {{penalityNumberDay}} day(s).',
      penalityNumberDay: 'Number of days',
      penalityNumberCancel: 'Number of cancellations',
      marginalContributionHelperText:
        'This is used to calculate the payroll of the teachers. Example: {{ currencyDisplay }}10 for 1 booking means that the teacher will be paid {{ currencyDisplay }}10.  When left empty, the marginal value will be calculated as PRICE / NUMBER OF BOOKINGS.',
      marginalContribution: 'Theoretical marginal value incl. VAT',
      expirationDateHelper:
        "If the pass hasn't been used during this period, it'll automatically expire.",
      expirationDate: 'Number of days before the pass expires if unused *',
      beginningDate: 'Start date',
      attendance: 'Valid from the 1st attendance',
      firstBooking: 'Valid from the 1st booking',
      billing: 'Valid from the billing date',
      validForDuration: {
        day: 'This pass will be available for {{ duration_day }} day(s).',
        month:
          'This pass will be available for {{ duration_day }} day(s) and {{ duration_month }} month(s).',
        year: 'This pass will be valid for {{ duration_day }} day(s), {{ duration_month }} month(s), and {{ duration_year }} year(s).',
        monthNoDay:
          'This pass will be valid for {{ duration_month }} month(s).',
        yearNoDayNoMonth:
          'This pass will be valid for {{ duration_year }} year(s).',
        yearDayNoMonth:
          'This pass will be valid for {{ duration_day }} day(s) and {{ duration_year }} year(s).',
        yearNoDay:
          'This pass will be valid for {{ duration_month }} month(s) and {{ duration_year }} year(s).',
      },
      yearValidityHelper: 'This will be added to the number of days and months',
      monthValidityHelper: 'This will be added to the number of days',
      yearValidity: 'Years',
      monthValidity: 'Months',
      dayValidity: 'Days',
      endBeforeStart: 'The end date must be greater than the start date',
      toDate: 'Until',
      fromDate: 'From',
      availabilitySlot: 'Make this pass valid between certain dates',
      availabilityGivenNumber:
        'Make this pass valid for a certain number of days after purchase',
      penalityRule: 'This penalty can only be applied to unlimited passes',
      penality: 'Apply a penalty for too many late cancellations',
      packValidity: 'Validity',
      numberOfAvailableCredits: 'Number of available credits',
      decimalCredit: {
        helperText: 'This pass will contain {{count}} credit',
        helperText_plural: 'This pass will contain {{count}} credits',
      },
      credit: 'Credit',
      unlimited: 'Unlimited',
      limited: 'Limited',
      numberOfCredit: 'Number of credits',
      namePaymentPack: 'Name of the pass',
      name: 'Name',
      generalInfo: 'General',
      paymentPack: 'Pass',
      minusZero: "This field can't be 0",
      requiredField: 'This field is mandatory',
      creditWarning:
        'Attention: all passes will be edited if the number of credits is changed.',
      migration:
        'This pass originates from a previously completed data migration. Some fields may not editable to preserve the data. Compatible activities/categories can still be modified.',
      franchise:
        "The pass is shared through the Master Account. Certain settings have been predefined by said Master Account and can't be modified.",
      allowGuest: 'Compatible with guest bookings',
      penalityModeFranchisor: {
        buyer: {
          explain:
            'The member account balance will be charged with {{ price }} only on the franchisee in which the pass has been purchased.',
          label: 'On the franchisee who invoiced the pass',
        },
        prorata: {
          explain:
            'The member account balance will be charged with {{ price }} in proportion to the late cancelations registered in each franchisee. A total amount of {{ price }} will be charged on the franchise level.',
          label: 'In proportion to late cancelations in each franchisee',
        },
        label: 'Member account balance will be charged',
        prorataNoShow: {
          explain:
            'The {{ price }} fine will be applied pro rata to the no-shows recorded for each of your franchisees. A total of {{ price }} will be charged.',
          label: 'Pro rata, per franchisee, of no shows',
        },
      },
      unusableByStaff: 'Hidden to staff',
      expiration_date: {
        label: 'Duration of sale',
        helperText: 'Available until',
        tooltip:
          'After the chosen date, the pass will be unavailable for purchase',
      },
      description: 'Description',
      offPeak: {
        label: 'Restrict bookings to certain times',
        addGroupTimeSlot: 'Add a group of time slots',
        addTimeSlot: 'Add a time slot',
        choice: { allDay: 'All day', timeSlot: 'Time slots' },
      },
      atLeastOneDay: 'At least one day must be selected',
      startAfterEnd: 'Start time must be less than end time',
    },
    universalPass: {
      restore: {
        dialog: {
          continue: 'Continue',
          text: "This universal pass' twin passes have also been unarchived.",
          title: 'Unarchive',
        },
      },
      delete: {
        dialog: {
          warningText:
            'Attention! Deleting a universal pass will also delete its twin passes.',
          title: 'Delete pass',
        },
      },
      add: {
        credit: 'Number of credits',
        helperText: 'Number of credits is set to linited',
        availabilityGivenNumber: 'Valid for a set number of days post-purchase',
      },
    },
    previous: 'Previous',
    next: 'Next',
    maxoutInfo: {
      month: 'This pass can be used {{count}} time per month',
      month_plural: 'This pass can be used {{count}} times per month',
      week: 'This pass can be used {{count}} time per week',
      week_plural: 'This pass can be used {{count}} times per week',
      day: 'This pass can be used {{count}} time per day',
      day_plural: 'This pass can be used {{count}} times per day',
    },
    incompatibilities: {
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ACTIVITY_INCOMPATIBLE]:
        'Incompatible activity',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_SCT_INCOMPATIBLE]:
        'Incompatible category',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ESTABLISHMENT_INCOMPATIBLE]:
        'Incompatible establishment',
      [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_ENOUGH_CREDIT]:
        'Insufficient credits',
      [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_DISABLED]: 'The pass is blocked',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DATES_NOT_COMPATIBLE]:
        'The dates are incompatible',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_HAS_EXPIRED]: 'The pass has expired',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_LATER_FIRST_BOOKING]:
        'The pass starts at the first booking, le ',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_LATER_FIRST_ATTENDANCE]:
        'The pass starts at the first attendance, le ',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_INCOMPATIBLE_WITH_OFF_PEAK_SCHEDULE]:
        'Time slot is incompatible',
      paymentPack: 'Pass set as incompatible with this activity:',
    },
    listItem: { unusableByStaff: 'Invisible for the staff' },
    noShowPenalty: {
      block:
        '{{days_blocked}} days blocked after {{treshold}} no shows over a period of {{time_window_days}} days.',
      account:
        'A {{amount}} fine will be applied for {{treshold}} no shows over a period of {{time_window_days}} days.',
    },
    orderingAlert: {
      button: 'Customisation page',
      text: 'Any change to the order of the "Categories" will only affect the display of the "Passes" page of the marketplace and the application. This update will not affect any other section or category.',
    },
  };
};

exports.default = getTranslations();
