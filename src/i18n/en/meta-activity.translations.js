export default {
  metaActivity: 'Activity',
  forms: {
    create: {
      steps: {
        activity_form: 'Activity creation',
        pass_form: 'Pass creation (optionnal)',
        offer_form: 'Session creation (optionnal)',
        workshop_form: 'Workshop creation',
      },
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
