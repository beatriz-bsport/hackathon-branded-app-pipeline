export default {
  form: {
    dumb_delay_minutes: {
      label: 'Gestion simple',
      helper:
        "Si une place se libère, le client dispose de N minutes pour s'inscrire, avant que le prochain ne prenne sa place.",
    },
    smart_delay_percentage: {
      label: 'Gestion intellligente',
      helper:
        "Si une place se libère, le client dispose d'un temps proportionnel au temps restant avant la séance.",
    },
    submit: 'Envoyer',
    auto_cancellation_type: {
      title: "Gestion de la liste d'attente",
    },
  },
  explainWaitingListConf:
    'ex: Il reste 3h avant la séance, le client dispose de {{ nbMinutesBeforeBookingOptionExpire }} minutes pour valider sa réservation avant de laisser sa place.',
};
