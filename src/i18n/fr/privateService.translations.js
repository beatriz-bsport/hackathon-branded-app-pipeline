exports.default = {
  seeAll: 'Tout voir',
  privatePassTemplateInstance: {
    privatePassSharedFromFranchisor: 'Carte franchise',
    privateConsumerPassSharedFromOtherFranchisee: 'Partagé depuis franchisé',
    form: {
      title: 'Configurer mes studios',
      explain1:
        'Les studios suivant auront automatiquement cette carte disponible à la vente. Ils ne pourront pas en modifier le prix ni le nombre de crédit.',
      explain2:
        "Si un membre achète cette carte dans l'un des studios compatible, il pourra également l'utiliser dans les autres studios que vous avez défini.",
      actions: {
        close: 'Fermer',
        submit: 'Enregistrer',
      },
    },
    deleteForm: {
      title: 'Désactivation',
      content:
        "En désactivant ce studio du partage de la carte, tous les membres possédant cette carte et l'ayant acheté dans ce studio pourront toujours l'utiliser. En revanche ils ne pourront plus l'utiliser dans les autres studios. Enfin, les cartes ayant achetées dans les autres studios ne seront plus utilisable dans le studio désactivé, quelle que soit la date d'achat.",
      actions: {
        close: 'Fermer',
        submit: 'Désactiver le partage',
      },
    },
    companyEmpty:
      "Aucun studio n'est configuré pour accepter cette carte de cours",
    actions: {
      addCompany: 'Ajouter un studio',
    },
  },
  privatePassTemplate: {
    specification: {
      companySharedWithTitle: 'Partagée avec les studios:',
    },
    isEmptyExplain:
      "Les cartes de cours partagées sont disponibles dans les studios de votre choix, et permettent à vos membres d'utiliser indifféremment leurs crédits dans les studios que vous auez choisi.",
    section: {
      titleAvailable: 'Disponible à la vente',
      titleManagerOnly: 'Indisponible à la vente',
    },
    form: {
      title: 'Carte de cours partagée',
      close: 'Fermer',
      submit: 'Valider',
      actions: {
        close: 'Fermer',
        submit: 'Enregistrer',
      },
    },
    deleteForm: {
      title: 'Désactivation',
      content:
        "En désactivant une carte partagée, les membres possédant cette carte ne pourront plus l'utiliser que dans le studio dans lequel il l'ont acheté.",
      actions: {
        close: 'Fermer',
        submit: 'Désactiver le partage',
      },
    },
    actions: {
      create: 'Créer une carte partagée',
    },
  },
  search: 'Rechercher un rendez-vous',
  searshAppointmentPass: 'Rechercher une carte RDV',
  marketplace: {
    isEmpty: 'Aucun RDV proposé',
  },
  popup: {
    validate: 'Valider',
    button: 'Horaires',
    begin: 'Heure de début',
    end: 'Heure de fin',
  },
  filters: {
    all: 'Toutes les cartes',
    expiration: 'Validité',
    credits: 'Crédit',
    notReverted: 'Facture non-annulée',
    reverted: 'Facture annulée',
    invoice: 'Facture',
    isExpired: 'Expirée',
    isActive: 'Active',
    hasCreditLeft: 'Avec crédit',
    hasCreditNull: 'Sans crédit',
  },
  noPrivateConsumerPass: "Personne n'a cette carte de rendez-vous",
  noPrivatePass:
    'Les cartes RDV permettent aux membres de prendre RDV, définissez ici vos tarifs et modalités.',
  noPrivateService:
    'Un rendez-vous est réservable sur le créneau que vous avez choisi, par le membre.',
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
    coach: 'Professeur',
    establishment: 'Lieu',
    private_service: 'Type de Rendez-vous',
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
    allocationWarning: {
      coach: "Ce professeur n'est pas disponible sur cet horaire",
      establishment: "Cette salle n'est pas disponible à cet horaire",
      showCalendar: 'Voir le calendrier',
    },
    selector: {
      title: 'Voir les disponibilités',
    },
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
      establishment: 'Salle',
      coach: 'Professeur',
      associated_establishment: 'Salle',
      associated_coach: 'Professeur',
      private_service: 'Général',
    },
  },
  pageTitles: {
    passList: 'Cartes de rendez-vous',
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
    duration: '{{ minutes }} minutes',
    delete: {
      title: 'Suppression de la séance',
      explain:
        'Êtes-vous sûr de vouloir supprimer cette séance ? Les réservations passées ne seront pas affectées. Cette opération est définitive.',
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },
  privateBooking: {
    bookings: 'Rendez-vous',
    editTime: 'Modifier',
    updateTime: {
      title: 'Modification rendez-vous',
      explainEmail:
        "Un email sera automatiquement envoyé à l'élève pour le prévenir",
      submit: 'Enregistrer',
      cancel: 'Annuler',
    },
    updateCoach: 'Choisissez un nouveau professeur pour ce rendez-vous',
    cancel: 'Annuler',
    discard: 'Annuler le RDV',
    hardDelete: 'Supprimer',
    restore: 'Restaurer le RDV',
    isCancelled: 'Annulé',
    isCancelledDate: 'Annulé le {{-date}} à {{time}}',
    isRefunded: 'Remboursé',
    notRefunded: 'Non-Remboursé',
    isUnpaid: 'Impayé',
    bookingIsUnpaid: 'Réservation impayée',
    attachCoach: {
      title: 'Attribution au professeur',
      explain:
        "Choisissez un professeur pour lui attribuer ce RDV et l'ajouter à son calendrier",
      actions: {
        cancel: 'Annuler',
        title: 'Attribuer un professeur',
      },
    },
    detail: {
      title: 'Réservation',
      registeredOn: 'Réservé le ',
      cancelledOn: 'Annulé le ',
      source: 'Canal de réservation ',
      slotTitle: 'Séance',
      passTitle: 'Carte de cours',
      wasRefunded: 'Crédit remboursé sur la carte de cours',
      wasRefundedYes: 'Oui',
      wasRefundedNo: 'Non',
      address: 'Adresse',
      coach: 'Professeur',
      attachCoach: 'Attribuer à un professeur',
      unpaidBooking:
        'Le client a utilisé l’option pour payer plus tard. {{ credits}} crédit(s) seront automatiquement débités lors du prochain achat d’une carte compatible avec le RDV.',
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
      explainWithRestore:
        'Êtes- vous sûr de vouloir annuler cette réservation ? Vous pourrez annuler cette opération plus tard.',
      explainHardDelete:
        "Cette réservation a déjà été annulée, la supprimer la fera disparaitre du calendrier totalement et vous perdrez l'historique. Elle sera remboursée si elle ne l'a pas été précédemment. Cette opération est irréversible.",
      explainForceRefund:
        'Rembourser le crédit utilisé sur la carte pour permettre une nouvelle réservation.',
      sendCancellationMail:
        "Prévenir {{name}} de l'annulation du rendez-vous par mail",
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
        'Êtes-vous sûr de vouloir modifier le lieu de ce RDV ? Sans salle il sera considéré comme un RDV à domicile et les élèves devront rentrer leur adresse pour terminer la réservation. Les réservations déjà enregistrées ne seront pas affectées.',
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
    createCustomEvent: 'Créer un RDV perso',
    selectCoachToModifyAvailability: 'Sélectionnez un professeur',
    addBooking: 'Enregistrer un rendez-vous',

    customEvent: {
      dateStart: 'Date de début',
      dateEnd: 'Date de fin',
    },

    toogle: {
      showOfferList: 'Cours collectifs',
      showPrivateBookings: 'Rendez-vous',
      showCustomEvents: 'RDV perso',
      hideCancelledEvents: 'Afficher les annulations',
      title: 'Afficher les filtres',
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
    selectSession: 'Choisissez votre session',
    selectService: 'Choisissez un service',
    selectCoach: 'Tous les professeurs',
    coach: 'Professeur',
    establishment: 'Lieu',
    emptyDateList: 'Aucun créneau disponible ce jour',
    bookableSlots: {
      title: 'Créneaux disponibles',
      isEmpty: 'Aucun créneau disponible',
    },
    nbSlot: '{{ nbSlot }} créneau',
    nbSlot_plural: '{{ nbSlot }} créneaux',
    groupIdentifier: {
      morning: {
        label: 'Matin',
        interval: 'Avant 12h',
      },
      noon: {
        label: 'Déjeuner',
        interval: '12h - 14h',
      },
      afternoon: {
        label: 'Après-midi',
        interval: '15h - 18h',
      },
      evening: {
        label: "Fin d'après midi",
        interval: 'Après 18h',
      },
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
      durationError: 'Durée invalide (entre 15min et 1j)',
      people_capacity_used: {
        label: 'Nombre de personnes',
        helperText:
          'Si une salle est configurée, ce nombre sera utilisé pour mettre à jour son remplissage',
      },
      credit: {
        label: 'Nombre de crédit(s)',
        helperText: 'Nombre de crédit(s) nécessaire(s) pour une réservation',
      },
      duration_minutes: {
        label: 'Durée',
        helperText: 'Adapter les crédits nécessaires en fonction de la durée',
      },
      cancel: 'Annuler',
      submit: 'Enregistrer',
      pre_selected_choices: 'Durées prédéfinies',
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
    confirm: 'Confirmer',
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
    unpaidBooking: {
      book: 'Réserver',
      helper: 'Réserver sans payer et acheter plus tard une carte compatible.',
      header: 'Payer plus tard',
      dialogHelper:
        'Avec cette option réservez votre séance sans la payer tout de suite. Lors de votre prochain achat d’une carte compatible avec cette séance, celle-ci sera automatiquement débitée de {{ credits }} crédit(s).',
      isUnpaid: 'Impayé',
    },
    useCredit: 'Réserver',
    private_pass: {
      credits: '{{ credits }} crédit',
    },
    buyPass: '{{ price, price }}',
    notifyMember: {
      label: 'Envoyer un email de confirmation',
    },
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
      rule: 'Rendez-vous récurrents',
    },
    recurrenceRule: {
      label: 'Programmez un RDV récurrent',
    },
  },
  consumerPass: {
    extension: {
      nbDaysAdded: '+{{nb_days}}j',
      addedOn: 'Ajouté le ',
      delete: {
        title: "Suppression de l'extension",
        explain: "Êtes-vous sûr de vouloir supprimer l'extension de validité ?",
        cancel: 'Annuler',
        confirm: 'Confirmer',
      },
      create: {
        title: "Extension d'une carte",
        cancel: 'Annuler',
        submit: 'Créer',
        explain: {
          oldDate: 'Ancienne date : ',
          newDate: 'Nouvelle date : ',
        },
        warning:
          "Vérifiez que la nouvelle date ne fait pas dépasser ce pass sur une nouvelle période fiscale. Si c'est le cas, vérifiez avec votre comptable la pertinence de cette opération.",
        note: {
          label: 'Notes',
        },
        nbDays: {
          label: 'Nombre de jours additionnels',
        },
      },
    },
    actions: {
      addExtension: 'Ajouter une extension',
    },
    expiresOn: 'Expire le {{ date }}',
    current_credits: '{{ current_credits }}/{{credits}} crédits',
    isReverted: 'Facture annulée',
    detail: {
      invoice: 'Facture liée',
      booking: 'Réservations RDV liées',
      extensionsTitle: 'Extensions de validité',
    },
    isFromShare: 'Partagé depuis un autre compte',
    isOwnerOfShares: 'Partagé (carte RDV maître)',
    isFromDisabledShare: 'Partage arrété',
  },
  privateServiceCompatibility: {
    allSlots: 'Compatible pour toutes les séances',
    forSlots: 'Les séances compatibles :',
    none: ' aucune',
    delete: {
      title: 'Modification RDV compatibles',
      explain:
        "Êtes-vous sûr de vouloir modifier les règles d'utilisation du pass ? Cette modification est rétro-active pour les achats déjà effectués.",
      cancel: 'Annuler',
      submit: 'Supprimer',
    },
    excludedSlots: {
      title: 'Séances du {{ service }}',
      submit: 'Enregistrer',
      isEmpty: 'Aucun type de séance configuré dans ce RDV!',
      cancel: 'Annuler',
      helperText:
        'Sélectionnez les sessions pour lesquelles la carte RDV est compatible',
    },
  },
  privatePass: {
    edit: 'Modifier',
    ht: 'Hors taxe',
    validForDuration: {
      days: 'Valide {{ duration_days }} jours',
      months: 'Valide {{ duration_months }} mois',
      years: 'Valide {{ duration_years }} an',
      general:
        'Valide {{ duration_days }} jours {{ duration_months }} mois et {{ duration_years }} an',
    },
    delete: {
      delete: 'Supprimer',
      title: 'Suppression de la carte',
      explain:
        'Êtes-vous sûr de vouloir supprimer cette carte ? Les personnes possédant encore des crédits pourront toujours les utiliser.',
      warning:
        'Attention ! Cette carte de rdv est utilisée dans un pack, celui-ci ne sera plus disponible à la vente si vous supprimez cette carte de cours.',
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
    list: {
      createButton: 'Créer une carte RDV',
      isEmpty: 'Aucune carte RDV',
      availableCustomer: 'Cartes disponibles à la vente',
      managerOnly: 'Cartes non disponibles à la vente',
    },
    parameters: {
      nbCredits: '{{ credits }} crédit',
      nbCredits_plural: '{{ credits }} crédits',
      price: '{{ price, price}}',
      tax: 'TVA: {{ tax }}%',
      managerOnly: 'Invisible pour les clients',
    },
    compatibleServices: {
      title: 'RDV compatibles',
      add: 'Ajouter',
      isEmpty: 'Aucun rendez-vous compatible',
      unusable: 'Inutilisable',
    },
    detailTitles: {
      credit_quantity: 'Nombre de crédits',
      validity: 'Validité',
      accessibility: 'Accessibilité',
      vod: 'VOD',
      privateServiceCompatibility: 'Rendez-vous compatibles',
      paymentMeans: 'Moyens de paiement',
    },
    form: {
      title: 'Carte de rendez-vous',
      franchise:
        'Cette carte est une carte partagée par le compte franchiseur. Certains éléments ont été définis par le compte franchiseur et ne sont pas modifiables',
      categoryTitle: {
        info: 'Informations générales',
        paymentMeans: 'Moyens de paiement',
        validity: 'Validité de la carte',
        compatibility: 'Compatibilité',
      },
      full_vod_access: {
        label: 'Donne accès à la VOD',
      },
      managerOnly: {
        label: 'Invisible pour les clients',
      },
      new_member_only: {
        label: 'Uniquement pour les nouveaux clients',
      },
      name: {
        label: 'Nom',
        helperText: 'Nom de la carte de cours',
      },
      category: 'Nom de la catégorie',
      credits: {
        label: 'Nombre de crédits inclus',
        helperText: 'Chaque séance coûte un certain nombre de crédits',
      },
      price: {
        label: 'Prix TTC',
        helperText: 'Prix de la carte pour le client',
      },
      tax: {
        label: 'TVA',
      },
      durationDays: {
        label: 'Durée de validité en jours',
      },
      durationMonths: {
        label: 'Durée de validité en mois',
        helperText: "S'ajoute au nombre de jours",
      },
      durationYears: {
        label: 'Durée de validité en années',
        helperText: "S'ajoute au nombre de jours et de mois",
      },
      duration: {
        fullText: 'Cette carte sera valide pendant ',
        valid: 'Valide ',
        days: '{{ count }} jour',
        days_plural: '{{ count }} jours',
        months: '{{ count }} mois',
        daysMonths: '{{ duration_months }} mois et {{ duration_days }} jours',
        years: '{{ count }} an',
        years_plural: '{{ count }} ans',
        and: ' et ',
      },
      available_payment_method_identifiers: {
        label: 'Moyens de paiement autorisés',
        helperText:
          'Sélectionnez au moins un moyen de paiement. Si le panier du membre contient des éléments dont les moyens de paiements sont incompatibles, le paiement CB sera proposé.',
        warning:
          'Rendez votre carte visible pour les clients pour pouvoir sélectionner les moyens de paiement.',
      },
      startDate: 'Date de début',
      start_date_method: {
        on_purchase: 'À la facturation',
        on_booking: 'À la 1ère réservation',
        on_attendance: 'À la 1ère présence',
      },
      start_date_method_detail: {
        on_purchase: " à partir de la date d'achat",
        on_booking: ' à partir de la première réservation',
        on_attendance: ' à partir de la première présence',
      },
      expirationDaysBeforeFirstUse: {
        label: 'Expiration si aucune réservation initiale',
        helperText:
          "Si la carte de cours n'est pas consommée une première fois pendant ce nombre de jours, elle sera rendue invalide.",
      },
      actions: {
        submit: 'Enregistrer',
        cancel: 'Annuler',
      },
      selector: {
        privateService: 'Ajouter un rendez-vous compatible',
      },
    },
    disabledTitle: 'Cartes de RDV archivées',
  },
  openCalendar: 'Voir le calendrier',
  service: {
    navigation: {
      goToPrivatePass: 'Cartes RDV',
    },
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
      managerOnly: {
        label: 'Invisible pour les clients',
      },
      last_discard_minutes: {
        label: "Dernière annulation remboursable jusqu'à",
        helperText:
          'Si la réservation est annulée hors délai le crédit ne sera pas remboursé',
      },
      last_booking_minutes: {
        label: 'Avant le début du rendez-vous, dernière réservation possible',
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
          label: "Dans l'une de vos salles",
          helperText:
            'La réservation ne sera possible que si la salle dispose de suffisamment de places libres',
        },
      },
      paddingTitle: 'Gestion des disponibilités',
      paddingStart: {
        label: 'Nombre de minutes avant le début du RDV',
        helperText:
          'Sur le calendrier, le professeur et/ou la salle seront marqués comme non disponibles {{minutes}} minutes avant le début du RDV',
        helperText0:
          "Sur le calendrier, le professeur et/ou la salle seront marqués comme non disponibles à l'heure de début du RDV",
      },
      paddingEnd: {
        label: 'Nombre de minutes après la fin du RDV',
        helperText:
          'Sur le calendrier, le professeur et/ou la salle seront de nouveau marqués comme disponibles {{minutes}} minutes après la fin du RDV',
        helperText0:
          "Sur le calendrier, le professeur et/ou la salle seront de nouveau marqués comme disponibles à l'heure de fin du RDV",
      },
      resourceGroup: {
        establishment: 'Lieu',
        coach: 'Professeur',
      },
      coach_consumer_attribution: {
        label: 'Permettre le choix du professeur lors de la réservation',
        helperText:
          'Le membre voit et choisit le professeur avant la réservation. Si décoché, vous devrez choisir le professeur après chaque prise de RDV',
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
      unpaidBooking: {
        title: 'Payer plus tard',
        label: 'Autoriser la réservation sans payer',
        helperText:
          'En activant cette fonctionnalité vos membres pourront réserver ce rendez-vous sans avoir à acheter/utiliser une carte. Le nombre de crédits du rendez-vous sera automatiquement débité de la prochaine carte compatible achetée.',
        tag: {
          header: 'Tags',
          helper:
            'Utilisez les tags pour rendre accessible la réservation sans payer seulement à certain membre.  Tous les membres possèdant un des tags dans “Autorisé” pourront réserver sans payer. Ou bien tous les membres possèdant un des tags dans “Non-autorisé” ne pourront pas réserver sans payer.',
          allowed: 'Autorisé',
          notAllowed: 'Non-autorisé',
          doNotSelectToAllowAllMembers:
            'Laisser vide pour autoriser à tous les membres',
        },
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
          'La dernière annulation remboursable est possible {{ days }} jour(s) {{ hours }} heure(s) {{ minutes }} minute(s) avant le rendez-vous',
      },
      last_booking_minutes: {
        explain:
          'Dernière réservation possible {{days}} jour(s) {{hours}} heure(s) {{minutes}} minute(s) avant le rendez-vous',
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
  customEvent: {
    actions: {
      delete: 'Supprimer',
    },
    form: {
      title: 'RDV perso',
      name: {
        label: 'Nom',
        placeholder: 'RDV banque',
      },
      color: 'Code couleur',
      coach: {
        isEmpty: 'Aucun professeur',
      },
      description: {
        label: 'Description',
        placeholder: 'Demander M. Charles au 1 Champs Elysées',
      },
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
  },
  privateBookingNotification: {
    form: {
      title: 'Ajouter une notification',
      intro:
        "Vous pouvez prévenir vos clients avant ou après certains RDV, en fonction de différents critères comme le nombre de réservations ou d'annulations.",
      chooseKind: {
        title: 'Choisissez le type de réservation que vous voulez notifier',
        valid: 'Réservation valide',
        cancelledRefunded: 'Réservation annulée et remboursée',
        cancelledNotRefunded:
          'Réservation annulée et non remboursée (hors délai)',
      },
      ifKind: {
        valid: 'Si la réservation est valide',
        refunded: 'Si la réservation a été annulée dans les temps',
        notRefunded: 'Si la réservation a été annulée hors-délai',
      },
      notifyNb: "Notifier le membre lors de l'évènement n° :",
      notifyAllEvents: 'Notifier le membre à chaque évènement',
      help: {
        valid: {
          default:
            'Aide : la notification sera envoyée au membre lors de sa réservation valide n° {{notifyNb}} pour ce type de RDV',
          notifyAll:
            'Aide : la notification sera envoyée au membre à chacune des ses réservations valides pour ce type de RDV',
        },
        cancelledRefunded: {
          default:
            'Aide : la notification sera envoyée au membre lors de sa réservation annulée remboursée n° {{notifyNb}} pour ce type de RDV',
          notifyAll:
            'Aide : la notification sera envoyée au membre à chacune des ses réservations annulées remboursées pour ce type de RDV',
        },
        cancelledNotRefunded: {
          default:
            'Aide : la notification sera envoyée au membre lors de son annulation hors délai n° {{notifyNb}} pour ce type de RDV',
          notifyAll:
            'Aide : la notification sera envoyée au membre à chacune des ses annulations hors délai pour ce type de RDV',
        },
      },
      chooseWhen: {
        title: 'Type de notification',
        beforeMail:
          'Envoyer le mail au membre avant le RDV concerné par la notification',
        beforeNotifications:
          'Envoyer les notifications au membre avant le RDV concerné par la notification',
        beforeNotification:
          'Envoyer la notification push au membre avant le RDV concerné par la notification',
        afterMail:
          'Envoyer le mail au membre après le RDV concerné par la notification',
        afterNotifications:
          'Envoyer les notifications au membre après le RDV concerné par la notification',
        afterNotification:
          'Envoyer la notification push au membre après le RDV concerné par la notification',
      },
      chooseTime: {
        title: 'Paramètres',
        first: 'Envoyer un mail',
        second: {
          before: 'heure(s) avant la séance',
          after: 'heure(s) après la séance',
        },
      },
      next: 'Suivant',
    },
    listItemPrimary: {
      before: 'Notification {{hours}}h avant le RDV',
      after: 'Notification {{hours}}h après le RDV',
      valid: 'RDV n° {{notify_booking_nb}}',
      cancelledNotRefunded: 'Annulation hors délai n° {{notify_booking_nb}}',
      cancelledRefunded: 'Annulation remboursée n° {{notify_booking_nb}}',
      notifyAllEvents: {
        valid: 'À chaque RDV',
        cancelledRefunded: 'À chaque annulation remboursée',
        cancelledNotRefunded: 'À chaque annulation hors délai',
      },
    },
    tooltip: 'Des notifications sont actives pour ce type de RDV',
  },
  recurrenceRule: {
    recurrentBookings: 'Rendez-vous récurrents',
    createModal: {
      create: 'Créer une réservation récurrente',
    },
    actions: {
      close: 'Fermer',
      save: 'Enregistrer',
    },
    form: {
      title: 'Programmer une récurrence',
      configuration: 'Réservations',
      timeGroup: 'Date de la séance',
      notify_member:
        "Envoyer un mail de confirmation lors de l'inscription du membre",
    },
    forms: {
      delete: {
        title: 'Déprogrammer un RDV récurrent',
        content:
          "Déprogrammer le RDV récurrent entrainera l'annulation des RDV futurs enregistrés via cette règle.",
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      update: {
        title: 'Modification RDV récurrent',
        content:
          'Modifier la règle de récurrence entrainera la modification des RDV futurs effectués via cette règle.',
        cancel: 'Annuler',
        confirm: 'Modifier',
      },
    },
    item: {
      startFrom: 'A partir du {{ date }}',
      explain:
        'Tous les {{dayOfWeek}} - {{time}}, {{delayWeek}} semaines avant',
    },
  },
  disabledPacksTitle: 'Cartes RDV archivées',
  categoryTitle: 'Catégories de cartes de RDV',
  notification: {
    addButton: 'Ajouter une notification',
    listItem: {
      mail: 'Mail ',
      deleteModal: {
        title: 'Suppression notification',
        cancel: 'annuler',
        confirm: 'Supprimer',
        content:
          'Etes vous sûr de vouloir supprimer cette notification ? Cette opération est définitive',
      },
      smartList: 'Listes exclues',
      smartListInclude: 'Listes incluses',
    },
  },
};
