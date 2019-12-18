export default {
  consumerPaymentPack: {
    addExtension: 'Extend validity',
  },
  search: 'Search a pass',
  extension: {
    nbDaysAdded: '+{{nb_days}}d',
    addedOn: 'Added on ',
    delete: {
      title: 'Delete validity extension',
      explain: 'Are you sure you want to delete this validity extension ?',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    create: {
      title: 'Pass extension',
      cancel: 'Cancel',
      submit: 'Create',
      note: {
        label: 'Notes',
      },
      explain: {
        oldDate: 'Old date: ',
        newDate: 'New date: ',
      },
      warning:
        'Please check that the new date is included in the same fiscal year as the old one. If not, please check with your accounting this operation is correct.',
      nbDays: {
        label: 'Nb of additional days',
      },
    },
  },
  form: {
    paymentPack: {
      from: 'From',
      until: 'Until',
      newMemberOnly: 'Only available to new customers',
      onsitePaymentAvailable: 'On-site payment available',
      managerOnly: 'Unavailable for customers',
      tax: {
        label: 'Tax',
      },
      startOnFirstUse: {
        label: 'Pass validity countdown start after first booking',
        helperText: 'Otherwise the countdown immediately starts after billing',
      },

      name: {
        label: 'Name',
        helperText: 'Name for the payment pack',
      },
      price: {
        label: 'Pric incl. taxes',
        helperText: 'Price for user for the whole pack',
      },
      credits: {
        label: 'Credit',
        helperText: 'Credits for the pack, leave blank for unlimited',
      },
      maxBookingPerWeek: {
        helperText: 'Booking quota per week, empty means no limit',
        label: 'Max usage per week',
      },

      expirationDaysBeforeFirstUse: {
        label: 'Expiration if no booking made',
        helperText:
          'If no first booking is made during this number of days, the pass expires and can not be used',
      },
      helper: {
        starting_date:
          'Start date for pack, leave blank for direct availability',
        ending_date: 'End date for pack, leave blank for no end',
      },
      start_date_method: {
        on_purchase: 'Starts on billing date',
        on_booking: 'Starts on booking date',
        on_attendance: 'Start on 1st attendance',
      },
      timeSettingsTitle: 'Pass validity',
      generalSettingsTitle: 'General',
      validByDuration: 'Pass valid N days after purchase',
      validByDaterange: 'Pass valid on a specific date range',
      durationDays: {
        label: 'Validity period',
        helperText:
          'Numbers of days for which the pass will stay active after purchase',
      },
      durationMonths: {
        label: 'Additional duration (month)',
        helperText: 'Sum itself with the number of days',
      },
      durationYears: {
        label: 'Additional duration (years)',
        helperText: 'Sum itself with the number of days and months',
      },
      restrictionsTitle: 'Restrictions',
      noneMeansAll: 'Keep empty to authorize all',
      update: {
        success: 'Pass: operation succeeded',
        error: 'Pass: operation failed',
      },
      actions: {
        skip: 'Skip',
        edit: 'Modify',
        create: 'Save',
      },
      sports: 'Category',
      activities: 'Activity',
      establishments: 'Establishment',
      delete: {
        title: 'Deleting pass :',
        askConfirmation:
          'Be careful ! This deletion is definitive. The pass will not be visible anymore and will be unavailable for purchase.',
        thereAreConsumers:
          'Be careful ! Some members have bought this pass, if you disable it, they can continue to use until they exhaust their credits. If you want to disable it completely, consider reducing their credits here. The pass will not appear in your marketplace anymore.',
        actions: {
          cancel: 'Cancel',
          submit: 'Delete',
        },
      },
    },
  },
  details: {
    pleaseSelectAPack: 'Select a pass to see the details',
    shareAPass: 'Share a pass',
    invoiceTitle: 'Linked invoice',
    bookingsTitle: 'Bookings',
    extensionsTitle: 'Validity extension',
  },
  newMemberOnly: 'Disponible uniquement aux nouveaux membres',
  publicPacksTitle: 'Pass available for purchase',
  privatePacksTitle: 'Pass unavailable for purchase',
  subscribeToOffer: 'Register',
  use: 'Use',
  createOrUpdate: {
    success: 'Pass successfully saved',
    fail: 'Error: pass would not be saved',
  },
  disableConsumer: 'Block',
  enableConsumer: 'Unblock',
  credit: {
    updated: 'Credits updated',
  },
  consumer: {
    isFromShare: 'Shared from another account',
    isOwnerOfShares: 'Shared (master pass)',
    isFromDisabledShare: 'Sharing stopped',
    expiresOn: 'Expires on ',
    bookingsThisWeek: 'réservations cette semaine',
  },
  validForDuration: (days, months, years) =>
    `${days ? `${days} days ` : ''}${months ? `${months} months ` : ''}${
      years ? `${years} year` : ''
    }`,
  maxNBookingsByWeek1: 'Max ',
  maxNBookingsByWeek2: ' bookings per week',
  validity: 'Validity :',
  validForNdays1: 'Valid for ',
  validForNdays2: ' days after purchase',
  validFrom: 'Valid from ',
  validTo: ' to ',
  bookingsLeftThisWeek: 'Max bookings per week',
  addButton: 'Create a new pass',
  noPaymentPackSubscribed: 'No pass subscribed',
  validUntil: 'Valid until',
  expirationDate: 'Expiration date',
  never: 'Never',
  unlimitedCredits: 'Unlimited',
  credits: 'Credits',
  availableOnFollowingSports: 'Available on following sports: ',
  availableOnFollowingEstablishments: 'Available on following locations: ',
  anySport: 'Any sports',
  availableOnFollowingActivities: 'Available on following activities: ',
  anyActivity: 'Any activity',
  boughtConsumerPaymentPacks: 'Subscribers',
  noRestrictionOnActivityType: 'No restriction on activity',
  disabled: 'Disabled',
  noConsumerPack: 'No pass registered yet',
  reverted: 'Invoice reverted',
  link: {
    copied: 'Link copied',
    copyLink: 'Copy link to payment page',
  },
};
