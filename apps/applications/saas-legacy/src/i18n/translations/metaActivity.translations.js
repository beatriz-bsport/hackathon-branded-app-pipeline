exports.default = {
  metaActivity: 'Activity',
  search: 'Search a group activity',
  forms: {
    create: {
      compatible_packs: {
        seeMore: 'See more',
        createPass: 'Add a pass',
        goToActivity: 'Go to activity',
        passHelperText: 'These passes are available for the created activity:',
        noCompatiblePass:
          'No pass available for this activity, remind to create one',
      },
      steps: {
        activity_form: 'Create an activity',
        pass_form: '(Optional) Add a pass',
        pass_list: 'Finish',
        offer_form: '(Optional) Add sessions',
        workshop_form: 'Add a workshop',
      },
    },
    delete: {
      actions: { confirm: 'Delete', cancel: 'Cancel' },
      content: {
        cannotDelete:
          'There are upcoming sessions planned for this activity. Check if they have been cancelled.',
        canDelete:
          "Are you sure that you want to delete this activity? The sessions and past bookings won't be modified. This action can't be undone.",
      },
      title: 'Delete an activity',
    },
    warning: {
      highLastBookingBeforeWarning:
        'Please note that {{ durationFormatted }} before the start of the session, no more reservations will be possible!',
      lowFirsBookingUntilWarning:
        'Please note that you must wait until {{ durationFormatted }} before the start of the session in order to make the very first booking!',
    },
  },
  detail: {
    pack: {
      noCompatiblePass: 'No Compatible pass',
      consumerPacks: 'Bought by',
      paymentPacks: 'Compatible passes',
    },
    tab: {
      general: 'General',
      pack: 'Compatible passes',
      group: 'Grouped sessions',
    },
  },
  name: 'Name',
  category: 'Sport',
  addOffers: 'Add sessions',
  offersThisDay: "Today's sessions:",
  description: 'Description',
  settings: {
    title: 'Settings',
    lastBookingBeforeMinutes:
      'Members can book up to {{m}} before the start of the session.',
    lastDiscardBeforeMinutes:
      'Members can cancel free of charge up to {{m}} before the start of the session.',
    firstBookingMinutesUntil:
      'Members can book sessions for up to {{m}} in the future.',
    conditions: 'Cancellation policy',
    autoDiscard:
      'The session will be cancelled if there are {{nb_bookings}} booking(s) or less {{hours}}h before the start of the session.',
    firstBookingMinutesUntilHeader: 'Opening of booking window',
    lastDiscardBeforeMinutesHeader: 'Cancellation policy',
    seeRestrictions: 'See',
    restrictions: ' Custom restriction: {{ count }}',
    restrictionsHeader: 'Custom restrictions',
    autoDiscardHeader: 'The session will be cancelled if',
    lastBookingBeforeMinutesHeader:
      'Last possibility of booking before the start of the session',
    lastDiscardBeforeMinutesFull:
      'Cancellations possible until {{m}} before the start of the session',
    lastBookingBeforeMinutesFull:
      'Last bookings possible until {{m}} before the start of the session',
  },
  modal: {
    delete: {
      title: 'Delete activity',
      content:
        'Are you sure you want to delete this activity ? Booking and sessions will not be altered. This operation is not revertable.',
      cancel: 'Cancel',
      confirm: 'Delete',
    },
  },
  packsAvailable: 'Pass available for this activity :',
  reviews: 'Customer reviews: ',
  navigation: { goToPaymentPack: 'Passes' },
  actions: {
    search: 'Search an activity',
    addActivity: 'Add a group activity',
  },
  noActivities:
    'Group activities are classes taught to a group. Here you can add, edit, and manage your group activities.',
  disabledMetaActivities: 'Archived group activities',
  workshop: 'Workshop',
  groupedOption: {
    modal: {
      form: {
        recurrenceNumberPrefix: 'Repeat every',
        impossibleState:
          'The parameters entered do not allow the generation of a group',
        submit: 'Validate',
        back: 'Previous',
        save: 'save',
        delete: {
          content:
            "Deleting this event will result in the cancellation of all enrolled members' bookings. This action can't be undone.",
          missingOffer: 'No offers in the group',
          firstSession: 'The first upcoming session is on: {{-day}}',
          selectHeader: 'Select the groups that will be modified',
          selectGroup: 'Cancel other similar groups',
          applyRecursive: 'Cancel other similar groups',
          title: 'Suppression',
        },
        copyRecurrence: 'Also duplicate future group recurrences',
        required: 'At least one group is needed',
        next: 'Next',
        groupName: 'Name',
        daily: 'Every day',
        recurrence: 'Recurrence',
        timeStart: 'Starting date',
        preview: 'Preview',
        recurrenceUntilHelper2:
          "It's not possible to add sessions after this date.",
        recurrenceUntilHelper: 'Please indicate the end date of this event.',
        timeStartHelper:
          "Select the date of this event's first sessions. All future sessions will be associated to the event according to this date.",
        recurrenceUntil: 'Repeat until',
        nameCaption: 'Event name',
        recurrenceCount: 'Number of repetitions',
        withRecurrence: 'Enable recurrence',
        marketPlaceAvailable: 'Available for booking (web + app)',
        allowBookingAfterStartCaption:
          "By default, it's not possible for members to enrol for events that have already started. Activate this option to allow enrolments for the remaining sessions.",
        allowBookingAfterStart: 'Allow enrolment on the way',
        fullBookingOnlyCaption:
          "By default, your members will be automatically enrolled for all sessions in this group when booking one of the sessions in the group. Deactivate this option to allow your members to select separately for which sessions they'd like to enroll for.",
        fullBookingOnly: 'Book all the sessions in the group at once',
        name: 'Name',
        subtitleRecurrence: 'Recurrence',
        subtitleSettings: 'Settings',
        addOffers: 'Add sessions',
        subtitleOffers: 'Sessions',
        subtitle: 'General',
        allowGuest: 'Compatible with the booking for a guest feature',
        allowGuestUnavailable:
          "This feature isn't available for grouped sessions.",
        creationError: 'Impossible to create',
        uncreatedGroupsTitle: 'Groups not created',
        syncOnSpivi: 'Send to Spivi',
        spiviWarningHelperText:
          'Please note that if sessions are linked to Spivi, their copies will not be linked to Spivi.',
      },
      duplicate: 'Duplicate a group',
      subtitlePreview: 'Preview of the recurrence',
      subtitleMetaActivitySelect: 'Configuration',
      title: 'Grouped sessions',
    },
    offerDescription:
      '{{ count }} session(s) from {{- firstSession }} until {{- lastSession }}',
    helperText: {
      year: 'This event starts every year on: {{-day}} {{-mont}}',
      year_plural:
        'This event starts every year on: {{-day}} {{-month}} for {{ count }} year(s)',
      day: 'This group is rehearsed every day',
      day_plural: 'This group is repeated every {{ count }} day',
      week: 'This group starts on {{-day}} ,every week',
      week_plural: 'This group starts on {{-day}} every {{ count }} week',
      month: 'This event starts every month on: {{-day}}',
      month_plural:
        'This event starts every month on: {{-day}} for {{ count }} month(s)',
    },
    last: 'last',
    intervalLabel: {
      until: {
        year: 'Every year until {{-until}} ',
        year_plural: 'Every {{ count }} year(s) until {{-until}} ',
        day: 'Every day until {{-until}} ',
        day_plural: 'Every {{ count }} day until {{-until}} ',
        week: 'Every week until {{-until}} ',
        week_plural: 'Every {{ count }} week until {{-until}} ',
        month: 'Every month until {{-until}} ',
        month_plural: 'Every month from {{ count }} until {{-until}} ',
      },
      year: 'Every year',
      year_plural: 'Every {{ count }} year',
      day: 'Every day',
      day_plural: 'Every {{ count }} day',
      week: 'Every week',
      week_plural: 'Every {{ count }} week',
      month: 'Every month',
      month_plural: 'Every {{ count }} month',
    },
    warning: {
      groupsWithOutOfTheRangeOffers:
        'The session groups below will not be created because they include sessions that are more than 3 years away',
      uncreatedGroups:
        'Please note that some groups will not be created. \nYou can find them in the section "Groups not created" at the bottom of this list',
    },
    errors: {
      offers_length:
        'You have created only one session. In order to create a group of sessions, add at least two sessions. If you want to create a single session, you can do it directly from the workshop in question or the calendar tab.',
    },
  },
  cancelledOffers: '{{count}} cancellations',
  workshopSelect: 'Search for a workshop',
  close: 'Close',
  edit: 'Edit',
  warningUSCDialog: {
    title: 'Cancellation policy on USC',
    content:
      'The new cancellation policy will apply to future events. However, events already published within the next two weeks cannot be updated.',
  },
};
