const {
  UPSELL_IDENTIFIER_INBOX,
  UPSELL_IDENTIFIER_CADENCE,
} = require('../../libs/platform-billing/upsell-identifiers-for-translation.ts');

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
      cancelled_with_credit_note: 'Invoice cancelled by credit note',
      cancelled_with_negative_invoice: 'Invoice cancelled by negative invoice',
      negative_invoice_cancelling_bad_debt_invoice:
        'Cancelling a previous invoice',
    },
    bill: 'Complete payment',
  },
  platformCustomerEntity: {
    vatId: {
      dialog: {
        title: 'VAT identification number',
        errorChip: 'Missing valid VAT ID',
        invalidFormat: 'Invalid format',
        content:
          'bsport requires your VAT number (also known as a VAT registration number or intracommunity VAT number) to include it on invoices we issue to you.',
        vatIdLabel: 'VAT identification number',
        hasAttributedVatIdLabel:
          'I do not have a registered VAT number. If your business is based in the EU (excluding France), the reverse-charge mechanism will not apply and bsport will charge French VAT rates (20%).',
        update: 'Update VAT number',
        actions: {
          cancel: 'Cancel',
          save: 'Save',
        },
      },
      alert: {
        title: 'Missing valid VAT number',
        text: 'You have not provided a VAT number, or the one you have provided is not valid',
        description:
          'bsport requires your VAT number (also known as a VAT registration number or intracommunity VAT number) to include it on invoices we issue to you.',
        update: 'Update VAT number',
      },
    },
  },
  upsellPackage: {
    billOnce: '{{ price_cts }}',
    vod: { explainBilling: '  +{{currencyDisplay }}1 / active client' },
    billRecurrent: '{{ price_cts }} / month',
    billSMS: '{{ price_cts }} / SMS',
    otherAddonTitle: 'Available Add-Ons',
    myAddonTitle: 'My Add-Ons',
    knowMore: 'More information',
    seeMore: 'See more',
    sms: { explainBilling: '{{ price_cts }} / SMS' },
    lockDialog: {
      [UPSELL_IDENTIFIER_INBOX]: {
        intro: 'Discover our new interface of direct chat with your members.',
        explain:
          "You'll find here all your direct discussions, chats linked to your sessions, and your smartlist campaigns. The chat is compatible with SMS, email and push notifications.",
      },
      [UPSELL_IDENTIFIER_CADENCE]: {
        intro: 'Unlock Audience access',
        explain:
          'This feature is an add-on, please contact your account manager to get more information.',
      },
      requestAccess: 'Request access',
    },
    audienceLockDialog: {
      title: 'Meet your customers where they are with Audience',
      videoLink:
        'https://www.youtube.com/watch?v=VanGWUIAzTE&t=88s&ab_channel=bsport',
      description:
        'Automated workflows help you connect with your customers across multiple channels, so you can:',
      benefits: [
        'Convert leads with personalized messaging at key touch points',
        'Boost revenue with tailored customer journeys for VIP customers',
        'Retain customers with automated follow-ups',
      ],
      explain:
        'This feature is an add-on. Contact your Account Manager for more information.',
      showInterest: 'Get in touch',
      goHome: 'Back to calendar',
    },
    subscriptionForm: {
      title: 'Subscribe to add-on',
      priceHelper: 'This price will be added to your monthly plan.',
      confirmHelper: 'Please confirm you want to subscribe to this add-on',
      infoHelper: 'Need more information?',
      info: 'Contact customer support',
      confirmationMessage: 'You have successfully subscribed to {{- name }}',
      commitmentMessage:
        'Please note: Subscribing entails a 12-month commitment period',
      timeConsumingHelper:
        'The subscription to this upsell may take a few seconds to be processed',
    },
  },
  platformBillingStage: {
    monthlyPrice: '{{ price }} / month',
    maxBooking: 'Up to {{ max_booking_per_month }} reservations / month',
  },
  featureRequest: {
    close: 'Close',
    interestMessageWithChat:
      'Thanks for your interest in this add-on. Your Account Manager will reach out soon to give you more information. In the meantime, we can answer any questions you have via the help chat.',
    interestMessage:
      'Thanks for your interest in this add-on. Your Account Manager will reach out soon to give you more information.',
    header: "We'll be in touch!",
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
