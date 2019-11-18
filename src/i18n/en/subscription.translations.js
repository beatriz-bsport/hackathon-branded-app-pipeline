export default {
  table: {
    noContent: 'No subscription registered yet',
  },
  recap: {
    willBecharged: ' will be charged ',
    every: ' every ',
    month: 'every ',
    times: ' times ',
    forObject: ' for ',
    from: 'From ',
    to: ' until ',
    forATotalOf: 'For a total of ',
    includingFreeTrialOf1: ' including ',
    includingFreeTrialOf2: ' not billed ',
  },
  form: {
    check: 'Check',
    submit: 'Bill',
    title: 'New recurring invoice',
    cancel: 'Discard',
  },
  plannedInvoiceStatus: {
    pending: 'Pending',
    canceled: 'Discarded',
    failed: 'Payment refused',
    succeeded: 'Billed',
  },
  subscriptionStatus: {
    pending: 'Billing pending',
    canceledOn: 'Discarded on ',
    hasEnded: 'Billing finished',
  },
  action: {
    stop: 'Stop',
    stopExplain:
      'Next payments will be discarded and corresponding bills will be deleted. If a booking has been registered with a pass bought with a discarded invoice, it would also be deleted.',
  },
  parameters: {
    parameters: 'Parameters',
    autoRenew: 'Automatic renewal',
    subscribeAgain: 'Subscribe again',
    voucher: 'Promotion',
    trial_nb: 'Free months (at the end)',
    recurrent_voucher: 'Voucher on each bill',
    name: 'Name',
    member: 'Member',
    dateCreated: 'Date of creation',
    nbInterval: 'Number of months',
    recurrent_price: 'Recurring payment',
    paymentPack: 'Pass',
    nbMonths: 'Number of months',
    dateStart: 'First billing',
    firstBilling: 'First billing',
  },
  schedule: {
    provisionalTitle: 'Provisional schedule',
    paymentMethodTitle: 'Payment method',
  },
  paymentMethod: {
    sepa: 'SEPA debit',
    card: 'Card',
  },
  mandate: {
    name: 'Full name',
    email: 'Email',
    content:
      'By providing your IBAN and confirming this payment, you are authorizing bsport.io and Stripe, our payment service provider, to send instructions to your bank to debit your account and your bank to debit your account in accordance with those instructions. You are entitled to a refund from your bank under the terms and conditions of your agreement with your bank. A refund must be claimed within 8 weeks starting from the date on which your account was debited.',
  },
};
