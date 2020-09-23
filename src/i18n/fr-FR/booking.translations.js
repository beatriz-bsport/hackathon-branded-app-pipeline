exports.default = {
  actions: {
    bill: 'Facturer',
    unregister: 'Désinscrire',
  },
  recurrenceRule: {
    deleteModal: {
      confirm: 'Supprimer',
      cancel: 'Annuler',
      content:
        "Supprimer la règle de récurrence entrainera l'annulation des réservations futures effectuées via cette règle.",
      title: 'Suppression règle de récurrence',
    },
    recurrentBookings: 'Réservations récurrentes',
    needConsumerPack:
      'Ce membre ne possède aucune carte de cours compatible, impossible de programmer une récurrence',
    item: {
      explain:
        'Tous les {{dayOfWeek}} - {{hour}}:{{minute}}, {{delayWeek}} semaines avant',
    },
    recurrentRuleBooking: 'Réservation récurrente',
    form: {
      title: 'Programmer une récurrence',
      timeGroup: 'Date de la séance',
      at: ' à ',
      dayOfWeek: {
        label: 'Jour de la semaine',
      },
      hour: {
        label: 'heure',
      },
      minute: {
        label: 'minute',
      },
      metaActivity: {
        label: 'Activité',
        helperText: 'Activité',
      },
      delayWeek: {
        label: 'Nombre de semaines',
        helperText:
          'Indique combien de semaine en avance le membre sera inscrit',
      },
    },
    actions: {
      close: 'Fermer',
      save: 'Enregistrer',
    },
    explain:
      "Le membre sera toujours inscrit {{ delayWeek }} semaines en avance aux cours du {{ dayOfWeek}} à {{hour}}:{{minute}}. Il ne sera inscrit que s'il possède une carte de cours valide.",
  },
  filters: {
    all: 'Toutes les réservations',
    present: 'Présent',
    absent: 'Absent',
    canceled: 'Séance annulée',
    managerCanceled: 'Annulation  manager',
    consumerCanceled: 'Annulation client',
    cancel: 'Annulation',
    attendance: 'Présence',
    time: 'Réservations dans le temps',
    futureBooking: 'Réservations futures',
    pastBooking: 'Réservations passées',
    refunded: 'Remboursement',
    isRefunded: 'Remboursée',
    notRefunded: 'Non remboursée',
  },
  bookingModule: {
    hasRegistered: 'Vous êtes inscrit à cette séance',
    isLoading: 'Recherche des séances...',
    recurrent: {
      title: 'Séances futures',
      bookMultiple: 'Reserver',
      backToRegistererChoice: 'Retour',
    },
    section: {
      consumerPacks: 'Mes cartes de cours',
      contracts: 'Abonnements',
      paymentPacks: 'Cartes de cours',
      paymentCombos: 'Offres promotionnelles',
    },
    option: {
      isAlreadyOnWaitingList: "Vous êtes inscrit en liste d'attente",
      isAlreadyRegistered:
        'La séance est complète, félicitations vous êtes bien inscrit !',
      isFull:
        "La séance est complète, vous pouvez vous inscrire en liste d'attente, vous serez prévenu par email lorsqu'une place se libèrera.",
      registerOption: "M'inscrire en liste d'attente",
    },
    offer: {
      isDisabled: 'La séance a été malheureusement été annulée.',
      isTooLate:
        'Les inscriptions ne sont plus possible, le délai de dernière inscription a été dépassé.',
      isTooSoon:
        'Les inscriptions sont fermées pour le moment et ouvriront le {{ date }}.',
      isWaitingListFull:
        "La séance est complète la liste d'attente est pleine.",
    },
    messages: {
      offerLocked: 'Vous ne pouvez pas réserver cette séance',
    },
  },
  details: {
    pleaseSelectABooking: 'Sélectionnez une réservation pour voir le détails',
    title: 'Détails réservation',
    offerTitle: 'Séance liée',
    consumerPaymentPackTitle: 'Carte de cours utilisée',
  },
  parameters: {
    registeredOn: 'Réservé le ',
    source: 'Canal de réservation',
  },
  source: {
    web: 'Web',
    app: 'Application mobile',
    saas: 'Backoffice',
    other: 'Autre',
    migration: 'Migration',
  },
  customerView: {
    wasRefunded: 'Remboursé',
    cancelled: 'Annulé',
  },
  attend: 'Présent',
  doNotAttend: 'Absent',
  loading: 'Chargement',
  wasRefunded: 'Remboursé',
  creditConsumed: '{{credit_consumed}} crédit',
  creditConsumed_plural: '{{credit_consumed}} crédits',
  statusCode: {
    cancelledByManager: 'Annulation manager',
    cancelledByConsumer: 'Annulation client',
    cancelledByOffer: 'Séance annulée par le club',
  },
  notification: {
    addNotification: 'Ajouter une notification',
    form: {
      title: 'Formulaire de notification',
      explain:
        "Vous pouvez prévenir vos clients avant ou après certaines séances, en fonction de différents critères comme le nombre de présences, d'absences ou encore d'annulations.",
      typeTitle: 'Type de notification',
      settingTitle: 'Paramètres',
      eventNb: "Notifier le membre lors de l'évènement n° :",
      notifyAllEvents: 'Notifier le membre à chaque évènement',
      sendBeforeMail:
        'Envoyer le mail au membre avant la séance concernée par la notification',
      sendAfterMail:
        'Envoyer le mail au membre après la séance concernée par la notification',
      chooseTime: {
        first: 'Envoyer un mail',
        second_before: 'heure(s) avant la séance',
        second_after: 'heure(s) après la séance',
      },
      chooseStatus: {
        title: 'Choisissez le type de réservation que vous voulez notifier',
        valid: 'Réservation valide',
        cancelled: 'Réservation annulée par le client',
      },
      chooseKind: {
        title: 'Évènement déclenchant la notification',
        attendance: 'Présence du membre à une séance',
        absence: 'Absence du membre à une séance',
        refunded: 'Annulation remboursée',
        notRefunded: 'Annulation hors délai',
      },
      help: {
        text: 'Aide : la notification sera envoyée au membre lors de',
        attendance: 'sa présence n° {{notify_booking_nb}}',
        absence: 'son absence n° {{notify_booking_nb}}',
        refunded: 'son annulation remboursée n° {{notify_booking_nb}}',
        notRefunded: 'son annulation hors délai n° {{notify_booking_nb}}',
        allEvents: {
          attendance:
            'Aide : la notification sera envoyée au membre à chacune de ses présences',
          absence:
            'Aide : la notification sera envoyée au membre à chacune de ses absences',
          refunded:
            'Aide : la notification sera envoyée au membre à chacune de ses annulations remboursées',
          notRefunded:
            'Aide : la notification sera envoyée au membre à chacune de ses annulations hors délai',
        },
      },
      submit: 'Valider',
      next: 'suivant',
      cancel: 'Annuler',
      listItemPrimary: {
        before: 'Notification {{hours}}h avant la séance',
        after: 'Notification {{hours}}h après la séance',
        attendance: 'Présence n° {{notify_booking_nb}}',
        absence: 'Absence n° {{notify_booking_nb}}',
        refunded: 'Annulation remboursée n° {{notify_booking_nb}}',
        notRefunded: 'Annulation hors délai n° {{notify_booking_nb}}',
        bookingDeprecated: 'Réservation n° {{notify_booking_nb}}',
        cancelledDeprecated: 'Annulation n° {{notify_booking_nb}}',
        notifyAllEvents: {
          attendance: 'À chaque présence',
          absence: 'À chaque absence',
          refunded: 'À chaque annulation remboursée',
          notRefunded: 'À chaque annulation hors délai',
        },
      },
    },
  },
};
