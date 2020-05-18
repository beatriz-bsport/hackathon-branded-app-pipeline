exports.default = {
  serviceGroup: {
    delete: 'Supprimer',
    edit: 'Modifier',
    isEmpty: 'Aucun RDV associé à cette catégorie',
    selector: {
      placeholder: 'Catégorie',
    },
    form: {
      title: 'Catégorie',
      name: {
        label: 'Nom',
      },
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
  },
  availabilitySlot: {
    form: {
      resourceSelector: {
        title: 'Modification créneau horaire',
        label: 'Modifier pour :',
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
  },
  resource: {
    form: {
      color: 'Code couleur',
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    groupBy: 'Grouper par',
    unGroup: 'Aucun',

    datatype: {
      establishment: 'Lieux',
      coach: 'Professeur',
      associated_establishment: 'Lieux',
      associated_coach: 'Professeur',
      private_service: 'Général',
    },
  },
  pageTitles: {
    passList: 'Cartes',
    serviceList: 'Sur rendez-vous',
    calendar: 'Calendrier',
  },
  color: {
    form: {
      title: 'Code couleur du professeur',
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
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
    hardDelete: 'Supprimer',
    isCancelled: 'Annulé',
    detail: {
      title: 'Réservation',
      registeredOn: 'Réservé le ',
      source: 'Canal de réservation ',
      slotTitle: 'Séance',
      passTitle: 'Carte de cours',
      wasRefunded: 'Crédit remboursé sur la carte de cours',
      wasRefundedYes: 'Oui',
      wasRefundedNo: 'Non',
      address: 'Adresse',
    },
    managerAdd: {
      title: 'Nouvelle réservation',
      address: 'Adresse',
      coachSelector: {
        label: 'Professeur',
      },
      pleaseSelectCoachAndSlot:
        "Sélectionnez tout d'abord le professeur et la séance",
      cancel: 'Annuler',
      compatiblePrivatePass: 'Facturer une carte RDV',
      compatiblePrivateConsumerPass: 'Cartes RDV possédées :',
      emptyPrivateConsumerPass: 'Aucune carte compatible possédée',
      emptyPrivatePass: 'Aucune carte RDV compatible',
      privateConsumerPassNeedRefresh: 'Rafraîchir la liste',
    },
    delete: {
      consumer: {
        title: 'Annulation réservation',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        content: {
          discardable:
            'Êtes-vous sûr de vouloir annuler ce rendez-vous ? Vos crédits seront de nouveau disponibles.',
          notDiscardable:
            'Êtes-vous sûr de vouloir annuler ce rendez-vous ? Vous êtes hors-délai, vos crédits ne seront pas recrédités.',
        },
      },
      title: 'Annulation réservation',
      explain:
        'Êtes- vous sûr de vouloir annuler cette réservation ? Cette opération est irréversible.',
      explainHardDelete:
        "Cette réservation a déjà été annulée, la supprimer la fera disparaitre du calendrier totalement et vous perdrez l'historique. Elle sera remboursée si elle ne l'a pas été précédemment. Cette opération est irréversible.",
      explainForceRefund:
        'Rembourser le crédit utilisé sur la carte pour permettre une nouvelle réservation.',
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },
  privateService: {
    delete: {
      title: 'Suppression du rendez-vous',
      explain:
        'Êtes-vous sûr de vouloir supprimer ce RDV ? Cette modification est définitive. Les réservations déjà enregistrées ne seront pas affectées.',
      cancel: 'Annuler',
      submit: 'Supprimer',
      confirm: 'Supprimer',
    },
  },
  privateCoach: {
    delete: {
      title: 'Désinscription du professeur',
      explain:
        "Êtes-vous sûr de vouloir supprimer l'affectation de ce professeur ? Il ne pourra plus prendre de réservation sur ce RDV. Les réservations enregistrées ne seront pas affectées.",
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
  privateEstablishment: {
    delete: {
      title: 'Désinscription de la salle',
      explain:
        'Êtes-vous sûr de vouloir modifier le lieu de ce RDV ? Sans établissement il sera considéré comme un RDV à domicile et les élèves devront rentrer leur adresse pour terminer la réservation. Les réservations déjà enregistrées ne seront pas affectées.',
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
  calendar: {
    header: {
      threeDaysView: '3 jours',
    },
    enableAvailability: 'Ajouter une disponibilité ce jour',
    disableAvailability: 'Supprimer la disponibilité',
    enableRecurrentAvailability: 'Ajouter une disponibilité récurrente',
    disableRecurrentAvailability: 'Supprimer une disponibilité récurrente',
    selectCoachToModifyAvailability: 'Sélectionnez un professeur',
    addBooking: 'Enregistrer un rendez-vous',

    toogle: {
      showOfferList: 'Afficher les cours collectifs',
      showPrivateBookings: 'Afficher les rendez-vous',
    },

    form: {
      title: {
        enable: 'Ajouter une disponibilité',
        disable: 'Supprimer une disponibilité',
      },
      explain: "Modification jusqu'au :",
      interval: {
        explain1: 'Modification de la disponibilité : ',
        explain2: '{{ date_start }} - {{ date_end }}, tous les {{ day }}',
      },
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
  },
  selector: {
    privateService: 'Sélectionnez votre RDV',
    privateSlot: 'Sélectionnez votre séance',
  },
  slotSearcher: {
    title: 'Rendez-vous',
    searchSlot: 'Rechercher un créneau',
    selectPrivateSlot: 'Sélectionner une séance',
    search: 'Rechercher un créneau',
    selectCoach: 'Tous les professeurs',
    emptyDateList: 'Aucun créneau disponible ce jour',
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
        placeholder: 'Séance double (2h)',
      },
      booking_interval_minutes: {
        label: 'Avancé : intervalle de choix de réservation',
        helperText:
          'Ex: 15 signifie 15 minutes que le membre peut réserver à 12h, 12h15, 12h30, etc... (recommandé)',
      },
      people_capacity_used: {
        label: 'Nombre de personnes',
        helperText:
          'Si une salle est configurée, ce nombre sera utilisé pour mettre à jour son remplissage',
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
    address: {
      label: 'Adresse',
      submit: 'Valider',
      helperText: 'Entrez votre adresse pour pouvoir réserver ce rendez-vous',
    },
    availableSlots: 'Créneaux disponibles',
    emptySlot: 'Aucune disponibilité',
    missingResource: {
      service: 'Veuillez sélectionner un type de rendez-vous',
      coach: 'Veuillez sélectionner le professeur',
      establishment: 'Veuillez sélectionner le lieu',
    },
    cancel: 'Annuler',
    title: 'Réservation RDV',
    error: 'Impossible de réserver sur cette date',
    searchSlot: 'Rechercher un créneau',
    noPrivateServiceAvailable: 'Aucun RDV proposé',
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
      configuration: 'Mon rendez-vous',
      billing: 'Facturation',
      privateService: 'Rendez-vous',
      privateSlot: 'Séance',
      coach: 'Professeur',
      date: 'Date',
    },
  },
  consumerPass: {
    expiresOn: 'Expire le {{ date }}',
    current_credits: '{{ current_credits }}/{{credits}} crédits',
    isReverted: 'Facture annulée',
    detail: {
      invoice: 'Facture liée',
      booking: 'Réservations RDV liées',
    },
  },
  privateServiceCompatibility: {
    delete: {
      title: 'Modification RDV compatibles',
      explain:
        "Êtes-vous sûr de vouloir modifier les règles d'utilisation du pass ? Cette modification est rétro-active pour les achats déjà effectués.",
      cancel: 'Annuler',
      submit: 'Supprimer',
    },
  },
  privatePass: {
    validForDuration: {
      days: 'Valide {{ duration_days }} jours',
      months: 'Valide {{ duration_months }} mois',
      years: 'Valide {{ duration_years }} an',
      general:
        'Valide {{ duration_days }} jours {{ duration_months }} mois et {{ duration_years }} an',
    },
    delete: {
      title: 'Suppression de la carte',
      explain:
        'Êtes-vous sûr de vouloir supprimer cette carte ? Les personnes possédant encore des crédits pourront toujours les utiliser. Cette opération est définitive',
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
    list: {
      createButton: 'Créer une carte RDV',
    },
    parameters: {
      nbCredits: '{{ credits }} crédit',
      price: '{{ price}} €',
      tax: 'TVA: {{ tax }}%',
      managerOnly: 'Invisible pour les clients',
    },
    compatibleServices: {
      title: 'RDV compatibles',
      add: 'Ajouter',
      isEmpty: "Aucun rendez-vous n'est compatible - inutilisable",
    },
    form: {
      title: 'Carte RDV',
      managerOnly: {
        label: 'Invisible pour les clients',
      },
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
      durationDays: {
        label: 'Durée de validité (jours) si applicable',
        helperText:
          'Période en jours pour laquelle la carte sera valide après achat ',
      },
      durationMonths: {
        label: 'Durée de validité (mois) si applicable',
        helperText: "S'ajoute au nombre de jours",
      },
      durationYears: {
        label: 'Durée de validité (années) si applicable',
        helperText: "S'ajoute au nombre de jours et de mois",
      },
      available_payment_method_identifiers: {
        label: 'Moyens de paiement autorisés',
        helperText:
          'Sélectionnez au moins un moyen de paiement. Si le panier du membre contient des éléments dont les moyens de paiements sont incompatibles, le paiement CB sera proposé.',
      },
      actions: {
        submit: 'Enregistrer',
        cancel: 'Annuler',
      },
    },
  },
  openCalendar: 'Voir le calendrier',
  service: {
    selector: {
      placeholder: 'Sélectionnez un rendez-vous',
      isEmpty: 'Aucun type de rendez-vous configuré',
      coach: {
        label: 'Professeur',
      },
      establishment: {
        label: 'Salle',
      },
    },
    detail: {
      tab: {
        general: 'Général',
        calendar: 'Calendrier',
      },
    },
    configuration: {
      slot: 'Type de séance',

      explainSetToHasNotOwnAvailabilitySlots:
        'Réservable sur tout créneau horaire si prof/salle disponibles',
      explainSetToHasOwnAvailabilitySlots:
        'Reservable sur certains créneaux seulement',
      explainHasOwnAvailabilitySlots:
        'Cliquez sur le crayon pour limiter les réservations à certaines plages horaires',
      hasFutureSlot: 'Calendrier des disponibilités futures OK',
      noCapacity: 'Capacité de la salle non-configurée !',
      totalCapacity: 'Capacité maximale : {{ capacity}}',
      noFutureSlot:
        "Vous n'avez configuré aucune disponibilité pour {{resourceName}} ! Cliquez ici.",
      title: 'Disponibilités horaires',
      isAlwaysAvailable:
        '{{ resourceName}} est réservable dès que la salle et/ou les profs sont disponibles',
      changeIsAlwaysAvailable: 'Modifier',
    },
    form: {
      last_discard_minutes: {
        label: "Dernière annulation remboursable jusqu'à",
        helperText:
          'Si la réservation est annulée hors délai le crédit ne sera pas remboursé',
      },
      establishmentResourceType: {
        isHomeService: {
          label: 'A domicile',
          helperText: 'Une adresse sera demandé à chaque réservation',
        },
        isWithoutEstablishment: {
          label: 'Sans lieu pré-déterminé',
          helperText: 'Ex: cours en visio / en extérieur / ...',
        },
        isWithEstablishment: {
          isEmpty: 'Aucune salle configurée !',
          label: "Dans l'un de vos établissements",
          helperText:
            'La réservation ne sera possible que si la salle dispose de suffisamment de places libres',
        },
      },
      resourceGroup: {
        establishment: 'Lieu',
        coach: 'Professeur',
      },
      coach_consumer_attribution: {
        label: 'Permettre le choix du professeur lors de la réservation',
        helperText:
          "Le membre voit et choisit le professeur avant la réservation. Si décoché, bsport d'attribuer les réservations au même professeur si possible",
      },
      establishment_consumer_attribution: {
        label: 'Permettre le choix du lieu lors de la réservation',
        helperText:
          "Le membre voit et choisit le lieu avant la réservation, si décoché bsport essaiera d'optimiser le remplissage des salles",
      },
      delete: {
        title: 'Suppression du rendez-vous',
        content:
          'Êtes-vous certain de vouloir supprimer ce type de rendez-vous ?',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      coach_capacity_used: {
        label: "Nb maximum de RDV simultanés qu'un professeur peut gérer",
        helperText:
          'Ex: un professeur peut surveiller deux élèves séparément sur deux machines ',
      },
      color: 'Code couleur',
      use_full_establishment_capacity: {
        label: 'Nécessite toute la salle',
        helperText:
          'Décochez pour autoriser simultanément plusieurs activités / rdv dans la même salle si la capacité le permet',
      },
      title: 'Rendez-vous',
      createButton: 'Ajouter un type de Rendez-vous',
      addCoach: 'Ajouter un professeur',
      addEstablishment: 'Ajouter une salle',
      addSlot: 'Ajouter un type séance',

      is_home_service: {
        label: 'A domicile',
        helperText: 'Une adresse sera demandée à chaque réservation',
      },
      is_without_coach: 'Sans professeur',

      name: {
        label: 'Nom du service',
        placeholder: 'Massage',
      },
      coach: {
        label: 'Professeur',
        isEmpty: 'Aucun professeur configuré !',
      },
      establishment: {
        label: 'Salle',
      },
      description: {
        label: 'Description du service',
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
        is_empty: "Aucun professeur n'est requis",
      },
      last_discard_minutes: {
        explain:
          'La dernière annulation remboursable est possible {{ days }} jour(s) {{ hours }} heure(s) {{ minute }} minute(s) avant le rendez-vous',
      },
      establishments: {
        title: 'Lieu',
        is_empty: 'Aucune salle',
        is_home_service: 'A domicile',
      },
      slots: {
        title: 'Séance',
        isEmpty: 'Aucune type de séance définie',
        explainIsEmpty: 'Définissez des types de séances (durée, coût)',
      },
    },
  },
};
