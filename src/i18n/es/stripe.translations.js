exports.default = {
  errors: {
    // Validation errors
    incomplete_number: 'El numero de la tarjeta bancaria no es completo.',
    incomplete_expiry: 'La fecha de expiración no es completa.',
    invalid_expiry_year_past: 'La fecha de expiración es pasada.',
    invalid_expiry_year: 'La fecha de expiración no es valida.',
    incomplete_cvc: 'Le codigo de seguridad de su tarjeta no es completo.',
    invalid_number: 'El numero de la tarjeta bancaria no es valido.',
    // Payment errors
    card_declined: 'Su tarjeta es rechazada.',
    expired_card: 'Su tarjeta es caducada.',
    incorrect_cvc: 'El codigo de seguridad de su tarjeta no es valido.',
    processing_error: 'Hay un error, intentalo de nuevo en algunos minutos.',
    // Reason
    insufficient_funds: 'No hay suficiente dinero es su cuenta bancaria.',
  },
};
