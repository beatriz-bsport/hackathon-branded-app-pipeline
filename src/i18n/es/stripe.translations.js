export default {
  errors: {
    // Validation errors
    incomplete_number: 'Le numéro de carte est incomplet.',
    incomplete_expiry: "La date d'expiration de votre carte est incomplète.",
    invalid_expiry_year_past: "La date d'expiration votre carte est passée.",
    invalid_expiry_year: "La date d'expiration de votre carte est invalide.",
    incomplete_cvc: 'Le code de sécurité de votre carte est incomplet.',
    invalid_number: 'Le numéro de votre carte est invalide.',
    // Payment errors
    card_declined: 'Votre carte a été refusée.',
    expired_card: 'Votre carte a expirée.',
    incorrect_cvc: 'Le code de sécurite de votre carte est incorrect.',
    processing_error:
      "Une erreur a eue lieu lors de l'enregistrement de votre paiement. Veuillez réessayer d'ici quelques instants.",
    // Reason
    insufficient_funds: 'Votre carte ne dispose pas des fonds suffisants.',
  },
};
