exports.default = {
  deleteImpossibleTitle: 'Impossible de supprimer la séance',
  deleteImpossibleText:
    "Vous ne pouvez pas supprimer cette séance parce qu'elle a des réservations en cours.",
  close: 'Fermer',
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
    unevenQuickInvoices:
      'Des factures sans aucun mode de paiement sont ouvertes sur cette page. Voulez-vous vraiment quitter ?',
  },
  menu: {
    showMonth: 'Vision mois',
    showWeek: 'Vision semaine',
    showCancelled: 'Voir les annulations',
    hideCancelled: 'Masquer les annulations',
    massDisable: 'Annulation groupée',
    download: 'Récapitulatif',
  },
  massDisabler: {
    title: 'Annulation groupée',
    explain:
      "Sélectionnez l'intervalle de date sur lequel vous souhaitez annuler vos séances. Les membres ayant réservé seront prévenu par email et leur crédits automatiquement remboursés sur la carte de cours correspondante",
    explainWarning: 'ATTENTION cette opération est irréversible.',
    explainLoading: 'Veuillez patienter',
    secondWarning:
      "En cliquant sur 'CONFIRMER', les séances comprises dans l'intervalle sélectionné seront annulées et vous ne pourrrez plus revenir en arrière.",
    secondWarningConfirm: 'Voulez-vous vraiment continuer ?',
    actions: {
      cancel: 'Annuler',
      submit: 'Confirmer',
      continue: 'Continuer',
    },
  },
  bookingList: 'Réservations',
  bookingListEmpty: 'Aucune réservation',
  liveOfferEdit: {
    editSimilarOffers:
      'Voulez-vous modifier les séances similaires selon ces nouvelles conditions ?',
    selectEdit: 'Sélectionnez les séances qui seront modifiées',
    selectAll: 'Tout sélectionner',
    unselectAll: 'Tout désélectionner',
    deleteSimilarOffers: 'Voulez-vous supprimer les séances similaires ?',
    selectDelete: 'Sélectionnez les séances qui seront supprimées',
    cancelSimilarOffers: 'Voulez-vous annuler les séances similaires ?',
    selectCancel: 'Sélectionnez les séances qui seront annulées',
    noSimilarOffer:
      'Aucune séance similaire trouvée. Seule cette séance sera affectée.',
  },
};
