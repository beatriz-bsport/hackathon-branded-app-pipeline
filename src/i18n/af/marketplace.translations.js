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
};
