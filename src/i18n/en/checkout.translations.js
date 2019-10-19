export default {
  paymentIntent: {
    isProcessing: 'Processing...',
  },
  forms: {
    delivery: {
      first_name: 'Firstname',
      last_name: 'Lastname',
      actions: {
        submit: 'Next',
        cancel: 'Back',
      },
    },
  },
  autoAdd: {
    paymentPack: {
      locked: 'You can not buy this pass!',
    },
  },
  myBasket: {
    finalize: {
      steps: {
        address: 'Address',
        payment: 'Billing',
      },
    },
    title: 'My basket',
    isEmpty: 'You basket is empty',
    error: {
      invalidBasket:
        'Your basket contained items which are not available for sell anymore. No payment was registered.',
    },
    actions: {
      closeBasket: 'Continue shopping',
      checkoutBasket: 'Buy',
      payZero: 'Confirm my basket',
    },
  },
};
