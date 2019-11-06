export default {
  pageTitle: {
    list: 'Packs',
  },
  list: {
    section: {
      unavailableOnline: 'Unavailable for client purchase',
      availableOnline: 'Available for client purchase',
    },
    explainIfEmpty:
      'Create here packs buyable by the students, which may contain pass, shop item, etc...',
    buttons: {
      add: 'Create a pack',
    },
  },
  form: {
    title: 'Pack form',
    name: {
      label: 'Name',
    },
    description: {
      label: 'Description',
    },
    price: {
      label: 'Price',
    },
    tax: {
      label: 'Tax',
    },
    manager_only: {
      label: 'Unavailable for client purchase',
    },
    actions: {
      submit: 'Save',
      cancel: 'Cancel',
    },
    content: 'Content',
    selectorPlaceholder: {
      privatePass: 'Private lesson pass',
      paymentPack: 'Pass collective lesson',
      shopitem: 'Shop',
    },
  },
  detail: {
    containsNProducts: 'Contains {{ n }} products',
    description: 'Description',
    content: 'Content',
    purchases: 'Purchases',
    emptyContent: 'This pack does not contain any object!',
  },
  delete: {
    title: 'Pack deletion',
    content:
      'Are you sure you want to delete this pacjk ? This operation is definitive, current purchases and current baskets will not be modified.',
    cancel: 'Cancel',
    submit: 'Delete',
  },
};
