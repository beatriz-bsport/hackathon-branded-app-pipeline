exports.default = {
  fields: {
    bonus: 'Bonus',
    base: 'Base',
    duration: 'Durée',
    nb_bookings: 'Réservations',
    nb_sessions: 'Nombre de séances',
    nb_appointments: 'Nombre de rendez-vous',
    nb_private_bookings: '',
    name: 'Nom de la séance',
    date: 'Date',
    rule: 'Règle de rémunération de la séance',
    confirmed_bookings: 'Participants',
    cancelled_bookings: 'Réservations annulées',
    total_on_sessions: 'Rémunération cours collectifs',
    total_on_appointments: 'Rémunération rendez-vous',
    total: 'Rémunération totale',
    coachName: 'Professeur',
    error:
      "Il semble que des cours n'ont pas de règle de rémunération associée. Vous devez associer une règle de paiment à ces cours ou associer un règle de paiement au professeur.",
    unpaid_private_booking: 'Des rendez-vous sont impayés.',
  },
  table: {
    download: 'Télécharger',
    downloadAll: 'Synthèse',
  },
  performance: {
    table: {
      header: {
        coachName: 'Professeur',
        nbSessions: 'Nombre de cours collectifs',
        confirmedBookings: '',
      },
    },
  },
  addBonus: 'Ajouter une règle',
  dateTitle: 'Plage de dates',
  remuneration: 'Rémunération',
  pricePerOffer: 'Montant par séance',
  bonus: 'Bonus',
  checkboxIncludeABonus: 'Inclure un bonus à la performance',
  bookingThresholdLabel: 'Minimum de réservation',
  bookingThresholdHelper:
    'Une séance ne sera comptabilisée que si elle totalise ce nombre de réservation',
  pricePerAdditionalBookingLabel: 'Variable par réservation',
  pricePerAdditionalBookingHelper:
    'Montant reversé pour toute réservation au-dessus de la limite',
  fixedPriceForAdditionalBookingLabel: 'Fixe par séance',
  fixedPriceForAdditionalBookingHelper:
    "Montant fixe reversé pour toute séance avec suffisamment d'inscrits",
  export: {
    buttonText: 'Exporter',
    dialog: {
      title: 'Exportation et stockage des données',
      message:
        'En exportant les données vous pourrez générer un excel pour la durée sélectionnée. Ces données seront également stockées et utilisables plus tard.',
      buttonText: 'Confirmer',
    },
    completed: {
      title: 'Exportation excel des rémunérations professeurs',
      message:
        "Le fichier d'exportation des rémunérations professeurs est disponible. Vous pourrez également récupérer ces données dans la section 'Données sauvegardées'.",
    },
  },
  cachedData: {
    title: 'Données sauvegardées ({{ count }})',
    dateSaved: 'Données générées le {{ date }}',
    dateRange: 'Rémunérations du {{- startDate }} au  {{- endDate }}',
    unresolvedDaterange: 'Intervalle de rémunération non valide',
    enterPreviewMode: 'Passer en mode preview',
    downloadMySavedData: 'Télécharger',
    previewModeTitle: 'Mode Preview',
    leavePreviewMode: 'Quitter le mode preview',
  },
};
