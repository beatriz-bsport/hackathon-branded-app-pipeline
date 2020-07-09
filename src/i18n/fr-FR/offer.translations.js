exports.default = {
  video: {
    cantOpenLink:
      'Le lien vers conférence semble erroné, veuillez contacter votre club {{ contact_email }}',
    redirectLink:
      "Si vous n'êtes pas automatiquement redirigé, utiliser ce lien :",
    startingSoon: 'Votre séance démarre dans {{ minutesLeft }} minutes',
    hasEnded: 'Cette séance est terminée',
    isAutoRefresh:
      'Vous serez redirigé automatiquement sur la visioconférence 15 minutes avant le début du cours',
    loadingSoon: 'En cours de chargement...',
    activateVideo: 'Lancer la diffusion',
  },
  disabled: 'Annulée',
  credit_price: ' Crédit',
  booking: {
    confirmed: 'Confirmé(s)',
    fillRate: 'Taux de remplissage',
    waiting: "Liste d'attente",
  },
  extraordinaryEstablishment: '(lieu temporaire)',
  substitute: 'Remplaçant',
  calendar: {
    modifyOffer: 'Modifier',
    deleteOffer: 'Annuler',
  },
  manageOffer: 'Gérer mes réservations',
  forms: {
    old_date: 'Ancien horaire :',
    new_date: 'Nouvel horaire :',
    delete: {
      buttonHardDelete: 'Supprimer',
    },
  },
  card: {
    copyLink: 'Copier le lien vers la page de réservation',
    copied: 'Lien copié',
  },
  offerManagement: {
    bookingOrder: {
      date: 'Trier par date',
      lastname: 'Trier par nom',
      firstname: 'Trier par prénom',
    },
  },
  massDisabler: {
    title: 'Annulation groupée',
    explain:
      "Sélectionnez l'intervalle de date sur lequel vous souhaitez annuler vos séances. Les membres ayant réservé seront prévenu par email et leur crédits automatiquement remboursés sur la carte de cours correspondante",
    explainWarning: 'ATTENTION cette opération est irréversible.',
    explainLoading: 'Veuillez patienter',
    actions: {
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
};
