exports.default = {
  navigation: {
    dashboard: 'Dashboard',
    calendar: 'History',
    pack: 'Passes',
    invoice: 'Invoices',
    subscription: 'Subscriptions',
    profile: 'Profile',
    changeMembership: 'Change studio',
    logoff: 'Logout',
    myVideos: 'Video On Demand',
    pick_a_language: 'Select a language',
    automaticLanguage: 'Automatic language detection',
    giftcard: 'Gift cards',
    statistic: 'Statistics',
    connectedAs: 'Login as',
    backToRelationMasterSpace: 'Return to my account',
    relationConnectedAs: "You're currently connected as: {{name}}",
    goBack: 'Back',
  },
  pack: {
    titlePaymentPack: 'Group activities',
    titlePrivatePack: 'Appointments',
    titleUniversalPack: 'Universal',
  },
  booking: {
    titleBooking: 'Group activities',
    titlePrivateBooking: 'Appointments',
    showCalendar: 'Show the calendar',
    discard: 'Cancel',
    bookAgain: 'Book again',
    accessLive: 'Access livestream',
    spotNumber: 'Place: {{count}}',
    isUnpaid: 'Outstanding payment',
    noShow: 'You have been indicated as absent for this session',
  },
  dashboard: {
    favoriteTitle: 'Booking suggestion',
    nextBookingTitle: 'My bookings',
    currentPassTitle: 'My passes',
    showMore: 'Show more',
    noBooking: 'There are no future sessions to display.',
    noPackCurrentlyActive: 'There are no valid passes to display.',
    optionTitle: 'Active waitlists',
  },
  congratulation: {
    cancel: 'Close',
    content: 'Your purchase has been confirmed!',
  },
  actions: {
    goToSubscription: 'See all subscriptions',
    goToPass: 'See all passes',
    goToCalendar: 'Open the calendar',
    goToHome: 'See our entire offer',
  },
  debt: {
    explainPayment:
      'This amount will be paid to the studio to regularize your outstanding debt.',
    titlePaymentDialog: 'Complete payment',
    title: 'Outstanding debt',
    regularize: 'Complete payment',
  },
  unsubscriber: {
    success: "You've unsubscribed.",
    error: 'Error while unsubscribing',
    doUnsubscribe: 'Unsubscribe',
    explain:
      "Are you sure that you want to unsubscribe from of this studio's newsletters?",
  },
  myVideos: { title: 'My videos', gotToVOD: 'See all videos' },
  widget: {
    noBookingPast: 'There are no previous bookings to display.',
    noBookingFuture: 'There are no future sessions to display.',
    pastBooking: 'History',
    futureBooking: 'My bookings',
  },
  language: {
    nl: 'Dutch',
    it: 'Italian',
    de: 'German',
    es: 'Spanish',
    'en-GB': 'English (UK)',
    'en-US': 'English (US)',
    fr: 'French',
    none: 'Automatic',
    cs: 'Czech',
    pt: 'Portuguese',
  },
  subscription: { isEmpty: 'There are no active subscriptions to display.' },
  Basket: 'My basket',
  appbar: { login: 'Login', logout: 'Logout', profile: 'My account' },
  spivi: {
    settingsInfo:
      'If this option is activated, your data (speed, calories burned, etc.) will be displayed in real-time during your session. If you deactivate this option, your data will no longer be displayed, but you will receive your summary by e-mail at the end of the session.',
    settings: 'Display my data in real time',
    settingsTitle: 'Spinning data',
  },
  reworked: {
    showMore: 'Show more',
    showLess: 'Show less',
    placeholderCard: {
      myBookings: 'Choose a session to see more details',
      mySubscriptions: 'Choose a subscription to see more details',
      myPasses: 'Choose a pass to see more details',
    },
    myBookings: {
      title: 'My bookings',
      bookASession: 'Book a session',
      chooseBookingType: 'Choose booking type',
      tab: {
        activities: 'Activities',
        appointments: 'Appointments',
        workshops: 'Workshops',
      },
      filter: {
        upcoming: 'Upcoming',
        past: 'Past',
        onWaitlist: 'On waitlist',
      },
      listContainer: {
        placeholder: {
          pass: {
            active: 'Looks like you haven’t bought any pass yet.',
            future: 'Looks like you haven’t bought any pass yet.',
            expired: 'You have no expired passes yet.',
          },
          activity: {
            past: 'No past activities to show.',
            future: 'No upcoming activities scheduled.',
            waitlist: 'No activities on waitlist.',
          },
          appointment: {
            past: 'No past appointments to show.',
            future: 'No upcoming appointments scheduled.',
          },
          workshop: {
            past: 'No past workshops to show.',
            future: 'No upcoming workshops scheduled.',
            waitlist: 'No workshops on waitlist.',
          },
        },
      },
      consumerBookingCard: {
        chip: {
          online: 'Online',
          atHome: 'At home',
          noShow: 'No Show',
          status: {
            unpaid: 'Unpaid',
            bookedForAGuest: 'Booked for a guest',
            cancelled: 'Cancelled',
          },
        },
        buttonsLabel: {
          cancel: 'Cancel',
          more: 'More',
          seeDetails: 'See details',
          book: 'Book',
          joinOnline: 'Join online',
          bookForAGuest: 'Book for a guest',
        },
        listItemLabels: {
          waitingList:
            'Your position in the waitlist is: {{ waitingListPosition }}',
          spotSchedulingPosition: 'Spot {{ spotSchedulingPosition }}',
        },
      },
      detailsCard: {
        cancelled: {
          title: 'Cancelled',
          cancelledFromMember: 'Cancelled by you',
          cancelledFromManager: 'Cancelled by studio manager',
          creditsToRefund: '{{count}} credit will be refunded',
          creditsToRefund_plural: '{{count}} credits will be refunded',
          refundWarning: 'No credit refunds for late cancellations',
        },
        relatedPass: { title: 'Related Pass' },
        location: { title: 'Location' },
        description: { title: 'Description' },
        cancellationPolicy: {
          title: 'Cancellation policy',
          noDuration: 'Cancellations are always possible without any charges.',
          maxDuration:
            'Cancellations are possible without any charges up to {{days}} day(s), {{hours}} hour(s) and {{minutes}} minute(s).',
        },
        waitlist: {
          position: 'Your position in the waitlist is: {{position}}',
        },
        teacher: {
          title: 'Teacher',
          absent: 'Absent',
          subtitutedBy: 'Subtituted by',
        },
        workshop: { title: 'Grouped with this workshop' },
      },
      cancelModal: {
        title: {
          consumerBooking: 'Cancel this session',
          consumerPrivateBooking: 'Cancel this appointment',
          consumerBookingOption: 'Cancel this waitlist',
        },
        creditsWillBeRefunded: '{{count}} credit will be refunded.',
        creditsWillBeRefunded_plural: '{{count}} credits will be refunded.',
        noRefund: "Your credit(s) won't be refunded for late cancellation.",
        waitlist: 'You will be removed from the waitlist.',
        group: {
          message:
            "This booking is part of a group.\nYou'll be automatically unsubscribed from all future sessions that are associated to this event. The credits will be refunded and can be used again.",
          alert: {
            title: 'All bookings for this event will be cancelled',
            message:
              'Contact the studio if you wish to cancel a single session.',
          },
          listTitle: 'Bookings that will be canceled:',
        },
        confirm: {
          consumerBooking: 'Cancel session',
          consumerPrivateBooking: 'Cancel appointment',
          consumerBookingOption: 'Cancel waitlist',
        },
      },
      calendarDrawer: {
        title: 'Choose a date',
        subtitle: {
          activity: 'Filter your activities by date.',
          appointment: 'Filter your appointments by date.',
          workshop: 'Filter your workshops by date.',
        },
      },
      onlineWarningModal: {
        title: 'Online activity',
        subtitle: 'The session will begin on {{- date}} at {{hour}}',
        message:
          'You will be able to open this link 15 minutes before the session.',
      },
      spotSchedulingModal: {
        title: 'Spot schedule',
        subtitle: 'Quickly find your spot in class',
      },
    },
    myPasses: {
      title: 'My passes',
      choosePassType: 'Choose pass type',
      tab: {
        activity: 'Activities',
        appointment: 'Appointments',
        universal: 'Universal',
      },
      filters: {
        active: 'Active',
        expired: 'Expired',
        future: 'Future',
      },
      buyANewPass: 'Buy a new pass',
      bookASession: 'Book a session',
      consumerPassCard: {
        unlimited: 'Unlimited',
        credits: '{{ creditsLeft }}/{{ totalCredits }} credits',
        chip: {
          suspended: 'Suspended',
          shared: 'Shared',
          multiStudio: 'Multi-studios',
        },
        availability: {
          active: 'Expires: {{ expirationDate }}',
          expired: 'Expired: {{ expirationDate }}',
          future: 'Starts: {{ startDate }}',
          expiresIn_plural: '{{ daysRemaining }} days left',
          expiresIn: '{{ daysRemaining }} day left',
          expiresToday: 'Last day',
        },
        buttonsLabel: {
          seeDetails: 'See details',
        },
      },
      consumerPassDetailsCard: {
        header: {
          credits: '{{ creditsLeft }}/{{ totalCredits }} credits',
          unlimited: 'Unlimited',
        },
        availability: {
          active: 'Valid from {{ startDate }} to {{ expirationDate }}',
          suspended: 'Suspended',
          suspendedUntil: 'Suspended until {{ endDate }}',
          expired: 'Expired on {{ expirationDate }}',
          future: 'Starts on {{ startDate }}',
          validUntil: 'Valid until {{ expirationDate }}',
        },
        description: {
          title: 'Description',
          showMore: 'Show more',
          showLess: 'Show less',
        },
        compatibility: {
          titles: {
            studios: 'Compatible studios',
            activity: 'Activities compatibility',
            appointment: 'Appointment compatibility',
            main: 'Compatibility',
          },
          subtitles: {
            activity: 'Compatible activities',
            timeSlots: 'Compatible time slots',
            sessions: 'Compatible sessions',
          },
          contents: {
            allActivities: 'Compatible with all activities of the studio',
            allTimeSlots: 'Compatible with all the time slots',
            vod: 'Can be used for <strong>Videos on demand</strong>',
            bookingForGuest: 'Can be used to <strong>Invite a guest</strong>',
            noAppointments: 'No compatible appointments',
            allSessions: 'Compatible with all sessions',
            sessions: 'Compatible sessions: {{ sessionsList }}',
          },
          labels: {
            category: 'Categories',
            activity: 'Activities',
            room: 'Rooms',
          },
        },
        restriction: {
          title: 'Restrictions on use',
          frequencyDaily: 'Can only be used {{ amount }} time per day.',
          frequencyDaily_plural: 'Can only be used {{ amount }} times per day.',
          frequencyWeekly: 'Can only be used {{ amount }} time per week.',
          frequencyWeekly_plural:
            'Can only be used {{ amount }} times per week.',
          frequencyMonthly: 'Can only be used {{ amount }} time per month.',
          frequencyMonthly_plural:
            'Can only be used {{ amount }} times per month.',
        },
        shared: {
          with: 'Shared with',
          by: 'Shared by',
        },
      },
    },
    mySubscriptions: {
      placeholder: {
        nonExpired: 'Looks like you don’t have any active subscriptions.',
        expired: 'You have no expired subscriptions yet.',
      },
      title: 'My subscriptions',
      dateLabel: {
        active: 'Started on {{- date }}',
        future: 'Starts on {{- date }}',
        expired: 'Expired since {{- date }}',
        until: ' until {{- date }}',
      },
      tab: {
        active: 'Active',
        future: 'Not started',
        expired: 'Expired',
      },
      download: 'Download',
      paymentModalAlert:
        'If no payment method is saved a debt will be automatically created on your internal account for each payment',
      changePaymentMethod: 'Change payment method',
      headerButtonsLabel: {
        bookASession: 'Book a session',
        getSubscription: 'Get a subscription',
      },
      consumerSubscriptionCard: {
        nextPayment: 'Next payment: {{- nextPayment }}',
        recurrenceLabelPer: '{{ price }}{{ currency }}/{{ interval }}',
        recurrenceLabelEvery:
          '{{ price }}{{ currency }} every {{ recurrence }} {{ interval }}',
        buttonsLabel: {
          seeDetails: 'See details',
          addPaymentMethod: 'Add payment method',
        },
        chipsLabel: {
          isPaused: 'Paused',
          missingPaymentMethod: 'Missing payment method',
          failedPayment: 'Payment failed',
        },
      },
      consumerSubscriptionCardDetails: {
        description: 'Description',
        terms: 'Terms',
        termsAccepted: 'Accepted on {{- termsDate }}',
        buttonsLabel: {
          see: 'See',
          add: 'Add',
          change: 'Change',
        },
        headerListItemLabels: {
          futurePauses:
            'A pause is scheduled from {{- dateStart }} to {{- dateEnd }} (included)',
          nextPayment: 'Next payment',
          paused: 'Currently paused',
          autoRenewed: 'Automatically renewed',
          autoRenewalDate: 'on {{- autoRenewalDate }} (included)',
          pauseEndDate: 'until {{- pauseEndDate }} included',
          nextPaymentDate: 'on {{- subscriptionNextPaymentDate }}',
          joiningFee: 'Joining fee: {{- fees }}',
        },
        failedPayment: 'Payment failed',
        failedPaymentReason:
          'Reason: {{- note }} Please contact  your studio to regularize the situation',
        failedPaymentReasonWithRetry:
          'Reason: {{- note }}. The payment will be retried on {{- nextRetryDate}}',
        paymentMethod: {
          title: 'Payment method',
          internal:
            'Internal account: for each payment, a debt is automatically created on your internal account',
          sepa_debit: 'SEPA: **** **** **** {{ readableIdentifier }}',
          card: 'Card: **** **** **** {{ readableIdentifier }}',
          bacs_debit:
            'Bacs Direct Debit: **** **** **** {{ readableIdentifier }}',
          paused: 'Currently paused',
          autoRenewed: 'Automatically renewed',
          autoRenewalDate: 'on {{- autoRenewalDate }} (included)',
          pauseEndDate: 'until {{- pauseEndDate }} included',
          nextPaymentDate: 'on {{- subscriptionNextPaymentDate }}',
        },
        billingHistory: 'Billing history',
        emptyInvoices: ' No billing history to show',
      },
    },
  },
};
