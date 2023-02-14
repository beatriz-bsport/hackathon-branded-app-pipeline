exports.default = {
  errors: {
    // Validation errors
    incomplete_number: 'Le numéro de carte est incomplet.',
    incomplete_expiry: "La date d'expiration de votre carte est incomplète.",
    invalid_expiry_year_past: "La date d'expiration de votre carte est passée.",
    invalid_expiry_year: "La date d'expiration de votre carte est invalide.",
    incomplete_cvc: 'Le code de sécurité de votre carte est incomplet.',
    invalid_number: 'Le numéro de votre carte est invalide.',
    // Payment errors
    card_declined: 'Votre carte a été refusée.',
    expired_card: 'Votre carte a expirée.',
    incorrect_cvc: 'Le code de sécurite de votre carte est incorrect.',
    payment_intent_authentication_failure:
      'Le paiement a été refusé par votre banque.',
    processing_error:
      "Une erreur a eu lieu lors de l'enregistrement de votre paiement. Veuillez réessayer d'ici quelques instants.",
    // Reason
    insufficient_funds: 'Votre carte ne dispose pas des fonds suffisants.',
    unknown: 'Erreur réseau, veuillez réessayer dans quelques instants',
    // Stripe terminal codes
    no_established_connection: 'Aucun terminal de paiement connecté',
    network_error: 'Erreur réseau, veuillez réessayer dans quelques instants',
    network_timeout: 'Erreur réseau, veuillez réessayer dans quelques instants',
    already_connected: 'Un autre terminal de paiement est déjà connecté',
    discovery_too_many_readers:
      'Impossible de se connecter, trop de terminaux aux alentours',
    setup_intent_authentication_failure:
      'Impossible de sauvegarder cette carte. Veuillez essayer un autre moyen de paiement.',
    reader_not_found:
      'Une erreur est survenue. Assurez-vous que votre terminal est bien en ligne, et connecté au même réseau wifi que votre appareil.',
    reader_error:
      'Une erreur est survenue. Assurez-vous que votre terminal est bien en ligne, et connecté au même réseau wifi que votre appareil.',
    none: '',
  },
  error_code: {
    none: '',
    // Validation errors
    incomplete_number: 'Le numéro de carte est incomplet.',
    incomplete_expiry: "La date d'expiration de votre carte est incomplète.",
    invalid_expiry_year_past: "La date d'expiration de votre carte est passée.",
    invalid_expiry_year: "La date d'expiration de votre carte est invalide.",
    incomplete_cvc: 'Le code de sécurité de votre carte est incomplet.',
    invalid_number: 'Le numéro de votre carte est invalide.',
    expired_card: 'Votre carte a expirée.',
    card_declined: 'Carte refusée',
    setup_intent_authentication_failure:
      'Impossible de sauvegarder cette carte. Veuillez essayer un autre moyen de paiement.',
    // Payment errors
    payment_intent_authentication_failure:
      'Le paiement a été refusé par votre banque.',
    payment_intent_payment_attempt_failed:
      'Le paiement a été refusé par votre banque.',
    processing_error:
      "Une erreur a eu lieu lors de l'enregistrement de votre paiement. Veuillez réessayer d'ici quelques instants.",
    // Reason
    unknown: 'Erreur réseau, veuillez réessayer dans quelques instants',
  },
  decline_code: {
    none: '',
    card_not_supported: "Votre carte n'est pas reconnue.",
    incorrect_number: 'Le numéro de carte est invalide.',
    incorrect_cvc: 'Le code de sécurité est invalide.',
    insufficient_funds: 'Votre carte ne dispose pas des fonds suffisants.',
    restricted_card: 'Votre carte a été refusée par votre banque',
    stolen_card: 'Votre carte a été marquée comme volée par votre banque',
    lost_card: 'Votre carte a été déclarée comme perdue par votre banque',
    transaction_not_allowed: 'Votre carte a été refusée par votre banque',
    generic_decline: "La banque n'a pas accepté le paiement",
    do_not_honor:
      "Votre banque a refusé le paiement, veuillez contacter votre conseiller bancaire pour l'autoriser",
    withdrawal_count_limit_exceeded: 'Trop de débit sur cette carte, refusée.',
    incorrect_pin: 'Code pin incorrect',
    invalid_pin: 'Code pin incorrect',
    offline_pin_required: 'Code pin requis',
    online_or_offline_pin_required: 'Code pin requis',
    pin_try_exceeded:
      'Nombre de tentatives max atteint. Essayez un autre moyen de payement',
    call_issuer:
      'Votre carte a été refusée pour une raison inconnue. Veuillez contacter votre banque',
    test_mode_live_card:
      'Votre carte a été refusée car vous utilisez une carte de test. Veuillez utiliser une carte réelle',
  },
};
