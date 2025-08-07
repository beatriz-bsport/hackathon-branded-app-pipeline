exports.default = {
  itemList: {
    additionDrawer: {
      withoutCategory: 'No category',
      noResult: 'No result',
      unselectAll: 'Deselect all',
      selectAll: 'Select all',
      objectType: 'Type of object',
      category: 'Category',
      add: 'Add',
      cancel: 'Cancel',
      search: 'Search',
      tilesColor: 'Tile colour',
      objectsAddition: 'Products',
      objectGroupsSubtitle: 'Add a group of products',
      simpleObjectsSubtitle: 'Add products',
      title: 'POV',
    },
    goBack: 'Back',
  },
  iconSelector: { searchPlaceholder: 'Search' },
  sectionCard: { item: 'item', item_plural: 'items' },
  objectCard: {
    recurrence: {
      year: 'every year',
      year_plural: 'every {{ recurrence_basis }} years',
      month: 'every month',
      month_plural: 'every {{ recurrence_basis }} months',
      week: 'every week',
      week_plural: 'every {{ recurrence_basis }} weeks',
      day: 'every day',
      day_plural: 'every {{ recurrence_basis }} days',
    },
    subtitle: {
      giftcard: 'Gift card',
      subscription: 'Subscription',
      paymentCombo: 'Pack',
      shopProduct: 'Product',
      privatePass: 'Appointment pass',
      paymentPack: 'Pass',
      product: 'product',
      product_plural: 'products',
      credit: 'credit',
      credit_plural: 'credits',
      unlimited: 'Unlimited',
    },
    startingPrice: 'From {{ price }}',
    numberOfVariants: '{{ count }} variant',
    numberOfVariants_plural: '{{ count }} variants',
  },
  rolePage: {
    noResult: 'No access created',
    actionColumn: 'Action',
    emailColumn: 'Email',
    staffColumn: 'Staff',
    submit: 'Save',
    cancel: 'Cancel',
    password: 'Password',
    email: 'Email',
    lastName: 'Name',
    firstName: 'First name',
    addAccess: 'Add access',
    modalTitle: 'Creation of a sales interface access',
    title: 'Sales interface access',
    subtitle:
      'These accesses enable staff to access the sales interface. You need to be logged in to be able to sell via the interface.',
  },
  pageTitle: 'POS',
  pageLeavePrompt: {
    discard: 'Exit without saving',
    save: 'Save',
    description: 'Your changes have not been saved.',
    title: 'Save your changes?',
  },
  cardListPage: {
    categoryArchivedSnackbar: 'The category has been archived',
    archivedCategories: 'Archived categories',
    categoryModalSubtitle: 'Colour palette',
    categoryModalTitle: 'Tile colour',
    newSection: 'New category',
    addItems:
      'You can also add products by clicking on the + tile in the last position.',
    addSection:
      'You can also add a category by clicking on the + tile in the last position.',
    deleteTile: 'Delete the tile',
    archiveSection: 'Archive the category',
    moveTile: 'Move the tile',
    editColor: 'Edit the color',
    editName: 'Edit the name',
    editIcon: 'Edit the icon',
    seeLess: 'See less',
    seeMore: 'See more',
    possibleActionsFull:
      'You can perform actions by hovering over the tiles with your mouse. You can :',
    possibleActionsShort:
      'You can perform actions by hovering over the tiles with the mouse...',
    save: 'Save',
    preview: 'Preview',
  },
  interface: {
    seller: 'Seller',
    anonymousSale: 'No profile',
    searchAProduct: 'Search products',
    noResult: 'No result',
    resultsForString: '{{ count }} result for {{ searchText }}',
    resultsForString_plural: '{{ count }} results for {{ searchText }}',
    home: 'Home',
    goBack: 'Back',
    taxes: 'Taxes',
    totalIncludingTax: 'Total',
    payLater: {
      cancel: 'Cancel',
      title: 'Do it later',
      subText:
        'This shopping cart is already partially paid. By closing it, you will postponed the paiement of the remaining part. You will find the invoice on the backoffice.',
      payLater: 'Do it later',
    },
    cannotEdit: {
      title: 'Editing is not possible',
      subText:
        'The shopping cart can not be edited because it was already partially paid.',
      payment: 'Payment',
    },
    scannerMode: {
      subText: 'Scan items to add them to the shopping cart.',
      done: 'Complete',
      title: 'Scanning mode',
    },
    objectAdded: {
      title: 'Item added',
      subText: 'The item was successfully added to the shopping cart.',
    },
    cannotAdd: {
      tag: {
        hasTagAndDoesNotHaveTag:
          '{{ optionalBeginning }} {{- name }} is tagged as {{- ownedTagName }} and is not tagged as {{- notOwnedTagName }}.',
        hasTag:
          '{{ optionalBeginning }} {{- name }} is tagged as {{- tagName }}.',
        doesNotHaveTag:
          '{{ optionalBeginning }} {{- name }} is not tagged as {{- tagName }}.',
      },
      title: 'Cannot be added',
      subTextListItem:
        'Unfortunately it was not possible to add the item because',
      newMember: {
        subText: '{{ optionalBeginning }} {{- name }} is not a new member.',
      },
    },
    authenticationRequired: {
      subTextListItem: 'The item that you want to add is',
      bottomSubText:
        'Without member identification, the necessary checks cannot be carried out.',
      identifyMember: 'Identify a member',
      newMember: {
        subText: 'The item you want to add is for new members only.',
        subTextListItem: 'For new members only',
      },
      maxPurchase: {
        subTextListItem: 'Subject to a limit on the number of purchases',
        subText:
          'The item you want to add is subject to a limit on the number of purchases.',
      },
      tag: {
        subText:
          'The item you want to add is for members with certain tags only.',
        subTextListItem: 'For members with certain tags only',
      },
      title: 'Identification needed',
    },
    itemsRemovedFromBasket: {
      title: 'Items were removed from the shopping cart',
      subText:
        'When member was changed, certain items that were not compatible with the new member were removed from the shopping cart.',
    },
    totalExcludingTax: 'Total before tax',
    payment: 'Payment',
    selectItemToStart: 'Add an item to the basket to get started',
    memberModal: {
      title: 'Member profile',
      confirm: 'Save',
      cancel: 'Cancel',
    },
    authenticationNecessary:
      'Member authentication is necessary for this section.',
    ongoingBaskets: {
      title: 'Close baskets to log out',
      subText:
        'You still have some incomplete sales—close pending baskets to log out.',
    },
    deleteCurrentBasket: {
      title: 'Delete basket?',
      subText: "The items added to this basket won't be saved.",
      cancel: 'Back',
      delete: 'Delete',
    },
    outOfStock: {
      title: 'Item out of stock',
      subText:
        'This item is currently out of stock but you can still add it to the basket.',
      addAnyway: 'Add to basket',
    },
  },
  checkout: {
    billingDate: 'Billing date',
    priceExcludingTax: 'Total before tax',
    tax: 'Taxes',
    priceIncludingTax: 'Total',
    invoiceFootNote: 'Invoice footnote',
    deliveryFee: 'Delivery fee',
    priceRecap: 'Summary',
    amountDue: 'Total due',
    partialPayment: 'Paid',
    leftToPay: 'Outstanding amount',
    leftDue: 'Outstanding amount :',
    onSpot: 'On site',
    homeDelivery: 'Delivery',
    firstName: 'First name',
    lastName: 'Last name',
    sendToTerminal: 'Send to terminal',
    cancel: 'Cancel',
    validate: 'Validate',
    paymentSuccess: {
      title: 'Sale successful',
      description: 'Payment processed',
      subTextPartialPayment:
        'The payment has been processed. The invoice was sent by e-mail. The rest of the payment has been postponed: it can be made from the Backoffice or the customer profile.',
      printTicket: 'Print ticket',
      qrCodeTitle: 'Download receipt',
      sendByEmail: 'Email the invoice',
    },
    emailSent: {
      title: 'Email sent',
      subText:
        'The invoice has been sent to the email address that was provided.',
      printTicket: 'Print ticket',
    },
    payLater: {
      title: 'Payment postponed',
      subText:
        'The payment has been postponed: it can be carried out from the Backoffice or on the customer profile.',
    },
    noAnonymousInstalment: {
      explanation:
        'Payment by instalments is not possible when the invoice is anonymous',
      identify: 'Identify',
    },
    noPartialInstalment: {
      explanation:
        'Payment by instalments is not possible when the total due amount has been modified.',
      reset: 'Reset',
    },
    clientDebt: 'Client account balance',
    noAnonymousClientDebt:
      'It is necessary to identify a member on the invoice to use the client account balance',
    internalCredits: 'Internal credits',
  },
};
