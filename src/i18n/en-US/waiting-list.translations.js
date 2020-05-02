exports.default = {
  switchToEnable: 'Switch waiting-list on',
  switchToDisable: 'Disable waiting list',
  nbPending: '{{ nbPending }} waiting for a slot',
  nbConvertible: '{{ nbConvertible }} pending booking confirmation',
  form: {
    dumb_delay_minutes: {
      label: 'Simple waiting-list',
      helper:
        'If a slot becomes available, the client has N minutes to register before the next one takes his slot.',
    },
    smart_delay_percentage: {
      label: 'Smart waiting-list',
      helper:
        'If a slot becomes available, the client has a time proportional to the time left before the session.',
    },
    submit: 'Submit',
    auto_cancellation_type: {
      title: 'Waiting-list management',
    },
  },
  explainWaitingListConf:
    'e.g: There is 3h left before the session, the client has {{ nbMinutesBeforeBookingOptionExpire }} minutes to register his booking before he goes back to the waiting-list.',
  dialog: {
    delete: {
      title: 'Waiting-list removal',
      content:
        'Are you sure you want to remove this member from the waiting-list ? He will be notified by email',
      cancel: 'Cancel',
      confirm: 'Remove',
    },
  },
};
