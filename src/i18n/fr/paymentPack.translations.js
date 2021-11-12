const PAYMENT_PACK_NOTIFICATION_DAY_LEFT = 0;
const PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT = 1;
const PAYMENT_PACK_NOTIFICATION_DAY_PAST = 2;

exports.default = {
  paymentPackTemplateInstance: {
    paymentPackSharedFromFranchisor: 'Carte franchise',
    consumerPaymentPackSharedFromOtherFranchisee: 'Partagé depuis franchisé',
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
  paymentPackTemplate: {
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
  multipleBookingTooltip: 'Réservations multiples',
  section: {
    massExtension: 'Extensions',
  },
  actions: {
    massExtension: 'Ajouter une extension',
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
      title: 'Remboursement',
      blockUnlimited: 'Bloquer la carte',
      price: {
        label: 'Montant à recréditer',
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
      warningFirst:
        'Attention, cette opération est irréversible (génération facture).',
      warningSecond:
        'Si vous souhaitez rembourser le client par virement avec le moyen de paiement utilisé annulez la facturation et ne le remboursez pas en crédit !',
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    details: {
      actions: {
        refund: 'Transformation acompte',
        applyVoucher: 'Appliquer réduction',
      },
    },
    maxout: {
      limit_reach: 'Limite de réservations par {{unit}} atteinte',
      days: 'jour',
      weeks: 'semaine',
      months: 'mois',
      dialogTitle: 'Limite de réservation atteinte',
      dialog_message:
        'Attention cette carte a déjà atteint sa limite de {{count}} réservation(s) par {{unit}}. Voulez vous tout de même réserver avec cette carte ? ',
    },
  },
  noPaymentPack:
    "Les cartes de cours permettent aux membres de s'inscrire aux activités, il est nécessaire de posséder une carte pour s'inscrire.",
  notificationToolTip: 'Des notifications sont définies pour cette carte',
  notification: {
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
    creditsLeft: {
      first: "Notifier lorsqu'il reste",
      second: 'crédits',
    },
    creditsLeftLabel: "Notifier lorsqu'il reste {{count}} crédit",
    creditsLeftLabel_plural: "Notifier lorsqu'il reste {{credit}} crédits",
    daysLeftLabel:
      "Notifier lorsqu'il reste {{day}} jour de validité sur la carte",
    daysLeftLabel_plural:
      "Notifier lorsqu'il reste {{day}} jours de validité sur la carte",
    daysPastLabel: 'Notifier lorsque la carte est expirée depuis {{day}} jour',
    daysPastLabel_plural:
      'Notifier lorsque la carte est expirée depuis {{day}} jours',
    daysLeft: {
      first: "Notifier lorsqu'il reste",
      second: 'jours',
    },
    daysPast: {
      first: 'Notifier lorsque la carte est expirée depuis',
      second: 'jours',
    },
  },
  search: 'Rechercher une carte',
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
      full_vod_access: 'Donne accès à la VOD tant que valable dans le temps',
      only_vod_access: 'Uniquement pour la VOD',
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
          "Utilisée pour calculer la rémunération des professeurs, 10{{currency}} signifie qu'une réservation faite avec cette carte est rémunérée 10{{currency}}. Si vide ou 0{{currency}} l'apport d'une carte sera PRIX/NB_RESERVATION",
      },
      credits: {
        label: 'Crédit',
        helperText: 'Nombre de crédits disponibles',
        bewareChange:
          'Si vous augmentez le nb de crédit, toutes les cartes existantes seront affectées. Idem si vous diminuez le nombre de crédits.',
      },
      maxBookingPerMonth: {
        label: 'Utilisation max par mois',
        helperText: 'Laisser vide pour ne pas imposer de limite',
      },
      maxBookingPerWeek: {
        label: 'Utilisation max par semaine',
        helperText: 'Laisser vide pour ne pas imposer de limite',
      },
      maxBookingPerDay: {
        label: 'Utilisation max par jour',
        helperText: 'Laisser vide pour ne pas imposer de limite',
      },
      maxPurchasePerMember: {
        label: 'Achat maximum par membre',
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
          "Si la carte de cours n'est pas consommé une première fois pendant ce nb de jour, il est rendu invalide",
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
      establishments: 'Salle',
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
      penalty: {
        title: 'Pénalités',
        checkbox:
          "Appliquer une pénalité en cas d'annulations hors délai trop nombreuses",
        explain:
          'Une pénalité sera appliquée si il y a {{nb_cancellations}} annulations hors délai sur une période de {{nb_days}} jours',
        nb_cancellations: "Nombre d'annulations :",
        nb_days: 'Nombre de jours :',
        kind: {
          label: 'Sélectionnez le type de pénalité à appliquer',
          block: 'Bloquer temporairement la carte de cours',
          account: 'Créer un acompte pour le membre concerné',
        },
        block: {
          label: 'Période de bloquage de la carte (en jours) :',
          helperText: 'La carte sera bloquée pendant {{nb_days}} jours',
        },
        account: {
          label: "Montant de l'acompte :",
          helperText: 'Un accompte de {{value}} sera appliqué pour ce membre',
        },
      },
      category: {
        label: 'Catégorie (facultatif)',
        helperText: 'Nom de la catégorie',
      },
      error: {
        start_date_method_type:
          'Veuillez indiquer le début de validité de la carte.',
      },
      advancedOptions: {
        header: 'Avancé',
        tag: {
          header: 'Tags',
          helperText:
            'Utilisez les tags pour rendre la carte visible uniquement à un groupe de membre souhaité sur la marketplace, le widget et l’application. Vous pouvez sélectionner des tags pour rendre la carte visible seulement aux membres possédants un des tags choisis. Ou bien vous pouvez sélectionnez des tags pour rendre la carte invisible seulement aux membres possèdants un des tags sélectionnés. ',
          allowed: 'Autorisé',
          allowedFor: 'Autorisé pour',
          notAllowed: 'Non-Autorisé',
          notAllowedFor: 'Non-autorisé pour',
          doNotSelectToAllowAllMembers:
            'Ne rien sélectionner pour autoriser à tous les membres',
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
    trackModifiedCreditTitle: 'Historique des crédits modifiés',
    penaltyTitle: 'Pénalités appliquées',
    penaltyBlock: 'Carte bloquée pendant {{nb_days}} jours',
    penaltyAccount:
      'Facturation supplémentaire de {{account_value}} {{currencyDisplay }}',
  },
  penalty: {
    title: "Politique d'annulation",
    block:
      "S'il y a {{nb_cancellations}} annulations hors délai sur une période de {{nb_days}} jours, la carte sera bloquée pendant {{days_blocked}} jours.",
    account:
      "S'il y a {{nb_cancellations}} annulations hors délai sur une période de {{nb_days}} jours, un acompte de {{account_value}} sera appliqué.",
  },
  newMemberOnly: 'Disponible uniquement pour les nouveaux inscrits',
  only_vod_access: 'Disponible uniquement pour la VOD',
  publicPacksTitle: 'Cartes disponibles à la vente',
  privatePacksTitle: 'Cartes non disponibles à la vente',
  disabledPacksTitle: 'Cartes archivées',
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
  maxNBookingsByMonth2: ' réservations par mois',
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
  credits: 'Crédit',
  credits_plural: 'Crédits',
  ht: 'Hors-taxe',
  specifications: {
    nbCredits: '{{credits}} crédit',
    nbCredits_plural: '{{credits}} crédits',
    unlimitedCredits: 'Illimité',
  },
  availableOnFollowingSports: 'Catégories éligibles : ',
  availableOnFollowingEstablishments: 'Salles éligibles : ',
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
  notificationForm: 'Formulaire notification',
  disabledPacks: {
    show: 'Afficher les cartes archivées',
    hide: 'Masquer les cartes archivées',
  },
  blockedCpp: 'Carte bloquée du {{-blocked_from}} au {{-blocked_until}}',
  massExtension: {
    helpText:
      'Vous pouvez ici étendre toutes les cartes de cours de vos membres. Cette opération est réversible.',
    dateHelpText: "N'étendre que les cartes de cours expirant entre le",
    minDate: 'Au plus tôt le',
    maxDate: 'Au plus tard le',
    title: 'Ajouter une extension à tous les membres',
    submit: 'Valider',
    cancel: 'Annuler',
    listItemDate: 'Expirant entre le {{ minDate }} et le {{ maxDate }}',
    createdAt: 'Ajouté le {{date}}',
    listItemNbDays: '+{{nbDays}} jours',
  },
  category: {
    category: 'Catégories de cartes de cours',
    add: 'Ajouter une categorie',
    form: {
      dialog: {
        name: 'Nom de la catégorie',
        titleNew: 'Nouvelle catégorie',
        titleEdit: 'Catégorie',
        helper:
          'Les catégories apparaitront sur la marketplace et l’application mobile pour les cartes disponibles à la vente.',
      },
    },
    popover: {
      edit: 'Renommer',
      delete: 'Supprimer',
    },
    deleteModal: {
      title: 'Suppression',
      content:
        "Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les éléments qu'elle contient seront placés dans la section des cartes de cours non catégorisées",
      cancel: 'Annuler',
      confirm: 'Confirmer',
    },
  },
  noCategory: {
    help:
      'Ces passes apparaîtront dans une catégorie sans nom sur la marketplace',
    name: 'Sans catégorie',
    empty: 'Aucune carte dans cette catégorie',
  },
};
