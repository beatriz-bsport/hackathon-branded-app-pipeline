exports.default = {
  establishment: 'Establishment',
  baseEstablishment: 'Default',
  overrider: 'Substitute',
  establishment_override: 'Substitute establishment',
  search: 'Search an establishment',
  pleaseSelectOne: 'Please select a club in the map to show its details',
  offers: 'Sessions calendar:',
  pleaseFill: 'Please enter an establishment',
  noMoreOffers: 'No more sessions planned',
  addButton: 'Add an establishment',
  update: {
    imageUploaderRequireEditMessage:
      "Once you've added your establishment, you'll be able to add additional images.",
  },
  capacity: {
    label: 'Maximum capacity',
    helperText:
      "This number will only be used to manage this establishment's availability for appointments.",
    explain: 'Capacity: {{capacity}} slot',
    explain_plural: 'Capacity: {{capacity}} slots',
  },
  practical_info: {
    label: 'Access information',
    placeholder: 'Code 1234 first door on the left',
    helperText: 'This information will be displayed after the booking.',
  },
  form: { new: { title: 'Title' } },
  card: { update: 'Update' },
  forms: {
    create: { title: 'New establishment' },
    update: {
      title: 'Update establishment',
    },
    delete: {
      content: {
        cannotDelete:
          "This establishment can't be deleted, because you haven't cancelled and deleted the upcoming sessions that are linked to this establishment.",
        canDelete:
          "Are you sure you that want to delete this establishment? Existing sessions and past bookings won't be modified. This action can't be undone.",
      },
      actions: { confirm: 'Delete', cancel: 'cancel' },
      title: 'Delete an establishment',
    },
    edit: 'Edit',
  },
  detail: { tab: { calendar: 'Schedule', general: 'General' } },
  noEstablishement:
    'Manage here your rooms, their location, their occupancy and consult the calendar',
  notificationToolTip:
    'Some notifications are set for bookings regarding this item',
  list: { section: { archived: 'Archived establishments' } },
  location: {
    country: 'Country',
    zip_code: 'Postal code',
    city: 'City',
    address_line_2: 'Address line 2',
    address_line_1: 'Address line 1',
    address: 'Address',
    search_address: 'Search an address',
    state: 'State',
  },
  spotScheduling: {
    untitled: 'Untitled',
    placeCount: '{{count}} places',
    delete: {
      content:
        "Are you sure you want to delete this Spot Scheduling layout? This action can't be undone.",
      title: 'Delete Spot Scheduling configuration',
    },
    add: 'Add a layout',
    subtitle:
      'Add a custom seating plan to your establishment to allow members book their specific spot for your sessions.',
    title: 'Spot Scheduling',
  },
  localisation: 'Location',
  room: 'Establishment',
  billingGroup: 'Billing group',
  billingGroupRequired: 'Billing group *',
  group: {
    name: ' Name',
    noGroupHelper:
      'Locations allow you to group several addresses together. If you have several studios in different cities, you can group the studios in the same city into one location. On the marketplace, the widget and the personalized application your students will be able to select the location they are most interested in to see only the classes near their home.',
    modal: {
      delete: {
        content:
          'This establishment will no longer appear in the available filters on the marketplace, the widget, and the branded mobile app.',
        cancel: 'Cancel',
        title: 'Delete a location',
        confirm: 'Delete',
      },
    },
    groupButton: 'Group establishments',
    addLocalisation: 'Add a location',
    actions: 'Action',
    form: {
      name: 'Name',
      associated_localizations: 'Associated establishments',
      dialog: { title: 'Location', cancel: 'Cancel', save: 'Save' },
    },
    table: {
      actions: 'Action',
      establishment: 'Establishments',
      name: 'Name',
      address: 'Address',
      noAddress: 'No address is associated with this billing group',
    },
  },
  billing_group: {
    table: {
      name: 'Name',
      establishment: 'Establishments',
      actions: 'Actions',
    },
    modal: {
      delete: {
        confirm: 'Delete',
        cancel: 'Cancel',
        content:
          'Are you sure that you want to delete this billing group? Future invoices will not be able to be linked to this location any more, nor to be selected by the members as their preferred location while performing an online purchase. Before deleting the billing group please make sure that all your establishments are linked to existing billing groups',
        title: 'Delete a billing group',
      },
    },
    form: {
      error: {
        groupShouldContainsOneRoom: 'Please select at least one establishment',
        groupShouldHaveName: 'You must give a name to this billing group',
        groupShouldHaveAddress:
          'You must give an address to this billing group',
      },
      warning: {
        groupHasSeveralLocations:
          'Note that the establishments that you have selected do not have the same address and may not be part of the same location',
      },
      dialog: { save: 'Save', cancel: 'Cancel', title: 'Billing group' },
      associated_localizations: 'Associated establishments',
      name: 'Name',
      address: {
        label: 'Address',
        helperText: 'Enter the address of the billing group.',
      },
    },
    actions: 'Actions',
    name: ' Name',
  },
  description: 'Description',
  favouriteLocation: 'Preferred location',
  notification: {
    modal: {
      content:
        "Are you sure that you want to delete this notification? This action can't be undone.",
      confirm: 'Delete',
      cancel: 'Cancel',
      title: 'Delete notification',
    },
  },
  marketing: { notification: 'Notifications' },
  roomRequiredIsMissing: 'You have not selected a billing establishment.',
  roomRequired: 'Room *',
};
