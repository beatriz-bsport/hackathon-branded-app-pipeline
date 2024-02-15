exports.default = {
  select: { placeholder: 'Shop product' },
  link: {
    copyLink: 'Copy the direct link to the payment page',
    copied: 'Link copied',
  },
  search: 'Search a product',
  dialog: {
    delete: {
      title: 'Deletion: {{shopitem.name}}',
      cancel: 'Cancel',
      confirm: 'Delete',
      explain:
        "Are you sure that you want to delete this product from your webshop? This action can't be undone.",
      warning:
        "Attention! Deleting this product will also make it unavailable for purchase for the packs it's used for.",
    },
  },
  provision: {
    total_sales: 'Total sales',
    current_stock: 'Current stock',
    noProvisionHistory: 'No sale history',
    form: {
      title: 'Update provision',
      quantityLabel: 'Unit(s)',
      quantityHelperText: 'Units to add/remove to provision',
      cancel: 'Cancel',
      submit: 'Save',
    },
    action: { update: 'Update inventory' },
  },
  shopitem: {
    noDescription: "There's no description to display.",
    selector: { placeholder: 'Search by name or barcode' },
    detail: {
      enabled: 'Yes',
      disabled: 'No',
      title: 'Product',
      provisionHistory: 'Inventory',
      parameters: 'Settings',
      supplier_price: 'Supplier price',
      marketplace_enabled: 'Available on the webshop',
      is_deliverable: 'No Click&Collect available',
      onsite_payment_available: 'Enable in-studio payments',
    },
    action: { edit: 'Edit', addToCard: 'Add to cart', delete: 'Delete' },
    form: {
      title: 'Webshop product',
      error: { name: 'A product name cannot exceed 200 characters' },
    },
  },
};
