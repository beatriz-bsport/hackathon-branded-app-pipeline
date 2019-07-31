export default {
  errors: {
    // Validation errors
    incomplete_number: 'Your card number is incomplete.',
    incomplete_expiry: "Your card's expiration date is incomplete.",
    invalid_expiry_year_past: "Your card's expiration year is in the past.",
    invalid_expiry_year: "Your card's expiration year is invalid.",
    incomplete_cvc: "Your card's security code is incomplete.",
    invalid_number: 'Your card number is invalid.',
    // Payment errors
    card_declined: 'Your card was declined',
    expired_card: 'Your card has expired.',
    incorrect_cvc: "Your card's security code is incorrect.",
    processing_error:
      'An error occurred while processing your card. Try again in a little bit.',
    // Reason
    insufficient_funds: 'Your card has insufficient funds.',
    lost_card: null,
    stolen_card: null,
  },
};
