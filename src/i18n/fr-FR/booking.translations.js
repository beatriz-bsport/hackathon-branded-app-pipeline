exports.default = {
  actions: {
    bill: 'Facturer',
    unregister: 'Désinscrire',
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
};
