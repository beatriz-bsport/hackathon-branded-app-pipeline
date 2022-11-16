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
};
