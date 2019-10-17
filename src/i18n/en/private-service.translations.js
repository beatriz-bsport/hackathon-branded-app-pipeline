export default {
  pageTitles: {
    passList: 'Pass',
    serviceList: 'Private lessons',
    calendar: 'Schedule',
  },
  payment: {
    address: {
      explain: 'Input your address for your at-home session',
      save: 'Save',
    },
  },
  color: {
    form: {
      title: 'Teacher color code',
      cancel: 'Cancel',
      submit: 'Save',
    },
  },
  privateSlot: {
    delete: {
      title: 'Delete slot',
      explain:
        'Are you sure you want to delete this slot ? Past bookings will not be modified. This operation is not cancellable.',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  privateBooking: {
    cancel: 'Cancel',
    isCancelled: 'Cancelled',
    delete: {
      title: 'Booking cancellation',
      explain:
        'Are you sure you want to cancel this booking ? This operation is not cancellable.',
      explainForceRefund: 'Refund pass credit to allow a new booking.',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  privateService: {
    delete: {
      title: 'Lesson deletion',
      explain:
        'Are you sure you want to delete this lesson ? This modification is not cancellable. Current bookings will not be modified.',
      cancel: 'Cancel',
      submit: 'Delete',
    },
  },
  privateCoach: {
    delete: {
      title: 'Unregister teacher',
      explain:
        'Are you sure you want to unregister this teacher ? He will not be able to book appointment got his lesson. Current bookings will not be modified.',
      cancel: 'Cancel',
      submit: 'Confirm',
    },
  },
  privateEstablishment: {
    delete: {
      title: 'Unregister establishment',
      explain:
        'Are you sure you want to modifyu the location of this lesson ? Without a location it will be considered as "at-home" and members will need to input their address to womplete the booking. Current bookings will not be modified.',
      cancel: 'Cancel',
      submit: 'Confirm',
    },
  },
  privateServiceCompatibility: {
    delete: {
      title: 'Compatible lesson modification',
      explain:
        'Are you sure you want to modify the compatibility rules of the pass ? This modification is retroactive for all bought pass.',
      cancel: 'Cancel',
      submit: 'Delete',
    },
  },
  calendar: {
    enableAvailability: 'Add an availability this day',
    disableAvailability: 'Cancel availability this day',
    enableRecurrentAvailability: 'Add an availability on a recurrent basis',
    disableRecurrentAvailability: 'Cancel availability on a recurrent basis',

    form: {
      title: {
        enable: 'Add an availability',
        disable: 'Cancel an availability',
      },
      explain: 'Modify until :',
      interval: {
        explain1: 'Slot modification: ',
        explain2: '{{ date_start }} - {{ date_end }}, every {{ day }}',
      },
      actions: {
        cancel: 'Cancel',
        submit: 'Save',
      },
    },
  },
  selector: {
    privateService: 'Select your lessons',
    privateSlot: 'Select your slot',
  },
  slotSearcher: {
    title: 'Private lesson registration',
    searchSlot: 'Search for a slot',
    selectPrivateSlot: 'Select a lesson',
    search: 'Look for a slot',
    bookableSlots: {
      title: 'AVailable slots',
      isEmpty: 'No slot available',
    },
  },
  slot: {
    parameters: {
      credit: '{{ credit }} credit',
    },
    form: {
      title: 'Slot',
      name: {
        label: 'Slot name',
        helperText: 'Ex: 1h intense',
      },
      credit: {
        label: 'Credit number',
        helperText: 'Number of credit needed to register a booking',
      },
      duration_minutes: {
        label: 'Duration',
        helperText: 'Adapt needed credit based for e.g on duration',
      },
      cancel: 'Cancel',
      submit: 'Save',
    },
  },
  bookerModule: {
    title: 'Private lesson registration',
    error: 'Impossible to bookin on this date',
    searchSlot: 'Look for a slot',
    noPrivateServiceAvailable: 'No private lesson available',
    isAtHome:
      'At-home lesson, your address will be ask during the booking process',
    bookingCapabilities: {
      compatibleConsumerPassTitle: 'Your compatible pass',
      emptyConsumerPassList: 'You do not own a pass with enough credits',
      compatiblePassTitle: 'Pass compatible with this slot',
      emptyPassList: 'No compatible pass availebl, please contact your club',
    },
    useCredit: 'Book',
    private_pass: {
      credits: '{{ credits }} credit',
    },
    buyPass: '{{ price }}€',
    preview: {
      credit_cost: '{{credit_cost}} credit',
    },
    sections: {
      establishment: 'Location',
      privateSlot: 'Slot',
      coach: 'Teacher',
    },
    step: {
      privateService: 'Lesson',
      privateSlot: 'Slot',
      coach: 'Teacher',
      date: 'Date',
    },
  },
  consumerPass: {
    current_credits: '{{ current_credits }}/{{credits}} credits',
  },
  privatePass: {
    delete: {
      title: 'Pass deletion',
      explain:
        'Are you sure you want to delete this pass ? Previously bought pass with remaining credits will still be usable. This deletion is not cancellable.',
      cancel: 'Cancel',
      submit: 'Confirm',
    },
    list: {
      createButton: 'Create a pass',
    },
    parameters: {
      nbCredits: '{{ credits }} credit',
      price: '{{ price}} €',
      tax: 'Tax: {{ tax }}%',
    },
    compatibleServices: {
      title: 'Compatible lesson',
      add: 'Add',
      isEmpty: 'No lesson compatible - Unusable',
    },
    form: {
      title: 'Private lesson pass',
      name: {
        label: 'Name',
      },
      credits: {
        label: 'Included credits',
        helperText: 'Each slot cost a specific number of credit',
      },
      price: {
        label: 'Price',
      },
      tax: {
        label: 'Tax',
      },
      actions: {
        submit: 'Save',
        cancel: 'Cancel',
      },
    },
  },
  service: {
    form: {
      title: 'Private lesson',
      createButton: 'Add a lesson',
      addCoach: 'Add a teacher',
      addEstablishment: 'Add a location',
      addSlot: 'Add a slot',

      name: {
        label: 'Name',
        placeholder: 'Massage',
      },
      coach: {
        label: 'Teacher',
      },
      establishment: {
        label: 'Location',
      },
      description: {
        label: 'Description',
      },
      actions: {
        cancel: 'Cancel',
        submit: 'Save',
      },
    },
    parameters: {
      description: 'Description',
      coaches: {
        title: 'Teacher',
        isEmpty: 'No teacher, no booking is possible',
      },
      establishments: {
        title: 'Location',
        isEmpty:
          "No location, this lesson will be considered as 'at-home' and the member address will be asked on each booking",
      },
      slots: {
        title: 'Slot',
        isEmpty: 'No slot saved, thus no booking possible',
      },
    },
  },
};
