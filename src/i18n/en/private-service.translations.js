export default {
  serviceGroup: {
    delete: 'Delete',
    edit: 'Edit',
    isEmpty: 'No appointment type associated to this category',
    selector: {
      placeholder: 'Category',
    },
    form: {
      title: 'Category',
      name: {
        label: 'Name',
      },
      actions: {
        cancel: 'Cancel',
        submit: 'Save',
      },
    },
  },
  availabilitySlot: {
    form: {
      resourceSelector: {
        title: 'Slot modification',
        label: 'Modify for:',
        cancel: 'Cancel',
        submit: 'Save',
      },
    },
  },
  resource: {
    form: {
      color: 'Color code',
      actions: {
        cancel: 'Cancel',
        submit: 'Save',
      },
    },
    groupBy: 'Group by',
    unGroup: 'None',

    datatype: {
      establishment: 'Location',
      coach: 'teacher',
      associated_establishment: 'Locations',
      associated_coach: 'Teacher',
      private_service: 'General',
    },
  },
  pageTitles: {
    passList: 'Pass',
    serviceList: 'Appointments',
    calendar: 'Calendar',
  },
  color: {
    form: {
      title: 'Teacher color code',
      cancel: 'Cancel',
      submit: 'Save',
    },
  },
  payment: {
    address: {
      explain: 'Specify your address for at-home course',
      save: 'Save',
    },
  },
  privateSlot: {
    delete: {
      title: 'Slot deletion',
      explain:
        'Are you sure you want to delete this slot ? Past bookings will not be deleted. This operation is not revertable.',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  privateBooking: {
    cancel: 'Cancel',
    hardDelete: 'Delete',
    isCancelled: 'Cancelled',
    detail: {
      title: 'Booking',
      registeredOn: 'Booked on ',
      source: 'Booking via ',
      slotTitle: 'Session',
      passTitle: 'Pass',
      wasRefunded: 'Credit refunded on the pass',
      wasRefundedYes: 'Yes',
      wasRefundedNo: 'No',
      address: 'Address',
    },
    managerAdd: {
      title: 'New booking',
      address: 'Address',
      coachSelector: {
        label: 'Teacher',
      },
      pleaseSelectCoachAndSlot: 'Select teacher and slot first',
      cancel: 'Cancel',
      compatiblePrivatePass: 'Bill an appointment pass',
      compatiblePrivateConsumerPass: 'Appointment pass owned:',
      emptyPrivateConsumerPass: 'No appointment pass owner',
      emptyPrivatePass: 'No appointment pass compatible',
      privateConsumerPassNeedRefresh: 'Refresh list',
    },
    delete: {
      title: 'Cancel booking',
      explain:
        'Are you sure you want to cancel this booking ? This operation is not revertable.',
      explainHardDelete:
        'This booking has already been canelled, deleting it will make it disappear totally from the calendar and you will lose the history report. If not it will be refunded on member pass. This operation is not revertable.',
      explainForceRefund:
        'Refund used credit on the pass to allow for a new booking.',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
  },
  privateService: {
    delete: {
      title: 'Appointment deletion',
      explain:
        'Are you sure you want to delete this appointment ? This modification is not revertable. Past booking wont be deleted.',
      cancel: 'Cancel',
      submit: 'Delete',
      confirm: 'Delete',
    },
  },
  calendar: {
    enableAvailability: 'Add an availability slot this day',
    disableAvailability: 'Cancel an availability',
    enableRecurrentAvailability: 'Add a recurrent availability',
    disableRecurrentAvailability: 'Cancel a recurrent availability',
    selectCoachToModifyAvailability: 'Select a teacher',
    addBooking: 'Register an appointment',

    toogle: {
      showOfferList: 'Show group classes',
      showPrivateBookings: 'Show appointments',
    },

    form: {
      title: {
        enable: 'Add an availability',
        disable: 'Cancel an availability',
      },
      explain: 'Modify until :',
      interval: {
        explain1: 'Modify the availability : ',
        explain2: '{{ date_start }} - {{ date_end }}, every {{ day }}',
      },
      actions: {
        cancel: 'Cancel',
        submit: 'Save',
      },
    },
  },
  selector: {
    privateService: 'Select your appointment',
    privateSlot: 'Select your session',
  },
  slotSearcher: {
    title: 'Appointment',
    searchSlot: 'Look for a slot',
    selectPrivateSlot: 'Select a session',
    search: 'Look for a slot',
    selectCoach: 'All teachers',
    emptyDateList: 'No slot available this day',
    bookableSlots: {
      title: 'Available slots',
      isEmpty: 'No available slot',
    },
  },
  slot: {
    parameters: {
      credit: '{{ credit }} credit',
    },
    form: {
      title: 'Session',
      name: {
        label: 'Session name',
        placeholder: 'Double session (2h)',
      },
      people_capacity_used: {
        label: 'People nb',
        helperText:
          'If a room is configured, this number will be used to update its available capacity',
      },
      credit: {
        label: 'Credit number',
        helperText: 'Number of credit needed for an appointment',
      },
      duration_minutes: {
        label: 'Duration',
        helperText: 'Adapt credit needed in function of the duration',
      },
      cancel: 'Cancel',
      submit: 'Save',
    },
  },
  bookerModule: {
    availableSlots: 'Available slots',
    emptySlot: 'No slot available',
    missingResource: {
      service: 'Please select an appointment type',
      coach: 'Please select a teacher',
      establishment: 'Please select a location',
    },
    cancel: 'Cancel',
    title: 'Appointment registration',
    error: 'Impossible to book on this date',
    searchSlot: 'Look for a slot',
    noPrivateServiceAvailable: 'No appointment available',
    isAtHome:
      'Home service, your address will be asked during the registration',
    bookingCapabilities: {
      compatibleConsumerPassTitle: 'Your compatible pass',
      emptyConsumerPassList: 'You do not own a valid pass with enough credit',
      compatiblePassTitle: 'Compatible pass with this session',
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
      actions: {
        submit: 'Enregistrer',
        cancel: 'Annuler',
      },
    },
  },
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
      noFutureSlot:
        "Vous n'avez configuré aucune disponibilité pour {{resourceName}} ! Cliquez ici.",
      title: 'Disponibilités horaires',
      isAlwaysAvailable:
        '{{ resourceName}} est réservable dès que la salle et/ou les profs sont disponibles',
      changeIsAlwaysAvailable: 'Modifier',
    },
    form: {
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
      establishments: {
        title: 'Lieu',
        is_empty: 'A domicile',
      },
      slots: {
        title: 'Séance',
        isEmpty: 'Aucune type de séance définie',
        explainIsEmpty: 'Définissez des types de séances (durée, coût)',
      },
    },
  },
};
