const getTranslations = async () => {
  const {
    PRIVATE_PASS_CAN_NOT_BOOK_SERVICE_NOT_COMPATIBLE,
    PRIVATE_PASS_CAN_NOT_BOOK_ENOUGH_CREDIT,
    PRIVATE_PASS_CAN_NOT_BOOK_LATER_FIRST_BOOKING,
    PRIVATE_PASS_CAN_NOT_BOOK_HAS_EXPIRED,
    PRIVATE_PASS_CAN_NOT_BOOK_DATES_NOT_COMPATIBLE,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js'
  );

  return {
    serviceGroup: {
      delete: 'Delete',
      edit: 'Edit',
      isEmpty:
        'No appointments have been associated to this category to display.',
      selector: { placeholder: 'Category' },
      form: {
        title: 'Category',
        name: { label: 'Name' },
        actions: { cancel: 'Cancel', submit: 'Save' },
      },
    },
    availabilitySlot: {
      form: {
        resourceSelector: {
          title: 'Edit slot',
          label: 'Edit:',
          cancel: 'Cancel',
          submit: 'Save',
          warning: 'This teacher is associated to no appointment',
        },
      },
      private_service: 'Appointment type',
      establishment: 'Establishment',
      coach: 'Teacher',
      detail: {
        detailEmpty: 'No availability on the selected slot',
        dialog: { title: 'Availability details' },
        openHours: 'Schedules',
        availableEverywhere: 'Available in all establishments',
        slotBoundaries: 'From {{date_start}} to {{date_end}}',
        ok: 'OK',
      },
      specificAvailabilityForm: {
        advanced: 'Advanced',
        infoForCoach:
          'By default you will be available in all the establishments. By activating this option you will be able to select in which establishments you will be available for this time slot.',
        info: 'By default, your teacher will be indicated as available in all your establishments. By activating this option you will be able to select in which establishments your teacher will be available for this time slot.',
        switchLabel: 'Add for certain establishments only',
      },
      notAssociatedDialog: {
        close: 'Close',
        checkbox: "Don't remind me again",
        info: 'The availability has been saved. However, this teacher is not associated with any appointment.\nIn order to link a new appointment with this teacher, associate him/her with the desired appointment from the Appointments tab.',
        title: 'No associated appointments',
      },
      notAssociatedWarning:
        'Attention, this teacher is not associated with any appointment. To link a new appointment with this teacher, associate him/her with the desired appointment from the Appointments tab.',
    },
    resource: {
      form: {
        color: 'Color code',
        actions: { cancel: 'Cancel', submit: 'Save' },
      },
      groupBy: 'Group by',
      unGroup: 'None',
      datatype: {
        establishment: 'Establishments',
        coach: 'Teachers',
        associated_establishment: 'Establishments',
        associated_coach: 'Teachers',
        private_service: 'General',
      },
      selector: { title: 'Filter by availability' },
      allocationWarning: {
        showCalendar: 'See the calendar',
        establishment: "This establishment isn't available at this time slot.",
        coach: "This teacher isn't available at this time slot.",
        title: "There's no availability to display.",
        loading: 'Verifying availability',
        resource: "Attention! {{ resource }} isn't availably at this moment.\n",
        continue: 'Are you sure that you want to move this appointment?',
        validate: 'Confirm',
        cancel: 'Cancel',
      },
    },
    pageTitles: {
      passList: 'Appointment passes',
      serviceList: 'Appointments',
      calendar: 'Calendar',
    },
    color: {
      form: { title: "Teacher's color code", cancel: 'Cancel', submit: 'Save' },
    },
    payment: {
      address: {
        explain: 'Add an address for at home sessions.',
        save: 'Save',
      },
    },
    privateSlot: {
      delete: {
        title: 'Delete session',
        explain:
          "Are you sure that you want to delete this appointment? Past bookings will not be deleted. This action can't be undone.",
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
      duration: '{{ minutes }} min.',
    },
    privateBooking: {
      cancel: 'Cancel',
      incompatibleTagsDialog: {
        title: 'Info',
        description:
          'Please note that this member does not have the required tags for this appointment. Do you want to book them in anyway?',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
      hardDelete: 'Delete',
      isCancelled: 'Cancelled',
      detail: {
        title: 'Booking',
        registeredOn: 'Booked on ',
        source: 'Booked via ',
        slotTitle: 'Session',
        passTitle: 'Appointment pass',
        wasRefunded: 'The credit(s) will be refunded to the pass.',
        wasRefundedYes: 'Yes',
        wasRefundedNo: 'No',
        address: 'Address',
        attachCoach: 'Assign a teacher',
        coach: 'Teacher',
        cancelledOn: 'Cancelled on ',
        unpaidBooking:
          'The member selected the option to pay later. The {{ credits}} credit(s) for this unpaid booking will be debited from the first purchased appointment pass.',
        cancelledByRecurrenceBy: 'Cancelled by',
        cancelledBy: 'Cancelled by',
        restoredBy: 'Restored by',
        dateModifiedBy: 'Edited by',
        coachModifiedBy: 'Edited by',
        cancelledByRecurrence: 'Recurring booking cancellation',
        cancelled: 'Cancellation',
        restored: 'Restore',
        dateModified: 'Edit',
        coachModified: 'Edit',
        canal: 'Channel',
        initialDateTime: 'Initial time and date',
        emptyHistory: "There's no history to display.",
        historyTitle: 'History',
        by: 'By',
        cancelledByRecurrenceOn: 'Recurring booking cancelled on ',
      },
      managerAdd: {
        title: 'New booking',
        address: 'Address',
        coachSelector: { label: 'Teacher' },
        pleaseSelectCoachAndSlot: 'Firstly select a teacher and a time slot.',
        cancel: 'Cancel',
        compatiblePrivatePass: 'Quick Billing',
        compatiblePrivateConsumerPass: 'Available appointment passes',
        emptyPrivateConsumerPass:
          "This member doesn't own any appointment pass.",
        emptyPrivatePass:
          'There are no compatible appointment passes to display.',
        privateConsumerPassNeedRefresh: 'Refresh',
        incompatibilities: {
          [PRIVATE_PASS_CAN_NOT_BOOK_SERVICE_NOT_COMPATIBLE]:
            'Non compatible appointment',
          [PRIVATE_PASS_CAN_NOT_BOOK_ENOUGH_CREDIT]:
            'Insufficient number of credits',
          [PRIVATE_PASS_CAN_NOT_BOOK_LATER_FIRST_BOOKING]:
            'The pass starts with the first booking, the ',
          [PRIVATE_PASS_CAN_NOT_BOOK_HAS_EXPIRED]: 'The pass is expired',
          [PRIVATE_PASS_CAN_NOT_BOOK_DATES_NOT_COMPATIBLE]:
            'The dates are incompatible',
          close: 'Close',
          privateService:
            'Pass configured as incompatible with the appointment in question:',
        },
        noUncompatiblePassToDisplay: 'No appointment pass not compatible',
        nonCompatiblePrivateConsumerPass:
          'Not compatible owned appointment passes:',
      },
      delete: {
        title: 'Cancel booking',
        explain:
          "Are you sure that you want to cancel this booking? This action can't be undone.",
        explainHardDelete:
          "This booking has already been cancelled. By deleting it, it'll also disappear from your calendar. The credit(s) will be refunded to the passes, if this hasn't been done already. This action can't be undone.",
        explainForceRefund:
          'Refund the used credits to the pass and allow a new booking.',
        cancel: 'Cancel',
        confirm: 'Confirm',
        consumer: {
          content: {
            notDiscardable:
              "Are you sure that you want to cancel this appointment? Your credit(s) won't be refunded, because you're cancelling too late.",
            discardable:
              'Are you sure that you want to cancel this appointment? Your credit(s) will be refunded.',
          },
          confirm: 'Confirm',
          cancel: 'Cancel',
          title: 'Cancel appointment',
        },
        sendCancellationMail: 'Send {{name}} a cancellation email.',
        explainWithRestore:
          'Are you sure you want to cancel this booking? You can undo this later.',
        explainMoreHardDeleteReccurentBooking:
          'This booking is associated to a rule for recurring appointments. Deleting the booking will cause the system to regenerate it to match the rule\'s criteria. Avoid this regeneration by leaving the status on "Cancelled".',
        hardDeleteTitle: 'Delete session',
        explainMoreHardDeleteReccurentBookingTitle: 'Recurring appointment',
      },
      discard: 'Cancel appointment',
      updateTime: {
        cancel: 'Cancel',
        submit: 'Save',
        explainEmail:
          'Members will automatically receive a notification of this.',
        title: 'Edit appointment',
      },
      editTime: 'Edit',
      attachCoach: {
        actions: { title: 'Assign a teacher', cancel: 'Cancel' },
        explain:
          'Choose a teacher to assign this appointment to their calendar.',
        title: 'Assigned to the teacher',
      },
      updateCoach: 'Choose a new teacher for this appointment',
      isCancelledDate: 'Cancelled on {{-date}} at {{time}}.',
      restore: 'Restore the appointment',
      bookings: 'Appointments',
      notRefunded: 'Not refunded',
      isRefunded: 'Refunded',
      isUnpaid: 'Outstanding payment',
      bookingIsUnpaid: 'Unpaid booking',
      isCancelledByManagerDate:
        'Cancelled on {{-date}} at {{time}} by {{cancelled_by}}',
      isCancelledByManager: 'Cancelled by {{cancelled_by}}',
    },
    privateService: {
      delete: {
        title: 'Delete appointment',
        explain:
          "Are you sure that you want to delete this appointment? Past booking won't be affected. This action can't be undone.",
        cancel: 'Cancel',
        submit: 'Delete',
        confirm: 'Delete',
      },
      padBeforeBooking: {
        explain2:
          'For example, for an appointment that has been booked at 13:00 which lasts an hour, there will be a time buffer of 5 minutes both before and after the appointment.',
        explain4:
          'If left unactivated, the next appointment can be booked from 14:05 (5 minutes after the end of the previous appointment). In this case, time buffers can overlap.',
        explain3:
          'If activated, the following appointment can be booked from 14:10 (5 minutes after the end of the first appointment and 5 minutes before the start of the next one). Time buffers cannot overlap.',
        explain1:
          'Once activated, the time buffers between first and second appointments will not overlap. This means there will be a larger time gap between the two appointments as two time buffers are taken into account.',
      },
      ineligibleService: {
        title: 'You cannot book this appointment',
        description:
          'This appointment is only for a specific group of members.',
        backToAppointments: 'Back to the appointments',
      },
    },
    calendar: {
      enableAvailability: 'Add availability',
      disableAvailability: 'Remove availability',
      enableRecurrentAvailability: 'Add recurrent availability',
      disableRecurrentAvailability: 'Remove recurrent availability',
      selectCoachToModifyAvailability: 'Select a teacher',
      addBooking: 'Book an appointment',
      toogle: {
        showOfferList: 'Group activities & Workshops',
        showPrivateBookings: 'Appointments',
        showCustomEvents: 'Tasks / Personal appointments',
        hideCancelledEvents: 'Show cancellations',
        title: 'Filter by activity',
      },
      form: {
        title: { enable: 'Add availability', disable: 'Cancel availability' },
        explain: 'Add until:',
        interval: {
          explain1: 'Availability: ',
          explain2: 'Every {{ day }} from {{ date_start }} to {{ date_end }}',
        },
        actions: { cancel: 'Cancel', submit: 'Save' },
      },
      header: { threeDaysView: '3 Days', dateSelector: 'Date picker' },
      createCustomEvent: 'Add a task / personal appointment',
      customEvent: { dateEnd: 'End date', dateStart: 'Start date' },
      showAvailabilityDetails: 'Availability details',
    },
    selector: {
      privateService: 'Select an appointment',
      privateSlot: 'Session',
      session: 'Select your session type',
      coachPlaceholder: 'All teachers',
      establishmentPlaceholder: 'All establishments',
    },
    slotSearcher: {
      title: 'Appointment',
      searchSlot: 'Slot',
      selectPrivateSlot: 'Session',
      search: 'Slot',
      selectCoach: 'All teachers',
      emptyDateList: "There's no availability to display for today.",
      bookableSlots: { title: 'Available slots', isEmpty: 'No availability' },
      groupIdentifier: {
        evening: { interval: 'After 6 PM', label: 'Evening' },
        afternoon: { interval: '2 PM - 6 PM', label: 'Afternoon' },
        noon: { interval: '12 PM - 2 PM', label: 'Noon' },
        morning: { interval: 'Before 12 PM', label: 'Morning' },
      },
      nbSlot: '{{ nbSlot }} slot',
      nbSlot_plural: '{{ nbSlot }} slots',
      establishment: 'Establishment',
      coach: 'Teacher',
      selectService: 'Choose a service',
      selectSession: 'Slot',
      emptyState: "There's no availability to display at this moment.",
      previousOffer: 'Available session: {{- date }} at {{ hour }}',
      nextOffer: 'First availability: {{- date }} at {{ hour }}',
      searchFirstSlot: 'Search the first available moment',
      pickASlot: 'Select your available time',
    },
    slot: {
      parameters: { credit: '{{ credit }} credit(s)' },
      form: {
        title: 'Session',
        name: {
          label: 'Name of the session',
          placeholder: 'Double session (120 min.)',
        },
        people_capacity_used: {
          label: 'Number of people',
          helperText:
            'This number will be used to manage the availability of the establishment(s).',
        },
        credit: {
          label: 'Credit(s)',
          helperText:
            'Select the number of required credits to book an appointment.',
          decimalCredit: {
            helperText: 'This session will cost {{count}} credit',
            helperText_plural: 'This session will cost {{count}} credits',
          },
        },
        duration_minutes: {
          label: 'Duration',
          helperText:
            'Configure the amount of required credits to the duration of the session.',
        },
        cancel: 'Cancel',
        submit: 'Save',
        booking_interval_minutes: {
          helperText:
            '(Recommended) Example: by inserting 15, it means that members can book for 12:00, 12:15. 12:50, etc.',
          label: 'Advanced: booking interval',
        },
        pre_selected_choices: 'Predefined durations',
        durationError: 'The duration must be between 10 min. and 1 day',
        error: {
          peopleCapacityUsed:
            'To add more than one person, disallow ClassPass bookings.',
          bookingInterval:
            'Add an interval allowed by ClassPass: 5, 10, 15, 30, or 60 minutes.',
        },
      },
    },
    bookerModule: {
      address: {
        label: 'Address',
        helperText: 'Enter your address to book this appointment.',
        submit: 'Confirm',
      },
      availableSlots: 'Available slots',
      emptySlot: 'There are no available slots',
      missingResource: {
        service: 'Select an appointment to see the availability.',
        coach: 'Select a teacher',
        establishment: 'Select an establishment',
      },
      cancel: 'Cancel',
      title: 'Book an appointment',
      error: 'Unable to book on this date',
      searchSlot: 'Slot',
      noPrivateServiceAvailable: 'There are no appointments to display.',
      isAtHome: 'An address is required for this appointment.',
      bookingCapabilities: {
        compatibleConsumerPassTitle: 'My passes',
        emptyConsumerPassList:
          'Please purchase a valid pass to complete the booking.',
        compatiblePassTitle: 'Compatible passes',
        emptyPassList:
          'There are no compatible passes to display. Please contact the studio directly.',
      },
      useCredit: 'Book',
      private_pass: { credits: '{{ credits }} credit(s)' },
      buyPass: '{{ price, price }}',
      preview: { credit_cost: '{{credit_cost}} credit(s)' },
      sections: {
        establishment: 'Establishment',
        privateSlot: 'Sessions',
        coach: 'Teacher',
      },
      step: {
        configuration: 'My appointments',
        billing: 'Billing',
        privateService: 'Appointments',
        privateSlot: 'Session',
        coach: 'Teacher',
        date: 'Date',
        rule: 'Recurring appointments',
      },
      notifyMember: { label: 'Send a confirmation email' },
      recurrenceRule: { label: 'Schedule a recurring appointment' },
      confirm: 'Confirm',
      unpaidBooking: {
        book: 'Book',
        helper:
          'Complete the booking and purchase an appointment pass at a later stage.',
        header: 'Pay later',
        dialogHelper:
          "Use this option to complete a booking without any direct payment involved. The required {{ credits }} credit(s) will be automatically deducted from an appointment pass that'll purchased at a future date.",
        isUnpaid: 'Outstanding payment',
      },
    },
    consumerPass: {
      current_credits: '{{ current_credits }} / {{credits}} credit(s)',
      isReverted: 'Cancelled invoice',
      detail: {
        invoice: 'Associated invoice',
        booking: 'Associated appointments',
        extensionsTitle: 'Validity extension',
      },
      expiresOn: 'Expiration date: {{date}}',
      actions: { addExtension: 'Extend validity' },
      extension: {
        create: {
          nbDays: { label: 'Number of extra days' },
          note: { label: 'Notes' },
          warning:
            'Attention! Check if the new date is in the same fiscal year as the old date. If not, please consult your accountant if this will be processed correctly.',
          explain: { newDate: 'New: ', oldDate: 'Original: ' },
          submit: 'Add',
          cancel: 'Cancel',
          title: '[Form] Extend validity',
          datePicker: { label: 'New date' },
        },
        delete: {
          confirm: 'Confirm',
          cancel: 'Cancel',
          explain:
            'Are you sure that you want to delete the extension of this validity?',
          title: 'Delete the extension of the validity',
        },
        addedOn: 'Added on: ',
        options: {
          selectNewEndDate: 'Set a new end of validity date',
          addNumberOfDays: 'Extend the validity by adding a number of days',
        },
      },
      isFromDisabledShare: 'Sharing has been disabled',
      isOwnerOfShares: 'Shared (Master Appointment Pass)',
      isFromShare: 'This pass is shared with another account.',
      isFromShareTooltip:
        'This appointment pass is shared from another franchise studio',
      warningShareUniversal:
        'Please share the associated pass instead of the universal pass',
    },
    privateServiceCompatibility: {
      delete: {
        title: 'Compatible appointments after modification:',
        explain:
          'Are you sure that you want to change the usage rules of this pass? This change will affect all purchases.',
        cancel: 'Cancel',
        submit: 'Delete',
      },
      excludedSlots: {
        helperText:
          'Select the compatible appointments of the appointment pass.',
        cancel: 'Cancel',
        submit: 'Save',
        title: 'Sessions: {{ service }}',
        isEmpty: 'There are no sessions to display for this appointment.',
      },
      forSlots: 'Compatible sessions:',
      allSlots: 'Compatible with all sessions',
      none: ' None',
    },
    privatePass: {
      noNotificationsWarning:
        'You have no notifications set up yet. To create new notifications, please go to <strong>Marketing > Notifications.</strong>',
      delete: {
        title: 'Delete pass',
        explain:
          'Are you sure that you want to delete this pass? Members with valid passes and credits will still be able to use them.',
        cancel: 'Cancel',
        submit: 'Confirm',
        delete: 'Delete',
        warning:
          "Attention! Deleting this appointment pass will also make it unavailable for purchase for the packs it's used for.",
      },
      list: {
        createButton: 'Add appointment pass',
        isEmpty: 'There are no appointment passes to display.',
        availableCustomer: 'Available appointment passes',
        managerOnly: 'Unavailable appointment passes',
      },
      parameters: {
        nbCredits: '{{ credits }} credit',
        nbCredits_plural: '{{ credits }} credits',
        price: '{{ price, price}}',
        tax: 'VAT / Sales Tax: {{ tax }}%',
        managerOnly: 'Unavailable for purchase',
        unusableByStaff: 'Invisible for the staff',
      },
      compatibleServices: {
        title: 'Compatible appointments',
        add: 'Add',
        isEmpty: 'Key information missing',
        unusable:
          'This appointment pass is not currrently compatible for any appointment because some key information is missing. Fill in the required fields and try again.   ',
      },
      form: {
        detailsAndRestrictions: 'Details and restrictions',
        notification: 'Notifications',
        title: 'Add an appointment pass',
        managerOnly: { label: 'Unavailable for purchase' },
        name: { label: 'Name', helperText: 'Name of the appointment pass' },
        credits: {
          label: 'Number of credits',
          helperText: 'Choose the number of credits included in this pass',
          decimalCredit: {
            helperText: 'This pass will contain {{count}} credit.',
            helperText_plural: 'This pass will contain {{count}} credits.',
          },
        },
        price: {
          label: 'Price (including VAT/Sales Tax) * ',
          helperText: 'The total selling price of the pass.',
        },
        tax: { label: 'VAT/Sales tax *' },
        actions: {
          submit: 'Save',
          cancel: 'Cancel',
          back: 'Back',
          next: 'Next',
        },
        available_payment_method_identifiers: {
          helperText:
            'Choose at least one payment method. If none are selected, online payments will be chosen by default.',
          label: 'Accepted payment methods',
          warning:
            'Accepted payment methods can be assigned, once the appointment pass has been made available to members.',
        },
        durationYears: {
          helperText: 'Will be added to the number of days and months.',
          label: 'Years',
        },
        durationMonths: {
          helperText: 'Will be added to the number of days.',
          label: 'Months',
        },
        durationDays: {
          label: 'Days',
        },
        full_vod_access: { label: 'Activate access to Video On Demand' },
        expirationDaysBeforeFirstUse: {
          helperText:
            'The appointment pass will automatically expire if no booking has been made in X amount of days.',
          label: 'Automatic expiration date:',
        },
        start_date_method: {
          on_attendance: 'Valid from the 1st attendance',
          on_booking: 'Valid from the 1st booking',
          on_purchase: 'Valid from the billing date',
        },
        new_member_only: { label: 'Only visible to new members' },
        start_date_method_detail: {
          on_purchase: ' from the date of purchase',
          on_attendance: ' from the 1st attendance',
          on_booking: ' from the 1st booking',
        },
        duration: {
          daysMonths:
            '{{ duration_months }} month(s) and {{ duration_days }} year(s)',
          and: ' and ',
          years: '{{ count }} year',
          years_plural: '{{ count }} years',
          months: '{{ count }} month(s)',
          days: 'Day',
          days_plural: 'Days',
          valid: 'Valid for ',
          fullText: 'This appointment pass will be valid for ',
        },
        startDate: 'Start date',
        category: 'Category name',
        categoryTitle: {
          compatibility: 'Compatible appointments',
          validity: 'Validity',
          paymentMeans: 'Payment method',
          info: 'General',
          compatibilityAppointment: 'Compatibility for appointments',
        },
        selector: { privateService: 'Add compatible appointments' },
        franchise:
          "The appointment pass is shared through the Master Account. Certain settings have been predefined by said Master Account and can't be modified.",
        universalPass: {
          deativatedTags: 'Deactivate for universal passes',
          helperText:
            "Universal passes can be used by members to book both group activities and appointments. Every time a universal pass is purchased, we'll automatically add a 'twin' appointment pass to share the credits between the two pass types.",
          label: 'Universal pass',
          warningIsUniversalPass:
            'Twin passes are automatically created for a universal pass. All fields modified here will also be edited on the twin passes, except the categories. This also applies to notifications, validity extensions, and credit changes.',
        },
        onBehalfOfTeacher: {
          helperText:
            "Select this setting to ensure that the income associated with appointments on this pass will be paid in full to the teacher. You can view this information in the 'Payment paid entirely to the teacher' column in your purchase reports. ",
          label: 'Full payment to the teacher',
        },
        appliesForPayroll: {
          helperText:
            "Classes are billed to the studio and included in the teacher's payroll by default. Deactivate this setting to ensure classes associated with this pass will no longer appear in teachers' payrolls.",
          label:
            "Classes bought with this pass are included in teacher's payroll",
        },
        expiration_date: {
          helperText: 'Available until',
          label: 'Duration of sale',
          tooltip:
            'After the chosen date, the pass will be unavailable for purchase',
        },
        description: { label: 'Description' },
        advancedOptions: {
          header: 'Advanced',
          tag: {
            tagsOnAcquisition: 'Apply tags after purchase',
            tagsOnAcquisitionHelper:
              'Tag members who have bought this pass to quickly identify them in the future.',
            selectTags: 'Select tags',
          },
        },
        notEditable:
          'This appointment pass originates from a previously completed data migration. Some fields may not be editable to preserve the data.',
      },
      validForDuration: {
        general:
          'This appointment pass is valid for {{ duration_days }} day(s), {{ duration_months }} month(s), and {{ duration_years }} year(s).',
        years: 'Valid for {{ duration_years }} year(s)',
        months: 'Valid for {{ duration_months }} month(s)',
        days: 'Valid for {{ duration_days }} day(s)',
      },
      edit: 'Edit',
      disabledTitle: 'Archived appointment passes',
      detailTitles: {
        paymentMeans: 'Payment method',
        privateServiceCompatibility: 'Compatible appointments',
        vod: 'Video On Demand',
        accessibility: 'Accessibility',
        validity: 'Validity',
        credit_quantity: 'Credits',
      },
      ht: 'Excl. VAT / Sales Tax',
      actions: { forceRegularizeUnpaid: 'Regularise all outstanding payments' },
      listItem: { unusableByStaff: 'Hidden to staff' },
    },
    service: {
      selector: {
        placeholder: 'Select an appointment',
        isEmpty: 'There is no appointment category to be displayed.',
        coach: { label: 'Teacher' },
        establishment: { label: 'Establishment' },
      },
      detail: { tab: { general: 'General', calendar: 'Schedule' } },
      configuration: {
        slot: 'Sessions',
        explainSetToHasNotOwnAvailabilitySlots:
          'The availabilities of all correctly configured teachers and establishments are automatically managed.',
        explainSetToHasOwnAvailabilitySlots:
          'Can only be booked in certain time slots',
        explainHasOwnAvailabilitySlots:
          'Click on the pencil to limit the reservations to certain time slots',
        hasFutureSlot: 'The availabilities have been set up correctly.',
        noCapacity: "This establishment doesn't have a maximum capacity.",
        totalCapacity: 'Maximum capacity: {{ capacity}} member(s)',
        noFutureSlot:
          "Click here to correctly configure {{resourceName}}'s availability.",
        title: 'Availability',
        isAlwaysAvailable:
          '{{resourceName}} can be booked, once the establishment(s) and/or teacher(s) are available.',
        changeIsAlwaysAvailable: 'Edit',
        partnership: {
          anySlotNotCompatible:
            'Update the session settings to ensure each has a booking interval and capacity compatible with ClassPass.',
          removeAvailabilities:
            'To display appointments correctly on ClassPass, you must disable specific availabilities.',
        },
      },
      form: {
        editConfirmation: {
          title: 'ClassPass integration issue',
          content:
            "When ClassPass is activated, specific appointment slots will be disabled. Only the teacher's and establishment's availability will be considered.",
          alert: 'Click confirm to disable the availability option.',
          cancel: 'Do it later',
          confirm: 'Confirm',
        },
        establishmentResourceType: {
          isHomeService: {
            label: 'At home',
            helperText:
              "We'll ask members for an address once the appointment is booked. ",
          },
          isWithoutEstablishment: {
            label: 'Outside of establishment(s)',
            helperText: 'For your outdoor activities, livestreams, etc.',
          },
          isWithEstablishment: {
            isEmpty: 'No establishment has been configured.',
            label: 'In one or more of your establishments',
            helperText:
              'Booking will only be made if there are enough available slots. ',
          },
        },
        resourceGroup: { establishment: 'Location', coach: 'Teacher' },
        coach_consumer_attribution: {
          label: 'Allow members to choose their teacher',
          helperText:
            "Members will be able to choose their teacher when they book. If left unchecked, you'll need to assign a teacher once the appointment has been booked.",
        },
        establishment_consumer_attribution: {
          label: 'Allow members to choose the establishment',
          helperText:
            'Members will be able to decide which establishment they want to book. Uncheck to automatically fill establishments.',
        },
        delete: {
          title: 'Delete appointment',
          content:
            'Are you sure that you want to delete this type of appointment?',
          cancel: 'Cancel',
          confirm: 'Delete',
        },
        coach_capacity_used: {
          label:
            'The maximum amount of appointments an teacher can attend simultaneously is:',
          helperText:
            'For example, a teacher can monitor two students at the same time.',
          alertText:
            'A teacher can manage 1, 2, 3, 4, 6 or 12 appointments simultaneously.',
        },
        color: 'Color code',
        use_full_establishment_capacity: {
          label: 'Members can choose the establishment',
          helperText:
            'The entire space is needed for the appointment. Uncheck to allow multiple appointments in the same establishment.',
        },
        title: 'Appointments',
        createButton: 'Add appointment',
        addCoach: 'Add a teacher',
        addEstablishment: 'Add an establishment',
        addSlot: 'Add a session',
        is_home_service: {
          label: 'At home',
          helperText: 'An address will be requested for every booking.',
        },
        is_without_coach: "Don't assign any teacher to this appointment",
        name: { label: 'Appointment name', placeholder: 'e.g. massage' },
        coach: {
          label: 'Teacher',
          isEmpty: 'There are no teachers to display.',
        },
        establishment: { label: 'Establishment' },
        description: { label: 'Description' },
        actions: { cancel: 'Cancel', submit: 'Save' },
        last_discard_minutes: {
          helperText: "Credits won't be refunded for late cancellations.",
          label: 'Choose how long before the class the booking window opens. ',
        },
        coachSelectorTitle: 'Choose the teacher(s) for this appointment.',
        establishmentSelectorTitle:
          'Choose the establishment(s) for this appointment:',
        settingsTitle: 'Conditions',
        managerOnly: { label: 'Hidden on Marketplace' },
        last_booking_minutes: {
          label:
            'Select until when members can book before the start of the appointment',
        },
        paddingEnd: {
          helperText0:
            'The amount of time until the teacher or establishment will be available after the appointment ends.',
          helperText:
            'The teacher(s) and/or the establishment(s) will be shown as unavailable for {{minutes}} after the end of the appointment.',
          label: 'Time buffer (in minutes) after the end of the appointment.',
        },
        paddingStart: {
          helperText0:
            'The amount of time that the teacher or establishment will be unavailable before the appointment starts.',
          helperText:
            'The teacher(s) and/or the establishment(s) will be shown as unavailable {{minutes}} before the start of the appointment.',
          label:
            'Time buffer (in minutes) before the start of the appointment.',
        },
        paddingTitle: 'Availability',
        unpaidBooking: {
          title: 'Pay later',
          tag: {
            helper:
              "Use Tags to make this appointment available only to certain segments of your member base. Members tagged as 'Authorized' are able to pay later, while those tagged as 'Unauthorized' won't be able to.",
            header: 'Tags',
            allowed: 'Authorized',
            notAllowed: 'Unauthorized',
            doNotSelectToAllowAllMembers:
              "Leave this field empty to allow all members to 'pay later'.",
          },
          label: "Enable 'pay later' for members",
          helperText:
            "Allow members to complete bookings without taking a payment right away. Credits will automatically be deducted from customers' future appointment passes.",
        },
        pad_before_booking: {
          label: 'Avoid overlapping time buffers between appointments',
        },
        advancedOptions: {
          header: 'Advanced',
          tag: {
            header: 'Tags',
            helperText:
              'Use tags to make this appointment available only to certain segments of your customer base.',
            allowed: 'Authorized',
            doNotSelectToAllowAllMembers:
              'Leave this field empty to authorize all members.',
            notAllowed: 'Unauthorized',
          },
        },
        tooltip: {
          noTeacher:
            'Must assign a teacher when ClassPass bookings are allowed.',
          oneBookingPerTeacher:
            'Can only add one booking per teacher while ClassPass bookings are allowed.',
        },
        validation: {
          oneOption: 'Select at least one option.',
          coachCapacityUsed:
            'To add more than one appointment at the same time for a teacher, disallow ClassPass bookings.',
          availabilityBuffers:
            'To add buffers to this booking, disallow ClassPass bookings.',
          zeroValueError: 'You must schedule one appointment',
        },
        availableOnPartnership: {
          label: 'Available on ClassPass',
          alert:
            'To display this booking correctly on ClassPass, some settings need to be configured. We have automatically updated some fields. Please review and fill in the required details below.',
          buffersAlert:
            'To add buffers to this booking, disallow ClassPass bookings.',
          tagsAlert: 'Not applicable for ClassPass bookings.',
        },
      },
      parameters: {
        description: 'Description',
        coaches: { title: 'Teacher', is_empty: 'Teachers are optional.' },
        noTags: 'There are no authorized tags to display.',
        whitelistTags: {
          title: 'Approved Tags',
        },
        blacklistTags: {
          title: 'Refused Tags',
        },
        establishments: {
          title: 'Establishment',
          is_empty: 'No establishment is available.',
          is_home_service: 'At home',
        },
        slots: {
          title: 'Session',
          isEmpty: 'Start by adding a session.',
          explainIsEmpty:
            'Configure your appointments (e.g. name, duration, cost, etc.).',
        },
        last_discard_minutes: {
          explain:
            'Cancellations will be refunded up to {{ days }} day(s), {{ hours }} hours(s), and {{ minutes }} minute(s) before the start of the appointment.',
        },
        last_booking_minutes: {
          explain:
            'Members can book up to {{days}} day(s), {{hours}} hour(s), and {{ minutes }} minute(s) before the start of the appointment.',
        },
      },
      navigation: { goToPrivatePass: 'Appointment passes' },
    },
    privateEstablishment: {
      delete: {
        submit: 'Confirm',
        cancel: 'Cancel',
        explain:
          "Are you sure that you want to change the establishment of this appointment? Without any establishments, this'll be considered as an at home appointment and members will be asked to share their address to complete their booking. Past bookings won't be affected.",
        title: 'Remove the establishment',
      },
    },
    privateCoach: {
      delete: {
        submit: 'Confirm',
        cancel: 'Cancel',
        explain:
          "Are you sure that you want to unsubscribe this teacher? They won't be able to get booked in for appointments, but current appointments won't be affected.",
        title: 'Unsubscribe the teacher',
      },
    },
    openCalendar: 'Show the calendar',
    noPrivateService:
      'An appointment is a private lesson with a teacher. Add an appointment to set its duration, as well as other conditions for your members.',
    noPrivatePass:
      "Members can use appointment passes to book in appointments (e.g. personal training, duos, room rental, massages, etc.). Reminder: don't forget to correctly set up the compatibility of all your appointment passes.",
    customEvent: {
      form: {
        actions: { submit: 'Save', cancel: 'Cancel' },
        description: {
          placeholder: 'Ask for Mr Smith at 1 Oxford Street.',
          label: 'Description',
        },
        coach: { isEmpty: 'No teacher has been assigned.' },
        color: 'Color code',
        name: { placeholder: 'Dentist appointment', label: 'Name' },
        title: 'Personal appointment',
      },
      actions: { delete: 'Delete' },
    },
    noPrivateConsumerPass:
      'There are no members with this appointment pass to display.',
    filters: {
      hasCreditNull: 'Without credit',
      hasCreditLeft: 'With credit',
      isActive: 'Active',
      isExpired: 'Expired',
      invoice: 'Invoice',
      reverted: 'Cancelled invoice',
      notReverted: 'Non-cancelled invoice',
      credits: 'Credit(s)',
      expiration: 'Validity',
      all: 'All passes',
      empty: 'All appointment passes',
      isValidToday: 'Valid',
    },
    recurrenceRule: {
      item: {
        explain:
          'Every {{dayOfWeek}} at {{time}} - {{delayWeek}} week(s) before',
        startFrom: 'From: {{ date }}',
        allowUnpaid: 'Authorizes unpaid reservations',
      },
      forms: {
        update: {
          confirm: 'Edit',
          cancel: 'Cancel',
          content:
            "Editing this recurring appointment will affect all future appointments that've been made with this rule",
          title: 'Edit recurring appointment',
        },
        delete: {
          confirm: 'Delete',
          cancel: 'Cancel',
          content:
            "Deleting recurring appointments will result in the cancellation of future appointments that've been made via this rule.",
          title: 'Delete a recurring appointment',
          content_with_cancellation_option:
            'This recurring booking rule will be deleted. Do you also want to cancel any future bookings made with this rule?',
          cancelRelatedBookings:
            'Cancel any future bookings made with the rule',
        },
      },
      form: {
        notify_member: 'Send a confirmation email',
        timeGroup: 'Date of the session',
        configuration: 'Bookings',
        title: '[Form] Recurring appointment',
        override_availabilities:
          'Complete the booking even though the appointment, the establishment or the teacher is unavailable',
        allow_unpaid:
          'Authorize unpaid reservations (no compatible card owned)',
      },
      actions: { save: 'Save', close: 'Close' },
      createModal: { create: 'Add a recurrent appointment' },
      recurrentBookings: 'Recurring appointments',
    },
    privateBookingNotification: {
      tooltip: 'There are active notifications for this appointment.',
      listItemPrimary: {
        notifyAllEvents: {
          cancelledNotRefunded: 'For each late cancellation',
          cancelledRefunded: 'For each refunded cancellation',
          valid: 'For each appointment',
        },
        cancelledRefunded:
          'Number of refunded cancellations: {{notify_booking_nb}}',
        cancelledNotRefunded:
          'Number of late cancellations: {{notify_booking_nb}}',
        valid: 'Booking number: {{notify_booking_nb}}',
        after:
          'Send this notification {{hours}}h after the end of the appointment.',
        before:
          'Send this notification {{hours}}h before the start of the appointment.',
      },
      form: {
        next: 'Next',
        chooseTime: {
          second: {
            after: 'hour(s) after the end of the session',
            before: 'hour(s) before the start of the session.',
          },
          first: 'Send this notification',
          title: 'Settings',
        },
        chooseWhen: {
          title: 'Event',
          afterNotification:
            'Send the push notification before the start of the appointment',
          afterNotifications:
            'Send notifications after the end of the appointment',
          afterMail: 'Send this notification after the end of the appointment',
          beforeNotification:
            'Send the push notification before the start of the appointment',
          beforeNotifications:
            'Send notifications before the start of the appointment',
          beforeMail: 'Send this email before the start of the session',
        },
        help: {
          cancelledNotRefunded: {
            notifyAll:
              'Members will receive this notification every time they cancel too late for this appointment.',
            default:
              "Members will receive this notification, once they've cancelled this appointment {{notifyNb}} times too late.",
          },
          cancelledRefunded: {
            notifyAll:
              'Members receive this notification every time their cancellation for this appointment gets refunded.',
            default:
              'Members receive this notification, once they have {{notifyNb}} refunded cancellations for this appointment.',
          },
          valid: {
            notifyAll:
              'Members receive this notification every time they book this appointment.',
            default:
              'Members receive this notification once they booked {{notifyNb}} valid appointments.',
          },
        },
        notifyAllEvents: 'Send this notification to every booking',
        notifyNb: 'Send a notification for booking number:',
        chooseKind: {
          cancelledNotRefunded: 'Late cancellations',
          cancelledRefunded: 'Cancelled and refunded bookings',
          valid: 'Maintained bookings',
          title: 'Event',
        },
        intro:
          'You can automatically send notifications before and/or after your appointments (e.g. for bookings, cancellations, etc.)',
        title: 'Add a notification',
        ifKind: {
          notRefunded: 'When the appointment has been cancelled too late',
          refunded: 'When the appointment has been cancelled on time',
          valid: 'Valid appointments',
        },
        subtitle: 'Appointment pass',
      },
    },
    marketplace: { isEmpty: 'There are no appointments to display.' },
    search: 'Search an appointment',
    popup: {
      begin: 'Start time',
      end: 'End time',
      button: 'Schedule',
      validate: 'Save',
    },
    searshAppointmentPass: 'Search an appointment pass',
    categoryTitle: 'Categories of appointment passes',
    disabledPacksTitle: 'Archived appointment passes',
    notification: {
      addButton: 'Add a notification',
      listItem: {
        mail: 'Email ',
        deleteModal: {
          title: 'Delete a notification',
          cancel: 'Cancel',
          confirm: 'Delete',
          content:
            "Are you sure that you want to delete this notification? This action can't be undone.",
        },
        smartList: 'Excluded Smartlist(s)',
        smartListInclude: 'Included Smartlist(s)',
      },
    },
    privatePassTemplateInstance: {
      deleteForm: {
        content:
          'If you stop sharing with this studio, appointment passes purchased at that studio will still be valid, but only within that specific studio. Appointment passes from other studios will no longer be valid there. This also applies to linked subscriptions.',
        actions: { submit: 'Stop sharing', close: 'Close' },
        title: 'Stop sharing with a studio',
      },
      form: {
        explain2:
          'Members who have purchased this appointment pass or a linked subscription will be able to use it at any of the newly compatible studios.',
        actions: { submit: 'Save', close: 'Close' },
        explain1:
          "The following studios will automatically offer this appointment pass, but won't be able to change its price or credit number.",
        title: 'Availability',
      },
      privateConsumerPassSharedFromOtherFranchisee: 'Shared from a franchisee',
      actions: { addCompany: 'Add a studio' },
      companyEmpty: 'There are no studios offering this pass to display.',
      privatePassSharedFromFranchisor: 'Master Account Pass',
    },
    privatePassTemplate: {
      actions: { create: 'Add a shared pass' },
      deleteForm: {
        actions: { submit: 'Archive', close: 'Close' },
        content:
          'Members will still be able to use the appointment pass at the studio where they bought it. Any subscription linked to this appointment pass will remain valid at that same studio.',
        title: 'Archive shared appointment pass',
      },
      restoreForm: {
        actions: { submit: 'Restore', close: 'Close' },
        content:
          'The shared appointment pass will be restored and shared again among the studios previously selected.',
        title: 'Restore shared appointment pass',
      },
      form: {
        actions: { submit: 'Save', close: 'Close' },
        submit: 'Confirm',
        close: 'Close',
        title: '[Form] Shared appointment pass',
        editConfirmation: {
          title: 'Edit confirmation',
          content:
            'Your changes will also be applied to subscriptions linked to this shared appointment pass. Are you sure you want to proceed and save your edits?',
          cancel: 'Cancel',
          confirm: 'Save anyway',
        },
      },
      section: {
        titleManagerOnly: 'Not available for purchase',
        titleAvailable: 'Available for purchase',
        titleArchived: 'Archived passes',
      },
      isEmptyExplain:
        'Members can purchase and use this pass at any of the associated studios.',
      specification: {
        companySharedWithTitle: 'Shared with the following studios:',
      },
    },
    seeAll: 'Show all',
    universalPass: {
      delete: {
        dialog: {
          warningText:
            'Attention! Deleting a universal pass will also delete its twin passes.',
          title: 'Delete',
        },
      },
    },
    specificAvailabilitiesCalendar: {
      establishment: 'Establishment',
      filters: 'Filters',
      infoBoxContent:
        "You are in the availability mode specific to an establishment. By default your teachers are available in all establishments when you create an availability. On this page you can define specific availabilities for certain establishments to make your teacher available only in these establishments. It is necessary to create a general availability on your teacher's schedule to create a specific availability.",
      goToRegularCalendar: 'Back to the schedule',
    },
    openSpecificAvailabilitiesCalendar: 'Specific availabilities',
    forms: {
      delete: {
        confirm: 'Delete',
        cancel: 'Cancel',
        actions: { confirm: 'Delete', cancel: 'Cancel' },
        title: 'Delete appointment',
        content: {
          canDelete:
            'Are you sure you want to delete this appointment? This change is definitive. Bookings already made will not be affected.',
        },
      },
    },
  };
};

exports.default = getTranslations();
