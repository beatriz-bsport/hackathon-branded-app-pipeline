export default {
  detail: {
    tab: {
      general: 'Général',
      calendar: 'Calendrier',
    },
  },
  establishment: 'Établissement ',
  capacity: {
    label: 'Capacité de la salle',
    helperText: 'Utilisé uniquement pour calculer la disponibilité',
  },
  baseEstablishment: 'Habituel',
  overrider: 'Remplacement',
  establishment_override: 'Établissement de remplacement',
  search: 'Chercher un établissement',
  addButton: 'Ajouter un établissement',
  pleaseSelectOne: 'Veuillez sélectionner un club sur la carte',
  offers: 'Calendrier des séances:',
  noMoreOffers: 'Plus aucune séance de prévue',
  goBackToList: 'Retour aux établissements',
  pleaseFill: 'Veuillez renseigner un établisssement',
  practical_info: {
    label: "Information d'accès",
    placeholder: 'Code 1234 porte de droite',
    helperText: "Cette information ne sera affichée qu'à la réservation",
  },
  form: {
    new: {
      title: 'Titre',
    },
  },
  card: {
    update: 'Modifier',
  },
  update: {
    imageUploaderRequireEditMessage:
      "Une fois votre établissement créé, vous aurez la possibilité d'ajouter des images supplémentaires.",
  },
  forms: {
    delete: {
      title: 'Suppression établissement',
      actions: {
        cancel: 'annuler',
        confirm: 'Supprimer',
      },
      content: {
        canDelete:
          'Êtes-vous sûr de vouloir supprimer cet établissement ? Cette opération est irréversible. Les séances et réservations passées ne seront pas affectées',
        cannotDelete:
          "Impossible de supprimer cet établissement, des séances sont prévues dans le futur. Vérifiez qu'elles ont bien été annulées puis supprimées",
      },
      message: {
        success: 'Etablissement supprimé',
        error: 'Impossible de supprimer cet établissement',
      },
    },
    error: "Impossible de sauvegarder l'établissement",
    create: {
      title: 'Nouvel établissement',
      success: 'Établissement créé avec succès',
    },
    update: {
      title: 'Édition des informations',
      success: 'Établissement modifié avec succès',
    },
  },
};
