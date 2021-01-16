exports.default = {
  platformInvoice: {
    label: 'Facture {{ month }}/{{year}}',
    sectionTitle: 'Mes factures',
    noInvoice: 'Aucune facture',
  },
  paymentMethod: {
    sectionTitle: 'Moyen de paiement',
    actions: {
      createSepa: 'Ajouter un IBAN',
      createCard: 'Ajouter une CB',
    },
  },
  upsellPackage: {
    billOnce: '{{price_cts }} €',
    billRecurrent: '{{price_cts }} € / mois',
    knowMore: 'En savoir +',
    myAddonTitle: 'Mes Add-ons',
    otherAddonTitle: 'Add-ons disponibles',
    vod: {
      explainBilling: '  +1€ /client actif',
    },
    sms: {
      explainBilling: '{{ price_cts }} € / SMS',
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
    monthlyPrice: '{{ price }} € / mois',
    maxBooking: "Jusqu'à {{ max_booking_per_month }} réservations / mois",
  },
  featureRequest: {
    title: 'Add-on',
    content:
      "Nous avons bien noté votre intérêt, merci pour votre intérêt ! Votre chargé de compte bsport vous recontactera très vite avec plus d'informations.",
    close: 'Fermer',
  },
};
