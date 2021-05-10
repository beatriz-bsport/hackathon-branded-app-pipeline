exports.default = {
  fields: {
    bonus: 'Bonus',
    base: 'Base',
    duration: 'Durée',
    nb_bookings: 'Réservations',
    name: 'Nom de la séance',
    date: 'Date',
    rule: 'Régle de rémunération de la séance',
    confirmed_bookings: 'Participants',
    cancelled_bookings: 'Réservations annulées',
    total: 'Rémunération totale',
    error:
      "Il semble que des cours n'ont pas de règle de rémunération associée. Vous devez associer une règle de paiment à ces cours ou associer un règle de paiement au coach.",
  },
  table: {
    download: 'Télécharger',
    downloadAll: 'Synthèse',
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
};
