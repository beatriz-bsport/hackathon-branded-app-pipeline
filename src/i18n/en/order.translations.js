export default {
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
};
