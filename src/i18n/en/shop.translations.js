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
      title: 'Product',
      provisionHistory: 'Stock history',
      parameters: 'Parameters',
      supplier_price: 'Supplier price',
      marketplace_enabled: 'Available on web marketplace',
      is_marketplace_enabled: 'Yes ',
      is_marketplace_disabled: 'No',
    },
    action: {
      edit: 'Edit',
      addToCard: 'Add to cart',
      delete: 'Delete',
    },
  },
};
