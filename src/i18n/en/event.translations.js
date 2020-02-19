export default {
  member: {
    register: {
      name: 'New member',
      description: 'Is triggered when a new member is add on bsport',
    },
  },
  booking: {
    register: {
      name: 'New booking',
      description: 'Is triggered when a new booking was made from manager',
    },
  },
  booking_option: {
    cancel: {
      name: 'Booking option canceled',
      description:
        'Is triggered when a booking option is canceled by manager or member',
    },
  },
  noEvent: { description: 'Event source description' },
};
