export default {
  pageTitles: {
    passList: 'Cartes de cours',
    serviceList: 'Cours privés',
    calendar: 'Calendrier',
  },
  payment: {
    address: {
      explain: 'Entrez votre adresse pour le cours à domicile',
      save: 'Enregistrer',
    },
  },
  privateSlot: {
    delete: {
      title: 'Suppression de la séance',
      explain:
        'Êtes-vous sûr de vouloir supprimer cette séance ? Les réservations passées ne seront pas affectées. Cette opération est définitive.',
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },
  privateBooking: {
    cancel: 'Annuler',
    isCancelled: 'Annulé',
    delete: {
      title: 'Annulation réservation',
      explain:
        'Êtes- vous sûr de vouloir annuler cette réservation ? Cette opération est irréversible.',
      explainForceRefund:
        'Rembourser le crédit utilisé sur la carte pour permettre une nouvelle réservation.',
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },
  privateService: {
    delete: {
      title: 'Suppression du cours',
      explain:
        'Êtes-vous sûr de vouloir supprimer ce cours ? Cette modification est définitive. Les réservations déjà enregistrées ne seront pas affectées.',
      cancel: 'Annuler',
      submit: 'Supprimer',
      confirm: 'Supprimer',
    },
  },
  privateCoach: {
    delete: {
      title: 'Désinscription du professeur',
      explain:
        "Êtes-vous sûr de vouloir supprimer l'affectation de ce professeur ? Il ne pourra plus prendre de réservation sur ce cours. Les réservations enregistrées ne seront pas affectées.",
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
  privateEstablishment: {
    delete: {
      title: 'Désinscription de la salle',
      explain:
        'Êtes-vous sûr de vouloir modifier le lieu de ce cours ? Sans établissement il sera considéré comme un cours à domicile et les élèves devront rentrer leur adresse pour terminer la réservation. Les réservations déjà enregistrées ne seront pas affectées.',
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
  calendar: {
    enableAvailability: 'Ajouter une disponibilité ce jour',
    disableAvailability: 'Supprimer la disponibilité',
    enableRecurrentAvailability: 'Ajouter une disponibilité récurrente',
    disableRecurrentAvailability: 'Supprimer une disponibilité récurrente',

    form: {
      title: {
        enable: 'Ajouter une disponibilité',
        disable: 'Supprimer une disponibilité',
      },
      explain: "Modification jusqu'au :",
      interval: {
        explain1: 'Modification du créneau: ',
        explain2: '{{ date_start }} - {{ date_end }}, tous les {{ day }}',
      },
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },

    input: {
      coach: {
        label: 'Professeur',
      },
    },
  },
  selector: {
    privateService: 'Sélectionnez votre cours',
    privateSlot: 'Sélectionnez votre séance',
  },
  slotSearcher: {
    title: 'Inscription cours privé',
    searchSlot: 'Rechercher un créneau',
    selectPrivateSlot: 'Sélectionner un cours',
    search: 'Rechercher un créneau',
    bookableSlots: {
      title: 'Créneaux disponibles',
      isEmpty: 'Aucun créneau disponible',
    },
  },
  slot: {
    parameters: {
      credit: '{{ credit }} crédit',
    },
    form: {
      title: 'Séance',
      name: {
        label: 'Nom de la séance',
        helperText: 'Ex: 1h intensif',
      },
      credit: {
        label: 'Nombre de crédit',
        helperText: 'Nombre de crédit nécessaire pour une réservation',
      },
      duration_minutes: {
        label: 'Durée',
        helperText: 'Adapter les crédits nécessaire en fonction de la durée',
      },
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
  },
  bookerModule: {
    title: 'Réservation cours privé',
    error: 'Impossible de réserver sur cette date',
    searchSlot: 'Rechercher un créneau',
    noPrivateServiceAvailable: 'Aucun cours privé proposé',
    isAtHome:
      'Cours à domicile, votre adresse vous sera demandée lors de la réservation',
    bookingCapabilities: {
      compatibleConsumerPassTitle: 'Vos cartes valables',
      emptyConsumerPassList:
        'Vous ne possédez pas de cartes valable avec suffisamment de crédit',
      compatiblePassTitle: 'Cartes valables sur cette séance',
      emptyPassList: 'Aucune carte compatible, veuillez contacter votre club',
    },
    useCredit: 'Réserver',
    private_pass: {
      credits: '{{ credits }} crédit',
    },
    buyPass: '{{ price }}€',
    preview: {
      credit_cost: '{{credit_cost}} crédit',
    },
    sections: {
      establishment: 'Lieu',
      privateSlot: 'Séances',
      coach: 'Professeur',
    },
    step: {
      privateService: 'Cours',
      privateSlot: 'Séance',
      coach: 'Professeur',
      date: 'Date',
    },
  },
  consumerPass: {
    current_credits: '{{ current_credits }}/{{credits}} crédits',
  },
  privateServiceCompatibility: {
    delete: {
      title: 'Modificatio cours privés compatibles',
      explain:
        "Êtes-vous sûr de vouloir modifier les règles d'utilisation du pass ? Cette modification est rétro-active pour les achats déjà effectués.",
      cancel: 'Annuler',
      submit: 'Supprimer',
    },
  },
  privatePass: {
    delete: {
      title: 'Suppression de la carte',
      explain:
        'Êtes-vous sûr de vouloir supprimer cette carte ? Les personnes possédant encore des crédits pourront toujours les utiliser. Cette opération est définitive',
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
    list: {
      createButton: 'Créer une carte',
    },
    parameters: {
      nbCredits: '{{ credits }} crédit',
      price: '{{ price}} €',
      tax: 'TVA: {{ tax }}%',
    },
    compatibleServices: {
      title: 'Cours privés compatibles',
      add: 'Ajouter',
      isEmpty: 'Aucun cours compatible - inutilisable',
    },
    form: {
      title: 'Carte cours privé',
      name: {
        label: 'Nom',
      },
      credits: {
        label: 'Nombre de crédit inclu',
        helperText: 'Chaque séance coûte un certain nombre de crédit',
      },
      price: {
        label: 'Prix',
      },
      tax: {
        label: 'TVA',
      },
      actions: {
        submit: 'Enregistrer',
        cancel: 'Annuler',
      },
    },
  },
  service: {
    form: {
      title: 'Séance privée',
      createButton: 'Ajouter un cours',
      addCoach: 'Ajouter un professeur',
      addEstablishment: 'Ajouter une salle',
      addSlot: 'Ajouter une séance',

      name: {
        label: 'Nom',
        placeholder: 'Massage',
      },
      coach: {
        label: 'Professeur',
      },
      establishment: {
        label: 'Salle',
      },
      description: {
        label: 'Description',
      },
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    parameters: {
      description: 'Description',
      coaches: {
        title: 'Professeur',
        isEmpty: 'Aucun professeur, aucune réservation possible',
      },
      establishments: {
        title: 'Lieu',
        isEmpty:
          "Aucun établissement, ce cours sera considéré à domicile et l'adresse sera demandé à l'élève à chaque réservation",
      },
      slots: {
        title: 'Séance',
        isEmpty: 'Aucune séance, aucune réservation possible',
      },
    },
  },
};
