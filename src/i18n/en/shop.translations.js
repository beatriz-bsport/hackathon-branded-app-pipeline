export default {
  select: {
    placeholder: 'Shop product',
  },
  dialog: {
    delete: {
      title: 'Deletion: {{shopitem.name}}',
      cancel: 'Cancel',
      confirm: 'Delete',
      explain:
        'Are sure you want to delete this item from your shop ? There is no rolling back.',
    },
  },
  provision: {
    total_sales: 'Total sales:',
    current_stock: 'Current provisions:',
    noProvisionHistory: 'No sale history',
    form: {
      title: 'Update provision',
      quantityLabel: 'Unit(s)',
      quantityHelperText: 'Units to add/remove to provision',
      cancel: 'Cancel',
      submit: 'Save',
    },
    action: {
      update: 'Actualize provisions',
    },
  },
  shopitem: {
    noDescription: 'No description',
    detail: {
      enabled: 'Yes',
      disabled: 'No',
      title: 'Product',
      provisionHistory: 'Stock history',
      parameters: 'Parameters',
      supplier_price: 'Supplier price',
      marketplace_enabled: 'Available on web marketplace',
      is_deliverable: 'Delivery fees',
      onsite_payment_available: 'On-site payment',
    },
    action: {
      edit: 'Edit',
      addToCard: 'Add to cart',
      delete: 'Delete',
    },
  },
};
