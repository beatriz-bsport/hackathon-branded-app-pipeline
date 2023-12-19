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
    },
    myBookings: {
      title: 'My bookings',
      bookASession: 'Book a session',
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
          activity: {
            past: 'No past activities to show.',
            future: 'No upcoming activities scheduled.',
          },
          workshop: {
            past: 'No past workshops to show.',
            future: 'No upcoming workshops scheduled.',
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
        title: 'Cancel session',
        creditsWillBeRefunded: '{{count}} credit will be refunded.',
        creditsWillBeRefunded_plural: '{{count}} credits will be refunded.',
        noRefund: "Your credit(s) won't be refunded for late cancellation.",
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
      },
    },
  },
};
