exports.default = {
  platformInvoice: {
    label: 'Facture {{ month }}/{{year}}',
    sectionTitle: 'Mes factures',
    noInvoice: 'Aucune facture',
    bill: 'Régulariser',
    status: {
      missing_charge: 'Aucun paiement tenté',
      succeeded: 'Paiement réussi',
      disputed: 'Paiement contesté',
      processing: 'Paiement en cours',
      failed: 'Paiement échoué',
    },
  },
  paymentMethod: {
    sectionTitle: 'Moyen de paiement',
    actions: {
      createSepa: 'Ajouter un IBAN',
      createCard: 'Ajouter une CB',
    },
  },
  upsellPackage: {
    billOnce: '{{price_cts, price }}',
    billRecurrent: '{{price_cts, price }} / mois',
    knowMore: 'En savoir +',
    myAddonTitle: 'Mes Add-ons',
    otherAddonTitle: 'Add-ons disponibles',
    vod: {
      explainBilling: '  +1 {{currencyDisplay }} /client actif',
    },
    sms: {
      explainBilling: '{{ price_cts, price }} / SMS',
    },
  },
  platformBillingGroup: {
    myGroup: 'Mon forfait',
    soonAvailable: 'Bientôt disponible !',
  },
  platformBillingPlan: {
    max_coach: {
      label: "Jusqu'à {{ max_coach }} professeurs",
      help: 'Un professeur est décompté à partir de 8 séances mensuelles',
    },
    max_establishment: {
      label: "Jusqu'à {{ max_establishment }} établissements",
      help: 'Un établissement est décompté à partir de 8 séances mensuelles',
    },
  },
  platformBillingStage: {
    monthlyPrice: '{{ price, price }} / mois',
    maxBooking: "Jusqu'à {{ max_booking_per_month }} réservations / mois",
  },
  featureRequest: {
    title: 'Add-on',
    content:
      "Nous avons bien noté votre intérêt, merci pour votre intérêt ! Votre chargé de compte bsport vous recontactera très vite avec plus d'informations.",
    close: 'Fermer',
  },
};
