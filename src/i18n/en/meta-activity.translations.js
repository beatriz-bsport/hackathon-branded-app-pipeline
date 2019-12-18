export default {
  metaActivity: 'Activity',
  search: 'Search an activity',
  forms: {
    create: {
      compatible_packs: {
        seeMore: 'See more',
        createPass: 'Create a pass',
        goToActivity: 'Go to activity',
        passHelperText: 'These passes are available for the created activity:',
        noCompatiblePass:
          'No pass available for this activity, remind to create one',
      },
      steps: {
        activity_form: 'Activity creation',
        pass_form: 'Pass creation (optionnal)',
        pass_list: 'Finalization',

        offer_form: 'Session creation (optionnal)',
        workshop_form: 'Workshop creation',
      },
    },
  },
  detail: {
    pack: {
      noCompatiblePass: 'No Compatible pass',
      consumerPacks: 'Members passes',
      paymentPacks: 'Compatible passes',
    },
    tab: {
      general: 'General',
      pack: 'Passes',
    },
  },
  name: 'Name',
  category: 'Sport',
  addOffers: 'Add sessions',
  offersThisDay: 'Sessions this day:',
  description: 'Description',
  settings: {
    title: 'Settings',
    lastBookingBeforeMinutes: 'Last booking is possible until',
    lastDiscardBeforeMinutes: 'Last discard booking is possible until',
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
};
