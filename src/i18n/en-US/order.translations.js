exports.default = {
  products: {
    nbProducts: 'items',
  },
  state: {
    0: 'On hold',
    700: 'Paid',
    1100: 'Cancelled',
    1200: 'On site delivery',
    9000: 'Sent',
  },
  table: {
    name: 'Buyer',
    state: 'Status',
    updated_at: 'Update at',
    created_at: 'Created at',
    qty: 'Quantity',
  },
  form: {
    delivery: {
      first_name: 'Firstname',
      last_name: 'Lastname',
    },
  },
  actions: {
    flagAsCancelled: 'Cancel',
    flagAsOnSiteDelivery: 'Deliver on-site',
    flagAsSent: 'Sent',
  },
  detail: {
    section: {
      title: 'Order status: ',
      deliveryInfo: 'Delivery address',
      productDetail: 'Product listing',
      invoice: 'Related invoice',
      member: 'Buyer',
    },
  },
  deliveryFee: {
    name: 'Name',
    fee: 'Delivery fee',
    free_threshold: 'Free delivery threshold',
    offeredAboveAmount: 'Offered above {{ free_threshold, price }} order',
    modal: {
      delete: {
        title: 'Delete delivery fee',
        content:
          'Be careful this operation is not revertable. Old orders using this fee will not be modifiedj',
        cancel: 'Cancel',
        confirm: 'Delete',
      },
    },
    forms: {
      create: 'Add a delivery fee',
      title: 'Delivery fee form',
      feeLabel: 'Delivery fee',
      nameLabel: 'Name',
      freeThresholdLabel: 'Free if above',
      freeThresholdHelper:
        'If order price is above this threshold, the delivery fee will offered to the customer',
      onCancel: 'Cancel',
      onSubmit: 'Save',
    },
  },
  configuration: {
    deliveryFee: 'Delivery Fee',
    forms: {
      onSubmit: 'Save',
    },
    noDefaultDeliveryFee: 'No delivery fee',
    defaultDeliveryFee: 'Default delivery fee',
  },
};
