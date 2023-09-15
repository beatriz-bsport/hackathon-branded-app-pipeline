exports.default = {
  pageTitle: { list: 'Packs' },
  link: {
    copied: 'Copied',
    copyLink: 'Copy the direct link to the payment page',
  },
  list: {
    section: {
      unavailableOnline: 'Unavailable packs',
      availableOnline: 'Available packs',
    },
    explainIfEmpty:
      'In this module, you can manage all your packs. In packs, you can combine of products from your webshop, passes, and/or appointment passes.',
    buttons: { add: 'Add a pack' },
  },
  form: {
    title: '[Form] Pack',
    name: { label: 'Name' },
    description: { label: 'Description' },
    price: { label: 'Price' },
    tax: { label: 'VAT / Sales tax' },
    manager_only: { label: 'Unavailable for purchase' },
    actions: { submit: 'Save', cancel: 'Cancel' },
    content: 'Content',
    selectorPlaceholder: {
      privatePass: 'Appointment passes',
      paymentPack: 'Passes',
      shopitem: 'Webshop',
    },
    available_payment_method_identifiers: {
      helperText:
        'Select at least one payment method. If none is selected, a card payment will be offered by default.',
      label: 'Accepted payment methods',
    },
    new_member_only: { label: 'Only available for new members' },
    maxPurchasePerMember: {
      helperText: 'Leave this field blank to not impose any limits.',
      label: 'Maximum number of purchases per member',
    },
    usePaymentComboTaxOnItems: {
      label: 'Apply a general VAT / Sales Tax rate on this pack',
      helperText:
        'By default, a unique VAT / Sales Tax rate will be applied per product. Activate this option to apply a general VAT / Sales Tax rate.',
    },
    error: { atLeastOneThing: 'You must add at least one item to your pack' },
    unusableByStaff: { label: 'Invisible for the staff' },
    expiration_date: {
      label: 'Date limit for purchase',
      helperText: 'Available until',
      tooltip:
        'After chosen date, the pack will not be available for sale anymore, for the customers.',
    },
    highlightedAsRecommended: {
      label: 'Mark as recommended',
      helperText:
        'Allows your customers to quickly see which packs are currently recommended.',
    },
  },
  detail: {
    containsNProducts: 'Contains {{ n }} product(s).',
    description: 'Description',
    content: 'Content',
    purchases: 'Purchases',
    emptyContent: "This pack doesn't contain any products to display.",
    itemCount: '{{ count }} item',
    itemCount_plural: '{{ count }} items',
  },
  delete: {
    title: 'Delete pack',
    content:
      "Are you sure that you want to delete this pack? This action can't be undone. Current and previous purchases, as well as active baskets, won't be modified.",
    cancel: 'Cancel',
    submit: 'Delete',
  },
  edit: 'Edit',
  search: 'Search a pack',
  parameters: { unusableByStaff: 'Invisible for the staff' },
};
