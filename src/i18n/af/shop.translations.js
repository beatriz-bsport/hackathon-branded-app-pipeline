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
      colors: {
        title: 'Colours',
        helperText: 'Add a colour by pressing enter',
      },
      sizes: {
        title: 'Sizes',
        helperText: 'Add a size by pressing enter',
      },
      variantHelperText:
        'Define variants if this product is available in multiple colours and/or sizes. You will be able to edit the properties of each variant later.',
      error: { name: 'A product name cannot exceed 200 characters' },
    },
  },
  // reworked
  shopItemDetail: {
    title: 'Product details',
    startingAt: 'Starting at',
    showMore: 'Show more',
    showLess: 'Show less',
    copyPaymentPageLink: 'Copy payment page link',
    viewBarcode: 'View barcode',
    deleteVariant: 'Delete variant',
    deleteModal: {
      title: 'Deletion - {{name}}',
      genericTitle: 'Deletion confirmation',
      message:
        "Are you sure that you want to delete this product from your webshop? This action can't be undone.",
      comboWarning:
        "Attention! Deleting this product will also make it unavailable for purchase for the packs it's used for.",
    },
    tab: {
      inventory: 'Inventory',
      variants: 'Variants',
      settings: 'Settings',
      history: 'History',
    },
    table: {
      inventory: {
        variants: 'Variants',
        currentStock: 'Current stock',
        stockAdjustment: 'Stock adjustment (+/-)',
        totalSales: 'Total sales',
        seeInvoice: 'See invoice',
      },
      variants: {
        placeholder: 'This product does not have variants yet',
        action: { add: 'Add a variant', edit: 'Edit variant' },
        image: 'Image',
        upload: 'Upload',
        colorAndSize: 'Colour & Size',
        price: 'Price',
        supplierPrice: 'Supplier price',
        sku: 'SKU',
        barcode: 'Barcode',
        availableOnline: 'Available online',
      },
      settings: {
        supplier: 'Supplier',
        vat: 'VAT/Sales tax',
        availableOnline: 'Available online',
        paymentMethods: 'Accepted payment methods',
        sellOnlyOnProvision: 'Only sell when stock is available',
        featured: 'Featured',
        requiresDelivery: 'Requires delivery',
      },
      history: {
        date: 'Date',
        variant: 'Variant',
        studio: 'Studio',
        updateType: {
          title: 'Type of update',
          sale: 'Sale',
          manual: 'Manual adjustement',
          purchase: 'Purchase order',
        },
        quantity: 'Quantity',
        invoice: { title: 'Invoice', seeInvoice: 'See invoice' },
      },
    },
  },
};
