exports.default = {
  paymentMethod: {
    actions: { createCard: 'Add a card', createSepa: 'Add IBAN' },
    sectionTitle: 'Payment method',
    info: {
      link: 'here',
      content:
        'Your Bsport subscription will be charged to the payment method indicated below. To configure the account on which the online payments via Bsport will be credited, click',
    },
  },
  platformInvoice: {
    noInvoice: 'There are no invoices to display.',
    sectionTitle: 'My invoices',
    label: 'Invoice {{month}} / {{year}}',
    status: {
      failed: 'Payment: failed',
      processing: 'Payment: in progress',
      disputed: 'Payment: disputed',
      succeeded: 'Payment: successful',
      missing_charge: "There's no attempted payment to display.",
    },
    bill: 'Complete payment',
  },
  upsellPackage: {
    billOnce: '{{ price_cts }}',
    vod: { explainBilling: '  +{{currencyDisplay }}1 / active client' },
    billRecurrent: '{{ price_cts }} / month',
    otherAddonTitle: 'Available Add-Ons',
    myAddonTitle: 'My Add-Ons',
    knowMore: 'More information',
    sms: { explainBilling: '{{ price_cts }} / SMS' },
    lockDialog: {
      33: {
        intro: 'Discover our new interface of direct chat with your members.',
        explain:
          "You'll find here all your direct discussions, chats linked to your sessions, and your smartlist campaigns. The chat is compatible with SMS, email and push notifications.",
      },
      requestAccess: 'Request access',
    },
  },
  platformBillingStage: {
    monthlyPrice: '{{ price }} / month',
    maxBooking: 'Up to {{ max_booking_per_month }} reservations / month',
  },
  featureRequest: {
    close: 'Close',
    content:
      'Your interest has been noted, thank you for your interest! Your account manager will be in touch with you very soon with more information.',
    title: 'Add-on',
  },
  platformBillingPlan: {
    max_establishment: {
      label: 'Up to {{ max_establishment }} establishments',
      help: 'An establishment is considered as active starting from 8 monthly sessions',
    },
    max_coach: {
      label: 'Up to {{ max_coach }} teachers',
      help: 'A teacher is considered as active starting from 8 monthly sessions',
    },
  },
  platformBillingGroup: {
    soonAvailable: 'Available Soon !',
    myGroup: 'My subscription',
  },
};
