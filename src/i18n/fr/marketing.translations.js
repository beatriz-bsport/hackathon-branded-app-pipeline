exports.default = {
  newsletter: {
    form: {
      title: 'Inscrivez-vous à notre newsletter',
      email: 'Adresse email',
      firstName: 'Prénom',
      lastName: 'Nom',
      validate: 'Valider',
    },
    messages: {
      error: "Impossible d'enregistrer votre email pour le moment",
      success: "C'est enregistré !",
    },
  },
  notifications: {
    selectNotificationRules: 'Sélectionnez une règle pour voir les détails',
    createNotification: 'Formulaire de notification',
    selectIdentifierLabel: {
      meta_activity: 'Sélectionner une activité',
      establishment: 'Sélectionner un établissement',
      private_service: 'Sélectionner un rendez-vous',
      payment_pack: 'Sélectionner une carte de cours',
    },
    paymentPackPlaceholder: 'Carte de cours',
    next: 'Suivant',
    cancel: 'Annuler',
    fabLabels: {
      meta_activity: 'Activité',
      establishment: 'Établissement',
      private_service: 'Rendez-vous',
      payment_pack: 'Carte de cours',
    },
    groupTitle: {
      booking: "Réservation",
      privateBooking: "Rendez-vous",
      paymentPack: "Carte de cours",
    },
    paymentPackKind: {
      validity: 'Validité de la carte',
      credit: 'Nombre de crédits'
    },
    editRule: 'Modifier la règle',
    removeRule: 'Supprimer la règle',
    deleteDialogTitle: 'Supprimer la règle',
    deleteDialogText:
      'Etes vous sûr de vouloir supprimer cette règle ? Cette opération est définitive',
    notificationsEmpty: 'Aucune notification existante pour ce groupe',
    createNotificationFabLabel: 'Créer une notification'
  },
};
