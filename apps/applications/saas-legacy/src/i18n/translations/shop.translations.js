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
      quantityError: 'Please enter a valid number',
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
      barcodes: {
        title: 'Barcodes',
        option: {
          inherit: 'Inherit from the base product',
          generate: 'Generate new barcodes',
        },
      },
      variantHelperText:
        'Define variants if this product is available in multiple colours and/or sizes. You will be able to edit the properties of each variant later.',
      error: {
        name: 'A product name cannot exceed 200 characters',
        colorSize: 'A color/size name cannot exceed 100 characters',
      },
    },
  },
  // reworked
  startingAtWithPrice: 'Starting at {{price}}',
  variantCount: '{{count}} variant',
  variantCount_plural: '{{count}} variants',
  addVariantCount: 'Add {{count}} variant',
  addVariantCount_plural: 'Add {{count}} variants',
  saveProductWithVariantCount: 'Save a product with {{count}} variant',
  saveProductWithVariantCount_plural: 'Save a product with {{count}} variants',
  duplicateVariantWarning:
    'Some colour and size combinations already exist and will not be created again',
  shopList: {
    tab: {
      products: {
        title: 'Products',
        addProduct: 'Add product',
        subshopForm: {
          title: 'Add a category',
          field: {
            name: 'Name',
          },
        },
        franchiseSubshopDialog: {
          inputPlaceholder: 'Name of the category',
          create: 'Add category',
          update: 'Rename category',
          delete: 'Delete category',
          deleteInfo:
            'Are you sure that you want to delete this category ? All associated elements will also be deleted.',
          info: 'The categories will appear on the marketplace and the mobile application for items available for sale.',
        },
        storeOnly: 'Store only',
        online: 'Online',
        emptySubshopList: 'There are no products created yet in this category.',
      },
      settings: {
        title: 'Settings',
        section: {
          suppliers: {
            title: 'Suppliers',
            table: {
              name: 'Name',
              notes: 'Notes',
              actions: 'Actions',
              addSupplier: 'Add supplier',
              action: {
                showInfos: 'View informations',
                edit: 'Edit',
                delete: 'Delete',
              },
            },
            modal: {
              titleCreate: 'Add supplier',
              titleUpdate: 'Edit supplier',
              field: {
                name: 'Name *',
                description: 'Notes',
              },
            },
            detailsModal: {
              title: 'Supplier: ',
            },
            deleteModal: {
              title: 'Supplier: {{- supplierName }}',
              message: 'Are you sure you want to delete this supplier ?',
            },
          },
          supplierPrices: {
            title: 'Supplier prices',
            hideSupplierPricesForFranchisees:
              'Hide supplier prices for the franchise studios',
          },
        },
      },
    },
  },
  shopItemDetail: {
    title: 'Product details',
    startingAt: 'Starting at',
    showMore: 'Show more',
    showLess: 'Show less',
    copyPaymentPageLink: 'Copy payment page link',
    viewBarcode: 'View barcode',
    barcodeUnicityWarning: 'The barcode provided is already in use',
    deleteModal: {
      title: 'Deletion - {{- name }}',
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
        filterPlaceholder: {
          company: 'Select studio',
          size: 'Select size',
          color: 'Select color',
          establishmentBillingGroup: 'Select a billing group',
        },
        unsavedChangesModal: {
          title: 'Unsaved changes',
          inventory:
            'Before moving to another page, do you want to update inventory based on the values entered in the “Stock adjustment” column?',
          default:
            'Do you want to save your changes before moving to another page?',
        },
        formError: 'Stock adjustment value(s) must be valid numbers',
        action: { update: 'Update inventory' },
        variants: 'Variants',
        currentStock: 'Current stock',
        companyName: 'Studio',
        stockAdjustment: 'Stock adjustment (+/-)',
        totalSales: 'Total sales',
        tooltipForMultiLocationWebshop:
          'Since multilocation is enabled for this studio, stock can only be adjusted from the sub-account, not from the Master account.',
      },
      variants: {
        formError: {
          price: 'Price field values must be valid positive numbers',
        },
        formWarning: {
          barcode: 'Some barcode field values are already in use',
        },
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
        supplierPrice: 'Supplier price',
        vat: 'VAT/Sales tax',
        vatValue: '{{vat}} %',
        availableOnline: 'Available online',
        paymentMethods: 'Accepted payment methods',
        paymentMethodsChip: {
          online: 'Online',
          inStore: 'In store',
          onlineInStore: 'Online & In-store',
        },
        sellOnlyOnProvision: 'Only sell when stock is available',
        featured: 'Featured',
        requiresDelivery: 'Requires delivery',
        barcode: 'Barcode',
        barcodeTooltip: 'View barcode',
        sku: 'SKU',
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
