import { BILLING_PLAN_EVENTS } from '@bsport/common/lib/master-data/events';

export default {
  events: {
    list: {
      title: 'Last events',
    },
    [BILLING_PLAN_EVENTS.pause]: 'Pause',
    [BILLING_PLAN_EVENTS.create]: 'Create',
    [BILLING_PLAN_EVENTS.stop]: 'End',
    [BILLING_PLAN_EVENTS.renew]: 'Auto-renew',
    [BILLING_PLAN_EVENTS.payment_dispute]: 'Payment dispute',
    [BILLING_PLAN_EVENTS.payment_success]: 'Payment successfull',
    [BILLING_PLAN_EVENTS.payment_failure]: 'Payment refused',
    [BILLING_PLAN_EVENTS.update_payment_method]: 'Payment method updated',
    [BILLING_PLAN_EVENTS.update_payment_pack]: 'Pass updated',
  },
  table: {
    noContent: 'No subscription registered yet',
  },
  subscription: {
    list: {
      title: 'Ongoing-subscription',
    },
  },
  contract: {
    registerManager: {
      title: 'Recurring payment',
      explainChoseContract:
        'Please select a contract, it will be billed monthly.',
      actions: {
        cancel: 'Cancel',
      },
      explainCustomSubscriptionForm:
        'No i want to define a custom contract in this case',
    },
    description: 'Description',
    legal: 'Legal agreement',
    actions: {
      iAcceptCondition: 'I accept the legal aggreement',
      iwanttostarton: 'I want to start my subscription on : ',
      subscribe: 'Subscribe',
    },
    duration: '{{month}} months',
    list: {
      title: 'Contracts available to customer',
      isEmpty: 'No contract',
      addButton: 'Create a contract',
      register: 'Subscribe a member',
    },
    form: {
      title: 'Contract form',
      name: {
        label: 'Contract name',
      },
      nb_interval: {
        label: 'Number of months',
      },
      managerOnly: {
        label: 'Unavailable for customers',
      },
      autoRenewal: {
        label: 'Auto renewal',
      },
      recurrent_price: {
        label: 'Monthly payment',
      },
    },
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
