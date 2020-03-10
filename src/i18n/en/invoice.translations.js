export default {
  returnPayment: {
    modal: {
      title: 'Client refund',
      content:
        'The payment will be refunded on the bank account, a credit will be added on the invoice to reflect the refunded payment. The invoice not the purchases will be reverted',
      cancel: 'Cancel',
      confirm: 'Refund',
    },
  },
  configuration: {
    stripe_footer: 'Invoice footer',
    explainStripeFooter:
      'This text will appear at the bottom of the invoices edited in PDF, please add any legal relevant information',
    submit_stripe_footer: 'Update',
    forms: {
      stripe_footer_placeholder: 'No additional legal information',
    },
  },
};
