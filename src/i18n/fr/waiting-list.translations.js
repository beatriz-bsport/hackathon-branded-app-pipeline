export default {
  form: {
    dumb_delay_minutes: {
      label: 'Gestion simple',
      helper:
        "Si une place se libère, l'élève dispose de N minutes pour s'inscrire, avant que le prochain ne prenne sa place.",
    },
    smart_delay_percentage: {
      label: 'Gestion intellligente',
      helper:
        "Si une place se libère, l'élève dispose d'un temps proportionnel au temps restant avant la séance.",
    },
    submit: 'Enregistrer',
    auto_cancellation_type: {
      title: "Gestion de la liste d'attente",
    },
  },
  explainWaitingListConf:
    "ex: Il reste 3h avant la séance, l'élève dispose de {{ nbMinutesBeforeBookingOptionExpire }} minutes pour valider sa réservation avant de laisser sa place.",
  dialog: {
    delete: {
      title: "Suppression de la liste d'attente",
      content:
        "Êtes-vous sûr de vouloir supprimer ce membre de la liste d'attente ? Il sera notifié par email.",
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
};
