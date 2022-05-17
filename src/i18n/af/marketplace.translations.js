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
      "Vous êtes en train de réserver un groupe de séance. Vous serez inscrits à l'ensemble des {{count}} séances de ce groupe.",
    warningPartialBooking:
      "Vous êtes en train de réserver un groupe de séance. Vous n'êtes cependant pas obliger de participer à toutes les séances de ce groupe. Vous pourrez sélectionner les séances que vous souhaitez.",
  },
  calendar: {
    registered: 'Déjà inscrit(e)',
  },
};
