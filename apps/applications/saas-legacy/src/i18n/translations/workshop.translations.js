exports.default = {
  search: 'Search a workshop',
  modal: {
    delete: {
      title: 'Delete workshop',
      content:
        "Are you sure that you want to delete this workshop? Your bookings and sessions won't be affected. This action can't be undone.",
      cancel: 'Cancel',
      confirm: 'Delete',
    },
  },
  forms: {
    delete: {
      actions: { confirm: 'Delete', cancel: 'Cancel' },
      content: {
        cannotDelete:
          'Upcoming sessions have been planned for this activity. Check if these have all been cancelled and deleted already.',
        canDelete:
          "Are you sure that you want to delete this workshop? Your bookings and sessions won't be affected. This action can't be undone.",
      },
      title: 'Delete workshop',
    },
  },
  navigation: { goToPaymentPack: 'Passes' },
  actions: {
    search: 'Search a workshop',
    addWorkshopActivity: 'Add a workshop',
    addWorkshopGroup: 'Add an event',
  },
  noWorkshops:
    'Workshops are classes that happen as a one-time event. Use the form to add a new Workshop, then set conditions so you can manage how they will display and function to your members.',
  disabledWorkshops: 'Archived workshops',
  tabGroups: 'Grouped sessions',
  tabList: 'Workshops',
  group: {
    emptyState:
      'With session groups your students can book all the sessions included in the group at once. For example, use the session groups to create introductory workshops with several sessions. ',
    emptySearch: 'There are no search results to display.',
    pageSize: 'Display by:',
    backToGroup: 'Back to groups',
    emptySelect: 'Select a workshop or event to display more information.',
  },
};
