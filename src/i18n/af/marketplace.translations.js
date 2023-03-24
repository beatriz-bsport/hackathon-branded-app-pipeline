exports.default = {
  selector: {
    coach: { placeholder: 'Professeur' },
    level: { placeholder: 'Niveau' },
    establishment: { placeholder: 'Salle' },
  },
  paymentCombo: {
    addToCart: 'Ajouter au panier',
  },
  warning: {
    isManager:
      'Vous êtes connecté en tant que manager, pour accéder à la vue client veuillez vous déconnecter',
    disconnect: 'Me déconnecter',
    backToBackoffice: 'Interface manager',
  },
  workshop: {
    loadMore: 'Voir plus',
    noWorkshopAvailable: "Aucun atelier n'est prévu pour le moment",
    card: {
      showMore: "Plus d'info",
      book: 'Réserver',
      bookOption: "Liste d'attente",
      isPast: 'Passé',
      notAvailable: 'Annulé',
      duration: 'Durée: {{duration}}',
      bookTitle: 'Réservez une séance',
      loadMore: 'Plus de séances',
    },
    cancel: 'Annuler',
    confirm: 'Continuer',
    warningFullBooking:
      "Vous êtes en train de réserver un groupe de séances. Vous serez inscrit à l'ensemble des {{count}} séances de ce groupe.",
    warningPartialBooking:
      "Vous êtes en train de réserver un groupe de séances. Vous n'êtes cependant pas obligé de participer à toutes les séances de ce groupe. Vous pourrez sélectionner les séances que vous souhaitez.",
    warningBookingRedirectToFirstOffer:
      "Vous avez été redirigé sur l'écran de reservation d'un groupe de séances {{name}}, les séances devant être réservées ensemble seront listées sur votre écran de réservation.",
  },
  calendar: {
    registered: 'Déjà inscrit(e)',
    broadcast: 'En ligne',
    conditions: 'Conditions',
    description: 'Description',
    close: 'Fermer',
  },
  genericCard: {
    title: {
      universalPassMessage:
        'Carte universelle, utilisable pour les cours collectifs et les rendez-vous',
    },
    credits: {
      availableCredit: '{{count}} crédit',
      availableCredit_plural: '{{count}} crédits',
      unlimited: 'Illimité',
    },
    details: {
      buttonContent: 'Détails',
    },
    validity: {
      year: '{{count}}\u00A0an',
      year_plural: '{{count}}\u00A0ans',
      month: '{{count}}\u00A0mois',
      month_plural: '{{count}}\u00A0mois',
      day: '{{count}}\u00A0jour',
      day_plural: '{{count}}\u00A0jours',
    },
    addButton: {
      buttonContent: 'Ajouter au panier',
    },
    validForDuration: {
      validDay: 'Valide\u00A0{{ count }}\u00A0jour',
      validDay_plural: 'Valide\u00A0{{ count }}\u00A0jours',
      validMonth: 'Valide\u00A0{{ count }}\u00A0mois',
      validMonth_plural: 'Valide\u00A0{{ count }}\u00A0mois',
      validYear: 'Valide\u00A0{{ count }}\u00A0an',
      validYear_plural: 'Valide\u00A0{{ count }}\u00A0ans',
      validAnd: 'Valide\u00A0{{ first }} et\u00A0{{ second }}',
      validDaysMonthsYears:
        'Valide\u00A0{{duration_years}}, {{ duration_months }}\u00A0et\u00A0{{ duration_days }}',
      validFromTo:
        'Valide\u00A0du\u00A0{{duration_date_start}} au\u00A0{{duration_date_end}}',
      purchase: 'Valide à partir de la date de facturation',
      booking: 'Valide à partir de la première réservation',
      attendance: 'Valide à partir de la première présence',
    },
  },
  genericCardDetails: {
    credits: {
      availableCredit: '{{count}} crédit',
      availableCredit_plural: '{{count}} crédits',
      unlimited: 'Illimité',
    },
    compatibility: {
      none: 'Aucun rendez-vous compaptible',
      compatible: 'Compatible avec {{count}} rendez-vous',
      compatible_plural: 'Compatible avec {{count}} rendez-vous',
      compatibilities: 'Compatibilités',
      allPrivateSlotsAvailables: 'Tout type de séances',
      button: {
        close: 'Fermer',
      },
      categories: '{{ count }} catégorie',
      categories_plural: '{{ count }} catégorie',
      activities: '{{ count }} activité',
      activities_plural: '{{ count }} activités',
      establishments: '{{ count }} salle',
      establishments_plural: '{{ count }} salles',
      compatibilityModal: {
        categories: 'Catégories',
        activities: 'Activités',
        establishments: 'Salles',
      },
      packs: {
        all: 'Compatible avec tout',
        compatible: 'Compatible avec ',
        categories: 'Compatible avec {{ count }} catégorie',
        categories_plural: 'Compatible avec {{ count }} catégories',
        activities: 'Compatible avec {{ count }} activité',
        activities_plural: 'Compatible avec {{ count }} activités',
        establishments: 'Compatible avec {{ count }} salle',
        establishments_plural: 'Compatible avec {{ count }} salles',
        categoriesAndActivities:
          'Compatible avec {{ categories }} et {{ activities }} ',
        categoriesAndEstablishment:
          'Compatible avec {{ categories }} et {{ establishments }} ',
        establishmentsAndActivities:
          'Compatible avec {{ establishments }} et {{ activities }} ',
        categoriesAndActivitiesAndEstablishments:
          'Compatible avec {{ categories }}, {{ establishments }} et {{ activities }} ',
        and: ' et ',
      },
    },
    restrictions: 'Restrictions',
    includedElements: {
      cancellation: '{{count}} annulation',
      cancellation_plural: '{{count}} annulations',
      onsitePaymentAvailable: 'Paiement sur place disponible',
      fullVodAccess: 'Compatible avec la VOD',
      onlyVodAccess: 'Disponible uniquement pour la VOD',
      compatibleWithEverything: 'Compatible avec tout',
      isUniversalPass: 'Carte universelle',
      newMemberOnly: 'Uniquement pour les nouveaux membres',
      restrictions: {
        title: "Restrictions d'utilisation",
        perDay: '{{count}} utilisation par jour',
        perDay_plural: '{{count}} utilisations par jour',
        maxPerDay: 'Utilisation maximum par jour : <strong>{{count}}</strong>',
        maxPerDay_plural:
          'Utilisations maximum par jour : <strong>{{count}}</strong>',
        perWeek: '{{count}} utilisation par semaine',
        perWeek_plural: '{{count}} utilisations par semaine',
        maxPerWeek:
          'Utilisation maximum par semaine : <strong>{{count}}</strong>',
        maxPerWeek_plural:
          'Utilisations maximum par semaine : <strong>{{count}}</strong>',
        perMonth: '{{count}} utilisation par mois',
        perMonth_plural: '{{count}} utilisations par mois',
        maxPerMonth:
          'Utilisation maximum par mois : <strong>{{count}}</strong>',
        maxPerMonth_plural:
          'Utilisations maximum par mois : <strong>{{count}}</strong>',
      },
      maxPurchasePerMember: '{{count}} achat par membre',
      maxPurchasePerMember_plural: '{{count}} achats par membre',
      penalty: {
        days: '{{penalty_days}} de blocage après {{penalty_cancellations}} hors délai sur une période de {{penalty_days_period}}',
        amount:
          '{{penalty_amount}} déduit après {{penalty_cancellations}} hors délai sur une période de {{penalty_days_period}}',
        penaltyDay: '{{count}} jour',
        penaltyDay_plural: '{{count}} jours',
      },
      see: 'Voir',
    },
  },
  packCard: {
    comboItemList: {
      paymentPackItem: '{{count}}\u00A0carte\u00A0de\u00A0cours',
      paymentPackItem_plural: '{{count}}\u00A0cartes\u00A0de\u00A0cours',
      privatePassItem: '{{count}}\u00A0carte\u00A0de\u00A0RDV',
      privatePassItem_plural: '{{count}}\u00A0cartes\u00A0de\u00A0RDV',
      hiddenItem: '{{count}}\u00A0autre\u00A0élément',
      hiddenItem_plural: '{{count}}\u00A0autres\u00A0éléments',
    },
  },
  packCardDetail: {
    comboItemList: {
      content: 'Contenu',
    },
  },
  contractCard: {
    billingInterval: {
      month: 'mois',
      month_plural: 'Tous\u00A0les\u00A0{{ count }}\u00A0mois',
      week: 'semaine',
      week_plural: 'Toutes\u00A0les\u00A0{{ count }}\u00A0semaines',
      year: 'an',
      year_plural: 'Tous\u00A0les\u00A0{{ count }}\u00A0ans',
      day: 'jour',
      day_plural: 'Tous\u00A0les\u00A0{{ count }}\u00A0jours',
    },
    fees: 'Frais\u00A0de\u00A0dossier\u00A0:\u00A0{{ fees }}',
    invoice: '{{ count }}\u00A0facture',
    invoice_plural: '{{ count }}\u00A0factures',
    registerButton: "M'abonner",
    seeMore: 'Voir plus',
    seeLess: 'Voir moins',
    legalContract: 'Mentions légales',
    autoRenewal: 'Renouvellement tacite',
    chooseButton: 'Choisir',
  },
};
