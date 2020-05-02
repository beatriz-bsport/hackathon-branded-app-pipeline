exports.default = {
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
    payment_intent_authentication_failure: 'Payment refused by your bank.',
    unknown: 'Erreur réseau, please retry in a few minutes',
    lost_card: null,
    stolen_card: null,
  },
  error_code: {
    none: '',
    // Validation errors
    incomplete_number: 'Incomplete card number.',
    incomplete_expiry: 'Expiration date is incomplete.',
    invalid_expiry_year_past: 'You card has expired.',
    invalid_expiry_year: 'Expiration date is invalid.',
    incomplete_cvc: 'Your security code is incomplete.',
    invalid_number: 'You card number is invalid.',
    expired_card: 'Your card has expired.',
    card_declined: 'Card declined',
    // Payment errors
    payment_intent_authentication_failure: 'Payment was declined by you bank.',
    payment_intent_payment_attempt_failed:
      'The payment was declined by your bank.',
    processing_error:
      'An occurred while registering payment, please try again in a fe minutes.',
    // Reason
    unknown: 'Network error, please retry in a few minutes',
  },
  decline_code: {
    none: '',
    card_not_supported: 'Your card was not recognized.',
    incorrect_number: 'Your card number is invalid.',
    incorrect_cvc: 'Your security code is invalid.',
    insufficient_funds: 'Not enough funds availabled.',
    restricted_card: 'Your card was refused by your bank',
    stolen_card: 'Your card has been tagged as stolen by your bank',
    transaction_not_allowed: 'The transaction was refused by your bank',
    generic_decline: 'Your bank has refused the payment',
    withdrawal_count_limit_exceeded:
      'Too much debut on a short period, declined by your bank',
  },
};
