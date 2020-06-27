const {
  WAITING_LIST_DYNAMIC_UNORDERED,
  WAITING_LIST_DYNAMIC_ORDERED,
} = require('@bsport/common/lib/master-data/waiting-list-dynamic');

exports.default = {
  switchToEnable: "Réactiver la liste d'attente",
  switchToDisable: "Désactiver la liste d'attente",
  nbPending: '{{ nbPending }} sur liste',
  nbConvertible: '{{ nbConvertible }} en attente de confirmation',
  form: {
    dynamic: {
      label: "Gestion des priorité de la liste d'attente",
      [WAITING_LIST_DYNAMIC_UNORDERED]: {
        label: 'Premier arrivé premier servi',
        explain:
          "La liste d'attente n'est pas ordonnée. Lorsqu'une place est disponible toutes les personnes sur liste reçoivent au même moment un email les invitant à s'inscrire.",
      },
      [WAITING_LIST_DYNAMIC_ORDERED]: {
        label: 'Chacun son tour',
        settingsDelay: "Délai pour s'inscrire",
        explain:
          "Lorsqu'un membre s'inscrit, une place dans la liste d'attente lui est accordée. Lorsqu'une place est disponible le premier inscrit sur liste peut s'inscrire, les autres attendent leur tour",
      },
    },
    autokick_delay: {
      label: "Retrait automatique de la liste d'attente",
      helper:
        "Nombre de relances avant lequel le membre est automatiquement retiré de la liste d'attente si aucune action de sa part",
    },
    is_option_blocking: {
      label:
        "Prioriser les personnes sur liste d'attente aux nouveaux inscrits",
      helper:
        "Tant qu'un membre est sur liste d'attente, une place est bloquée pour lui en attendant qu'il s'inscrive.",
    },
    auto_consume_pack: {
      label:
        "Automatiquement débiter une carte de cours et inscrire le membre lorsqu'une place se libère.",
      helper:
        "Si le membre possède une carte de cours valide lorsqu'une place se libère, il est automatiquement inscrit et sa carte débitée. La carte expirant le plus tôt, et avec le moins de crédit disponible, est utilisée en priorité.",
    },
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
