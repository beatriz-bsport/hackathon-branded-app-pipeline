const PAYMENT_PACK_NOTIFICATION_DAY_LEFT = 0;
const PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT = 1;
const PAYMENT_PACK_NOTIFICATION_DAY_PAST = 2;

exports.default = {
  actions: {
    edit: 'Modifier',
    delete: 'Supprimer',
    scaleCredit: 'Mult/div les crédits',
  },
  scaleCredit: {
    title: 'Modification du total de crédit',
    explain:
      "Vous pouvez multiplier les crédit de la carte (3/7 x2 devient 6/14) ou les diviser cas d'erreur (3/7 ÷2 devient 1/3) : arrondi à l'inférieur.",
    parameterLegend: 'Paramètres',
    scaleDown: 'Diviser',
    scaleUp: 'Multiplier',
    factor: {
      label: 'Facteur',
    },
    actions: {
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
  },
  consumerPaymentPack: {
    addExtension: 'Ajouter une extension',
    refund: {
      title: 'Remboursement crédit',
      price: {
        label: 'Montant recrédité',
      },
      description: '{{ credits }} crédit - {{ note }}',
      description_plural: '{{ credits }} crédits - {{ note }}',
      note: {
        label: 'Note',
      },
      credits: {
        label: 'Crédit à déduire',
      },
      explain:
        "Choisissez le nombre de crédit à rembourser ainsi que la valeur totale qui sera créditée sur l'acompte du membre",
      warning:
        'Attention, cette opération est irréversible (génération facture).',
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    details: {
      actions: {
        refund: 'Remboursement crédit',
      },
    },
  },
  notificationToolTip: 'Des notifications sont définies pour cette carte',
  notification: {
    listItem: {
      mail: 'Mail ',
      deleteModal: {
        title: 'Supression notification',
        cancel: 'annuler',
        confirm: 'Supprimer',
        content:
          'Etes vous sûr de vouloir supprimer cette notification ? Cette opération est définitive',
      },
      smartList: 'Listes exclues',
      smartListInclude: 'Listes incluses',
    },
    addButton: 'Ajouter une notification',
    form: {
      noMailAvailable: 'Aucun mail disponible, pensez à en créer un',
      selectToShowPreview: 'Sélectionnez un mail pour avoir son apperçu',
      mailTitle: 'Mail à envoyer',
      typeTitle: 'Type de notification',
      creditType: 'Crédits restants',
      daysType: 'Jours de validité restants',
      daysPastType: 'Jours de péremption',
      mailSelection: 'Choisir un mail',
      smartListSelection: 'Choisir des listes (optionnel)',
      showMail: 'Voir le mail',
      settingTitle: 'Paramètres',
      hideMail: 'Cacher le mail',
      submit: 'Valider',
      cancel: 'Annuler',
      createSmartList: 'Créer une smartlist',
      warning:
        'En ne sélectionnant aucune smartlist vous risquez de notifier des membres qui ont déjà acheté une autre carte de cours',
      smartListHelper:
        "Ne pas envoyer de mail si le membre appartient à l'une des listes suivantes",
      smartListHelperInclude:
        "Envoyer un mail uniquement si le membre appartient à l'une des listes suivantes",
    },
    [PAYMENT_PACK_NOTIFICATION_DAY_LEFT]: {
      first: "Notifier lorsqu'il reste ",
      second: 'jours de validité sur la carte',
    },
    [PAYMENT_PACK_NOTIFICATION_DAY_PAST]: {
      first: 'Notifier lorsque la carte est expirée depuis ',
      second: 'jours',
    },
    [PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT]: {
      first: "Notifier lorsqu'il reste",
      second: 'crédits',
    },
  },
  search: 'Chercher une carte',
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
  form: {
    paymentPack: {
      from: 'A partir du ',
      notEditable:
        "Cette carte de cours est issue d'une migration, certains champs ne sont pas modifiable pour respecter l'historique. Les activités/catégories compatibles restent modifiables.",
      until: "Jusqu'au ",

      name: {
        label: 'Nom',
        helperText: 'Nom de la carte de cours',
      },
      tax: {
        label: 'TVA',
      },
      priceIncludingTax: {
        helperText: 'Prix pour le client pour la carte',
        label: 'Prix TTC',
      },
      unlimited: 'Crédits illimités',
      theoricalMarginValue: {
        label: 'Apport marginal théorique TTC (carte illimité seulement)',
        helperText:
          "Utilisée pour calculer la rémunération des professeurs, 10€ signifie qu'une réservation faite avec cette carte est rémunérée 10€. Si vide ou 0€ l'apport d'une carte sera PRIX/NB_RESERVATION",
      },
      credits: {
        label: 'Crédit',
        helperText: 'Nombre de crédits disponibles',
        bewareChange:
          'Si vous augmentez le nb de crédit, toutes les cartes existantes seront affectées. Idem si vous diminuez le nombre de crédits.',
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
      timeSettingsTitle: 'Validité de la carte',
      generalSettingsTitle: 'Général',
      validByDuration: 'Carte valide N jours après achat',
      validByDaterange: 'Carte valide sur un créneau de date précis',
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
      actions: {
        skip: 'Passer',
        cancel: 'Annuler',
        edit: 'Modifier',
        create: 'Enregistrer',
      },
      sports: 'Catégorie',
      activities: 'Activité',
      establishments: 'Etablissement',
      restrictionsTitle: 'Restrictions',
      noneMeansAll: 'Laisser vide pour tout autoriser',
      update: {
        success: 'Carte de cours: opération effectuée avec succès',
        error: "Carte de cours: erreur lors de l'opération",
      },
      delete: {
        title: 'Suppression de la carte:',
        askConfirmation:
          "Attention ! Cette opération est définitive. La carte ne sera plus visible et deviendra indisponible à l'achat.",
        thereAreConsumers:
          "Attention ! Des membres ont acheté cette carte de cours, si vous le supprimez ces derniers pourront toujours utiliser leurs crédits restants. Vous pouvez les réduire manuellement à zéro ici.\n\nLa carte n'apparaitra plus dans votre magasin pour les nouveaux acheteurs.",
        actions: {
          cancel: 'Annuler',
          submit: 'Supprimer',
        },
      },
    },
  },
  details: {
    pleaseSelectAPack: 'Sélectionnez une carte pour voir le détails',
    shareAPass: 'Partager une carte de cours',
    invoiceTitle: 'Facture associée',
    refundTitle: 'Remboursement associé',
    bookingsTitle: 'Réservations associées',
    extensionsTitle: 'Extensions de validité',
  },
  newMemberOnly: 'Disponible uniquement pour les nouveaux inscrits',
  publicPacksTitle: 'Cartes disponibles à la vente',
  privatePacksTitle: 'Cartes non disponibles à la vente',
  subscribeToOffer: 'Inscrire',
  use: 'Utiliser',
  isNonCompatible: 'incompatible',
  paymentPackDisabled: {
    success: 'Carte de cours supprimée',
    error: 'Impossible de supprimer',
  },

  disabled: 'Désactivé',
  disableConsumer: 'Bloquer',
  enableConsumer: 'Débloquer',
  maxNBookingsByWeek1: "Jusqu'à ",
  maxNBookingsByWeek2: ' réservations par semaine',
  validity: 'Valide :',
  consumer: {
    isFromShare: 'Partagé depuis un autre compte',
    isOwnerOfShares: 'Partagé (carte de cours maître)',
    isFromDisabledShare: 'Partage arrété',
    expiresOn: 'Expire le ',
    bookingsThisWeek: 'réservation(s) cette semaine',
  },
  validForDuration: {
    days: 'Valide {{ duration_days }} jours',
    months: 'Valide {{ duration_months }} mois',
    years: 'Valide {{ duration_years }} an',
    general:
      'Valide {{ duration_days }} jours {{ duration_months }} mois et {{ duration_years }} an',
  },
  validForNdays1: 'Valide ',
  validForNdays2: ' jours après achat',
  validFrom: 'Valide du ',
  validTo: ' au ',
  bookingsLeftThisWeek: 'Réservation max par semaine',
  // eslint-disable-next-line
  addButton: 'Créer une carte',
  noPaymentPackSubscribed: 'Aucun abonnement',
  // eslint-disable-next-line
  validUntil: "Valide jusqu'au",
  expirationDate: 'Expire au',
  never: 'Jamais',
  unlimitedCredits: 'Illimité',
  credits: 'Crédits',
  ht: 'Hors-taxe',
  specifications: {
    nbCredits: '{{credits}} crédits',
    unlimitedCredits: 'Illimité',
    price: '{{price, price}}',
  },
  availableOnFollowingSports: 'Catégories éligibles : ',
  availableOnFollowingEstablishments: 'Lieux éligibles : ',
  anySport: 'Toute catégorie',
  availableOnFollowingActivities: 'Activités éligibles : ',
  anyActivity: 'Toute activité',
  boughtConsumerPaymentPacks: 'Abonnés',
  noRestrictionOnActivityType:
    'Toutes les activités sont compatibles avec cette carte',
  credit: {
    updated: 'Crédits mis à jour',
  },
  noConsumerPack: 'Aucun achat enregistré',
  reverted: 'Facture annulée',
  link: {
    copied: 'Lien copié',
    copyLink: 'Copier le lien vers la page de paiement',
  },
};
