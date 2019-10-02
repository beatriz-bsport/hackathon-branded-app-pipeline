export default {
  consumerPaymentPack: {
    addExtension: 'Ajouter une extension',
  },
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
      title: "Extension d'abonnement",
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
  form: {
    paymentPack: {
      name: {
        label: 'Nom',
        helperText: "Nom de l'abonnement",
      },
      priceIncludingTax: {
        helperText: "Prix pour le client pour l'abonnement",
        label: 'Prix TTC',
      },
      credits: {
        label: 'Crédit',
        helperText:
          'Nombre de crédits disponibles, laisser vide pour le rendre illimité',
      },
      maxBookingPerWeek: {
        label: 'Utilisation max par semaine',
        helperText: 'Laisser vide pour ne pas imposer de limite',
      },
      newMemberOnly: 'Uniquement pour les nouveaux clients',
      onsitePaymentAvailable: 'Possibilité de payer sur place',
      startOnFirstUse:
        'Le décompte de validité débute le jour de la première réservation',
      startOnFirstUseHelper:
        'Sinon le décompte début le jour de facturation du pass',
      expirationDaysBeforeFirstUse: {
        label: 'Expiration si aucune réservation initiale',
        helperText:
          "Si le pass n'est pas consommé une première fois pendant ce nb de jour, il est rendu invalide",
      },
      managerOnly: 'Invisible pour les clients',
      helper: {
        // eslint-disable-next-line
        // eslint-disable-next-line
        starting_date:
          'Début de validité du pass, laisser vide pour le rendre valable immédiatement',
        // eslint-disable-next-line
        ending_date:
          "Fin de validité du pass, laisser vide pour qu'il reste toujours actif",
        // eslint-disable-next-line
      },
      start_date_method: {
        on_purchase: 'Débute à la facturation',
        on_booking: 'Débute à la 1ère réservation',
        on_attendance: 'Débute à la 1ère présence',
      },
      timeSettingsTitle: "Validité de l'abonnement",
      generalSettingsTitle: 'Général',
      validByDuration: 'Abonnement valide N jours après achat',
      validByDaterange: 'Abonnement valide sur un créneau de date précis',
      durationDays: {
        label: 'Durée de validité (jours) si applicable',
        helperText:
          "Période en jours pour laquelle l'abonnement sera valide après achat ",
      },
      durationMonths: {
        label: 'Durée de validité (mois) si applicable',
        helperText: "S'ajoute au nombre de jours",
      },
      durationYears: {
        label: 'Durée de validité (années) si applicable',
        helperText: "S'ajoute au nombre de jours et de mois",
      },
      actions: {
        skip: 'Passer',
        edit: 'Modifier',
        create: 'Enregistrer',
      },
      sports: 'Catégorie',
      activities: 'Activité',
      establishments: 'Etablissement',
      restrictionsTitle: 'Restrictions',
      noneMeansAll: 'Laisser vide pour tout autoriser',
      update: {
        success: 'Abonnement: opération effectuée avec succès',
        error: "Abonnement : erreur lors de l'opération",
      },
      delete: {
        title: "Suppression de l'abonnement :",
        askConfirmation:
          "Attention ! Cette opération est définitive. L'abonnement ne sera plus visible et deviendra indisponible à l'achat.",
        thereAreConsumers:
          "Attention ! Des membres ont acheté cet abonnement, si vous le supprimez ces derniers pourront toujours utiliser leurs crédits restants. Vous pouvez les réduire manuellement à zéro ici.\n\nL'abonnement n'apparaitra plus dans votre magasin pour les nouveaux acheteurs.",
        actions: {
          cancel: 'Annuler',
          submit: 'Supprimer',
        },
      },
    },
  },
  details: {
    pleaseSelectAPack: 'Sélectionnez un abonnement pour voir le détails',
    shareAPass: 'Partager un abonnement',
    invoiceTitle: 'Facture associée',
    bookingsTitle: 'Réservations associées',
    extensionsTitle: 'Extensions de validité',
  },
  newMemberOnly: 'Disponible uniquement pour les nouveaux inscrits',
  publicPacksTitle: 'Abonnements disponibles à la vente',
  privatePacksTitle: 'Abonnements non disponibles à la vente',
  subscribeToOffer: 'Inscrire',
  use: 'Utiliser',
  createOrUpdate: {
    success: 'Abonnement enregistré',
    fail: "Erreur lors de l'enregistrement de l'abonnement",
  },
  disabled: 'Désactivé',
  disableConsumer: 'Bloquer',
  enableConsumer: 'Débloquer',
  maxNBookingsByWeek1: 'Max ',
  maxNBookingsByWeek2: ' réservations par semaine',
  validity: 'Valide :',
  consumer: {
    isFromShare: 'Partagé depuis un autre compte',
    isOwnerOfShares: 'Partagé (abonnement maître)',
    isFromDisabledShare: 'Partage arrété',
    expiresOn: 'Expire le ',
    bookingsThisWeek: 'réservation(s) cette semaine',
  },
  validForDuration: (days, months, years) =>
    `Validité : ${days ? `${days} jours ` : ''}${
      months ? `${months} mois ` : ''
    }${years ? `${years} année` : ''}`,
  validForNdays1: 'Valide ',
  validForNdays2: ' jours après achat',
  validFrom: 'Valide du ',
  validTo: ' au ',
  bookingsLeftThisWeek: 'Réservation max par semaine',
  // eslint-disable-next-line
  addButton: "Créer une offre d'abonnement",
  noPaymentPackSubscribed: 'Aucun abonnement',
  // eslint-disable-next-line
  validUntil: "Valide jusqu'au",
  expirationDate: 'Expire au',
  never: 'Jamais',
  unlimitedCredits: 'Illimité',
  credits: 'Crédits',
  specifications: {
    nbCredits: '{{credits}} crédits',
    unlimitedCredits: 'Illimité',
    price: '{{price, price}}',
  },
  availableOnFollowingSports: 'Sports éligibles : ',
  availableOnFollowingEstablishments: 'Lieux éligibles : ',
  anySport: 'Tout sport',
  availableOnFollowingActivities: 'Activités éligibles : ',
  anyActivity: 'Toute activité',
  boughtConsumerPaymentPacks: 'Abonnés',
  noRestrictionOnActivityType:
    'Toutes les activités sont compatibles avec cet abonnement',
  credit: {
    updated: 'Crédits mis à jour',
  },
  noConsumerPack: 'Aucun achat enregistré',
  reverted: 'Facture annulée',
};
