// @flow

exports.default = {
  pageTitle: 'Règles de rémunération',
  rules: 'Règles',
  paymentRules: 'Règles de rémunération',
  add: 'Ajouter',
  save: 'Enregistrer',
  name: 'Nom',
  base_price: 'Base',
  base_percent: 'Pourcentage de la valeur',
  include_tax: 'Calcul TTC',
  calculation_method: 'Méthode de calcul',
  only_attendant: 'Restreindre le décompte de réservation aux élèves présents',
  actions: 'Actions',
  bookingThreshold: 'Seuil de réservations (inclu)',
  pricePerAdditionalBooking: 'Bonus par réservation',
  addBonus: 'Ajouter une nouvelle règle',
  cancel: 'Annuler',
  addNew: 'Nouveau paramétrage de rémunération',
  select: {
    placeholder: 'Choississez une règle de calcul',
    placeholderOverride: 'Règle par défaut du coach',
    reset: 'Utiliser la règle par défaut du coach',
    coachPaymentRuleForSessions: 'Cours collectifs & Ateliers',
    coachPaymentRuleForPrivateService: 'Rendez-vous',
  },
  fabButton: {
    addNewForSession: 'Cours collectifs & Ateliers',
    addNewForRDV: 'Rendez-vous',
  },
  tabs: {
    session: 'Cours Collectifs & Ateliers',
    appointment: 'Rendez-Vous',
    all: 'Tous les cours',
  },
  common: {
    from: 'Début',
    until: 'Fin',
    pick_a_month: 'Choisissez un Mois',
  },
  calculate: 'Calculer',
  title: 'Règlement du professeur {{name}}',
  label: 'Règle de rémunération',
  dateTitle: 'Plage de dates',
  coaches: 'Professeurs',
  setPaymentRuleSetForCoachFirst:
    "Attribuez tout d'abord une régle de rémunération par défaut à ce professeur.",
  modal: {
    delete: {
      title: 'Supprimez un règle',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      content:
        'En supprimant cette règle, celle-ci sera dissociée de tous les professeurs et sessions auxquelles elle est actuellement attribuée',
    },
  },
  calculation_methods: {
    bookings: 'Sur le nombre de réservations',
    margin_value: 'Sur la valeur marginale de chaque réservation',
  },
  coach_payment_rules: {
    addNewCoachPaymentRule: 'Nouveau paramétrage de rémunération',
    name: 'Nom',
    coaches: 'Coaches',
    actions: 'Actions',
    calculationMethod: 'Méthode de calcul',
    forConfirmedBookings: 'Pour les élèves présents',
    forCancelledBookings: 'Pour les annulations hors délai et abscences',
    base_remuneration: 'Base fixe',
    percentage_base: 'Pourcentage',
    addRemunerationOnCancellation:
      "Rémunérer le professeur en cas d'annulation hors délai ou absence",
    differentRemunerationForCancellation:
      'Appliquer des règles bonus différentes pour le décompte des élèves absents ',
    remunerationLimits: 'Rémunérations limites',
    min_remuneration: 'Minimum',
    max_remuneration: 'Maximum',
    taxe_rate: 'Calcul TTC',
    add_taxe_rate: 'Taxe à ajouter',
    taxeConciseHelper:
      'Aide : Tous les pourcentages sont calculés sur la valuer marginale de chaque réservation hors taxe.',
    taxeLongHelper:
      'Aide : Tous les pourcentages sont calculés sur la valeur marginale de chaque réservation hors taxe. La taxe ajoutée s’applique sur la valeur marginale ainsi que l’ensemble des fixes et des bonus.',
    cancellationBaseHelper:
      'Aide : En cochant cette case le coach ne percevera pas de rémunération supplémentaire sur la valeur marginale des réservations annulées',
    fixedBonusbyInterval: 'Ajouter un bonus fixe par intervalle',
    bonusForEachReservationInInterval:
      "Ajouter un bonus pour chaque réservation de l'intervalle",
    excludePaymentPack: 'Exclure certaines cartes',
    paymentPackPlaceHolder: 'Selectionner des cartes de cours',
    Bonuses: {
      bonus: 'Bonus',
      addBonus: 'AJOUTER UNE REGLE DE BONUS',
      from: 'De',
      to: 'à',
      bookingsThresholds: 'Réservations (bornes incluses)',
      forEachBooking: 'pour chaque réservation',
      bonus_rules: 'Règles de bonus',
    },
    Errors: {
      nameRequired: 'Le nom est un champ obligatoire.',
      invalidMinimum:
        'La rémunération minimale doit être supérieure ou égale à la base fixe',
      invalidMaximum:
        'La rémunération maximale doit être supérieure à la rémunération minimale',
      invalidBonusAmount: 'Le bonus doit être supérieur ou égal à 0.1.',
      invalidLowerInterval:
        "L'intervalle supérieur doit être supérieur à l'intervalle inférieur.",
      invalideIntervals:
        "L'intersection d'intervalles pour les bonus de même nature n'est pas autorisée.",
      invalideUpperInterval: "L'intervalle supérieur doit être un nombre.",
      baseRemunerationRequired:
        "La rémunération de base est un champ obligatoire si vous avez coché la case 'Base-Fixe' ci-dessus.",
      baseRemunerationTypeError:
        'La rémunération de base doit être un nombre positif.',
      percentagebaseRemunerationRequired:
        'La rémunération par pourcentage est un champ obligatoire si vous avez coché la case ci-dessus.',
      percentagebaseRemunerationTypeError:
        'La rémunération par pourcentage doit être un nombre compris entre 0 et 100.',
      taxeRateRequired:
        "La taxe est un champ obligatoire si vous avez coché la case 'Calcul TTC' ci-dessus.",
      taxeRateTypeError: 'La taxe doit être un nombre compris entre 0 et 100.',
      lowerIntervalTypeError:
        "L'interval inférieur doit être un nombre inférieur ou égale à 0",
      invalidCancelledBookingRules:
        'Si vous souhaitez appliquer des bonus différents pour les élèves absents vous devez définir au moins un bonus ou une base par pourcentage dans la section ci-dessous.',
    },
    Simulator: {
      title: 'Simulateur de rémunérations',
      resultTitle: 'Résultat de votre simulation (rémunération du professeur)',
      helper:
        'Aide : Vérifier ici que votre règle de rémunération correspond à vos attentes',
      for: 'Pour',
      students: 'élèves',
      and: 'Et',
      cancellations: 'absences ou annulations hors délai',
      which: 'Qui rapporte',
      forEachBooking: 'pour chaque réservation',
      forConfirmedBookings: "Nombre d'élèves",
      forCancelledBookings: "Nombre d'abscence",
      marginValue: 'Valeur marginale',
      bonus: 'Total des bonus',
      total_payment: 'Paiement final',
      student_attended: 'Elève présent',
      student_did_not_attend: 'Elève absent',
    },
  },
};
