// @flow

export default {
  rules: 'Règles',
  add: 'Ajouter',
  save: 'Enregistrer',
  name: 'Nom',
  base_price: 'Base',
  actions: 'Actions',
  bookingThreshold: 'Seuil de réservations',
  pricePerAdditionalBooking: 'Bonus par réservation',
  addBonus: 'Ajouter une nouvelle règle',
  cancel: 'Annuler',
  addNew: 'Nouveau paramétrage de rémunération',
  select: {
    placeholder: 'Choississez une règle de calcul',
  },
  common: {
    from: 'Début',
    until: 'Fin',
  },
  calculate: 'Calculer',
  title: 'Règlement du coach {{name}}',
  label: 'Règle de rémunération',
  update: {
    success: 'Règle par défaut modifiée',
    error: 'Erreur lors de la modification',
  },
  dateTitle: 'Plage de dates',
  coaches: 'Coachs',
  setPaymentRuleSetForCoachFirst:
    'Attribuez tout d\'abord une régle de rémunération par défaut à ce coach.',
  modal: {
    delete: {
      title: 'Supprimez un règle',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      content:
        'En supprimant cette règle, celle-ci sera dissociée de tous les coachs et sessions auxquelles elle est actuellement attribuée',
    },
  },
  create: {
    error: 'Erreur lors de la création',
    success: 'Règle ajoutée',
  },
  delete: {
    error: 'Erreur lors de la suppression',
    success: 'Règle supprimée',
  },
};
