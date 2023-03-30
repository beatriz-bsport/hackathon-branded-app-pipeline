const PAYMENT_METHOD = require('@bsport/common/lib/master-data/subscription-payment-methods');

const {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} = PAYMENT_METHOD;

const {
  BILLING_PLAN_STATUS_NOT_STARTED,
  BILLING_PLAN_STATUS_STARTED,
  BILLING_PLAN_STATUS_STOPPED,
  BILLING_PLAN_STATUS_PAUSED,
  BILLING_PLAN_STATUS_ENDED,
} = require('@bsport/common/lib/master-data/subscription-status');

const {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
} = require('@bsport/common/lib/master-data/payment-group');

const {
  BILLING_PLAN_EVENTS,
} = require('@bsport/common/lib/master-data/events');

exports.default = {
  search: 'Rechercher un contrat',
  seeMore: 'Voir plus',
  register: {
    dialog: {
      success: 'Votre abonnement {{- name }} a bien été enregistré.',
      error: "Impossible d'enregistrer l'abonnement.",
      info: "Votre abonnement est en cours d'enregistrement, nous vous préviendrons lorsqu'il sera prêt.",
    },
  },
  status: {
    hasStarted: 'En cours',
    hasNotStartedYet: 'Pas encore commencé',
    hasStopped: 'Stoppé',
    isPaused: 'En pause',
    hasEnded: 'Terminé',
  },
  billing_plan_status: {
    [BILLING_PLAN_STATUS_STARTED]: 'En cours',
    [BILLING_PLAN_STATUS_NOT_STARTED]: 'Pas encore commencé',
    [BILLING_PLAN_STATUS_STOPPED]: 'Stoppé',
    [BILLING_PLAN_STATUS_PAUSED]: 'En pause',
    [BILLING_PLAN_STATUS_ENDED]: 'Terminé',
  },
  notificationToolTip: 'Des notifications sont définies pour cet abonnement',
  invisibleForStaffToolTip: 'Invisible pour le staff',
  events: {
    list: {
      title: 'Derniers évènements',
    },
    [BILLING_PLAN_EVENTS.pause]: 'Pause',
    [BILLING_PLAN_EVENTS.pause_deleted]: 'Pause annulée',
    [BILLING_PLAN_EVENTS.create]: 'Création',
    [BILLING_PLAN_EVENTS.stop]: 'Arrêt',
    [BILLING_PLAN_EVENTS.renew]: 'Renouvellement',
    [BILLING_PLAN_EVENTS.payment_dispute]: 'Litige',
    [BILLING_PLAN_EVENTS.payment_success]: 'Paiement réussi',
    [BILLING_PLAN_EVENTS.payment_failure]: 'Paiement refusé',
    [BILLING_PLAN_EVENTS.update_payment_method]: 'Méthode de paiement modifiée',
    [BILLING_PLAN_EVENTS.update_payment_pack]: 'Carte de cours modifiée',
    [BILLING_PLAN_EVENTS.update_private_pass]: 'Carte de rendez-vous modifiée',
    [BILLING_PLAN_EVENTS.update_payment_combo]: 'Pack modifié',
    [BILLING_PLAN_EVENTS.update]: 'Abonnement modifié',
  },
  cancel: 'annuler',
  save: 'valider',
  addNotification: 'Ajouter une notification',
  table: {
    noContent: 'Aucune souscription enregistrée',
  },
  noContracts:
    'Les contrats vous permettront de facturer régulièrement (mensuellement) vos membres pour une carte de cours recréditée tous les mois/jours/années.',
  subscription: {
    list: {
      title: 'Souscription en cours',
    },
    actionSection: 'Gérer',
    listItem: {
      startingAt: 'Débute le {{ d }}',
      nextBillingDate: 'Prochaine facturation le {{ d }}',
      recurrencePriceIs: 'Récurrence de {{ amount }}{{currencyDisplay}}',
    },
    invoicesSection: 'Factures',
    pauseSection: 'Pauses',
    switchPack: {
      form: {
        title: 'Changement de carte de cours',
        explain:
          "Cette carte de cours sera facturée à la place de l'ancienne sur toutes les prochaines factures. Les séances réservées avec l'ancienne carte seront transférées sur la nouvelle même si celle-ci n'est pas censée être compatible.",
        warning:
          'La facturation restera la même, si vous souhaitez augmenter/diminuer le montant mensuel, modifiez chaque mensualité séparément.',
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    switchPrivatePass: {
      form: {
        title: 'Changement de carte de rendez-vous',
        explain:
          "Cette carte de rendez-vous sera facturée à la place de l'ancienne sur toutes les prochaines factures. Les séances réservées avec l'ancienne carte seront transférées sur la nouvelle même si celle-ci n'est pas censée être compatible.",
        warning:
          'La facturation restera la même, si vous souhaitez augmenter/diminuer le montant mensuel, modifiez chaque mensualité séparément.',
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    switchPaymentCombo: {
      form: {
        title: 'Changement du pack',
        explain:
          "Ce pack sera facturé à la place de l'ancien UNIQUEMENT sur les factures générées après le renouvellement de la souscription",
        prewarning:
          'Si vous souhaitez modifier les factures futures déjà créées, vous devez annuler cette souscription.',
        warning:
          'La facturation restera la même, si vous souhaitez augmenter/diminuer le montant mensuel, modifiez chaque mensualité séparément.',
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    edit: 'Modifier',
    register: "S'abonner",
    delete: 'Supprimer',
    buy: 'Acheter',
    invoice: {
      label: 'Facture {{uuid}} : {{price}}',
    },
    freeze: {
      form: {
        title: 'Mise en pause',
        name: {
          label: 'Raison',
          placeholder: 'Vacances de toussaint',
        },
        days: {
          label: 'Nombre de jours',
        },
        explainInvoice:
          'A partir de quelle facture (inclue) voulez-vous repousser la souscription ?',
        explain:
          "Le prochain paiement sera retardé d'autant de jours, de même pour les cartes de cours futures",
        explainWarning: "Attention cette opération n'est pas reversible !",
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
      disabledReasons: {
        month_billing_day:
          'Impossible de mettre en pause un contrat facturé à jour fixe ',
      },
    },
    scheduledStop: {
      title: "Programmer l'arrêt de la souscription",
      explain: 'Choisissez le dernier encaissement de la souscription.',
      listItem: 'Arrêt programmé de la souscription',
      summary:
        'Le dernier encaissement programmé sera daté du {{-date}}, il correspondera à la dernière carte valide.',
    },
    actions: {
      freeze: 'Mettre en pause',
      switchPack: 'Modifier la carte de cours',
      switchPaymentMethod: 'Modifier la méthode paiement',
      enableAutoRenew: 'Activer le renouvellement automatique',
      disableAutoRenew: 'Désactiver le renouvellement automatique',
      stop: 'Stopper après cette facture',
      changePrice: 'Modifier le prix',
      showInvoice: 'Voir la facture',
      changeDate: 'Modifier la date',
      postPone: 'Repousser la facture',
      advanceTime: 'Avancer cette facture',
    },
    prorata: {
      helperOnSusscribe:
        'Le premier paiement est calculé au prorata pour un montant de {{ priceWithCurrency }} et sera encaissé à la date du {{-firstBillingDate}}. Les paiements suivants se feront tous les {{ monthBillingDay }} du mois, et seront d’un montant de {{ recurrentPrice }}',
    },
  },
  end: {
    noRenew: 'Fin de la souscription',
    renew: 'Renouvellement automatique',
  },
  plannedInvoice: {
    list: {
      titleNext: 'Prochains prélèvements',
    },
    dateUpdater: {
      title: 'Modification date future',
      label: "Date d'encaissement",
      explain: 'Seule cette future facture sera modifiée',
      actions: {
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    priceUpdater: {
      title: 'Modification montant futur',
      price: 'Nouveau montant',
      updateAll:
        'Mettre à jour tous les futurs actuellement planifiés (avant renouvellement)',
      updateRecurrentPrice:
        'Appliquer ce changement pour les paiements générés après renouvellement',
      explain: 'Seule cette future facture sera modifiée',
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
  },
  notificationForm: {
    title: 'Règle de notifications',
    subtitle: 'Abonnement',
    warning:
      "Prévenez vos clients lorsque leur abonnement a un changement d'état : fin de l'abonnement, début de l'abonnement.",
    typeSection: {
      title: 'État à notifier',
      contractStart: "Début de l'abonnement",
      contractEnd: "Fin de l'abonnement",
    },
    triggeringEvent: {
      title: 'Événement déclencheur',
      contractCreation: "Création de l'abonnement",
      firstBilling: 'Première facture',
    },
    notificationType: {
      title: 'Type de notification',
      day: 'Jour',
      day_plural: 'Jours',
      hour: 'Heure',
      hour_plural: 'Heures',
      before: 'Avant',
      after: 'Après',
      afterSubcriptionCreation: 'Après la création de l’abonnement.',
      firstBilling: "La première facture de l'abonnement.",
      contractEnd: "La fin de l'abonnement.",
      warningDayFirst:
        'Le nombre de jours indiqué est par rapport à la date de la première facture à minuit',
      warningHourFirst:
        "Le nombre d'heures indiqué est par rapport à la date de la première facture à minuit",
      warningDayLast:
        'Le nombre de jours indiqué est par rapport à la date de la dernière facture à minuit',
      warningHourLast:
        "Le nombre d'heures indiqué est par rapport à la date de la dernière facture à minuit",
    },
    smartLists: {
      smartListSelection: 'Choisir des listes (optionnel)',
      warning:
        'En ne sélectionnant aucune smartlist vous risquez de notifier des membres qui ont déjà acheté une autre carte de cours',
      advanced: 'Avancé',
      smartListHelper:
        "Ne pas envoyer de mail si le membre appartient à l'une des listes suivantes",
      smartListHelperInclude:
        "Envoyer un mail uniquement si le membre appartient à l'une des listes suivantes",
      createSmartList: 'Créer une smartlist',
    },
    sendingMethod: {
      title: "Méthode d'envoi",
      email: 'Mail',
      notificationPush: 'Notification push',
    },
    emailNotification: {
      parameters: 'Paramètres du mail',
      emailToSend: 'Mail à envoyer',
    },
    notificationPush: {
      warning:
        'Attention, les notifications push sont à utiliser avec parcimonie. Trop de notifications push peut amener certains membres à désinstaller l’application.',
      parameters: 'Paramètres de la notification',
      title: 'Titre',
      content: 'Contenu',
      addTag: 'Ajouter une balise',
    },
    buttons: {
      cancel: 'Annuler',
      submit: 'Valider',
    },
  },
  notification: {
    title: 'Notifier {{count}} {{periodScale}} {{notificationKind}}',
    creation: 'Après la création',
    beforefirstBilling: 'Avant la première facture',
    afterfirstBilling: 'Après la première facture',
    beforeSubscriptionEnd: 'Avant la fin de l’abonnement',
    afterSubscriptionEnd: 'Après la fin de l’abonnement',
    days: 'Jour',
    days_plural: 'Jours',
    hours: 'Heure',
    hours_plural: 'Heures',
  },
  contractNotification: {
    creation: 'À la création de l’abonnement',
    firstBilling: 'À la première facture',
  },
  contract: {
    item: {
      identifier: 'Abonnement',
      recurrentPriceLabel: '{{ recurrent_price  }}{{ currencyDisplay }}',
      intervalLabel: {
        month: 'Tous les mois',
        month_plural: 'Tous les {{ count }} mois',
        week: 'Toutes les semaines',
        week_plural: 'Toutes les {{ count }} semaines',
        day: 'Tous les jours',
        day_plural: 'Tous les {{ count }} jours',
        year: 'Tous les ans',
        year_plural: 'Tous les {{ count }} ans',
      },
    },
    yes: 'Oui',
    no: 'Non',
    registerManager: {
      title: 'Paiement récurrent',
      explainChoseContract:
        'Sélectionnez un contrat, ce dernier sera facturé mensuellement au membre',
      explainCustomSubscriptionForm:
        'Non je souhaite définir une souscription personnalisée',
      actions: {
        cancel: 'Annuler',
      },
    },
    paymentPack: 'Carte de cours associée',
    privatePass: 'Carte RDV associée',
    paymentCombo: 'Pack associé',
    duration: '{{month}} factures',
    monthBillingDay: 'Facturé tous les {{ month_billing_day }} du mois',
    billingFrequency: 'Fréquence de facturation',
    description: 'Description',
    legal: 'Mentions légales',
    actions: {
      create: 'Ajouter un contrat',
      iAcceptCondition: "J'accepte les conditions ci-dessus",
      iAcceptGeneralCondition: " J'accepte les mentions légales",
      iAcceptContractTerms: "J'accepte les <0>mentions légales</0>.",
      iwanttostarton: 'Je souhaite débuter la facturation le : ',
      subscribe: "M'abonner",
      title: 'Date passée',
      alertPastDateSameMonth:
        "Attention, vous avez choisi une date passée, si l'abonnement contient une carte, la validité de celle-ci commencera à la date sélectionnée. Dans le cas d'une validité d'un mois, votre membre perdra {{lostDays}} jours de validité.",
    },
    pastDate: {
      title: 'Date passée',
      alertSameMonth:
        "Attention, vous avez choisi une date passée, si l'abonnement contient une carte, la validité de celle-ci commencera à la date sélectionnée. Dans le cas d'une validité d'un mois, votre membre perdra {{lostDays}} jours de validité.",
      alertDifferentMonth:
        "Attention, vous avez choisi une date dans un mois passé. Votre membre risque d'avoir une ou plusieurs cartes facturées qui seront déjà expirées.",
      alertDifferentMonthConfirmAsk:
        'Vous êtes sur le point de facturer {{valuePastInvoicesPrice}} à votre membre. Pour confirmer cette action, tapez {{valuePastInvoices}}',
      alertDifferentMonthInput: 'Valeur factures passées',
      valuePastInvoicesInputError:
        'La valeur ne correspond pas. Veuillez réessayer',
      futureInvoicesPayment: 'Paiement des factures futures',
      payment: {
        registeredMethodPayment: 'Débiter sur le moyen de paiement enregistré',
        pastInvoicesPayment: 'Paiement des factures passées',
        manualPayment: 'Paiement manuel',
        registeredInfo:
          'Toutes les factures futures et passées seront débitées sous 24h sur le moyen de paiement indiqué sur la souscription.',
        manualInfo:
          'Les factures passées seront indiquées comme payées manuellement et les prochaines factures seront débitées sur le moyen de paiement rentré par le membre.',
      },
      validate: 'Confirmer',
      cancel: 'Annuler',
    },

    list: {
      title: 'Contrats',
      titleCustomerAvailable: 'Contrats disponibles à la vente',
      titleManagerOnly: 'Contrats non-disponibles à la vente',
      isEmpty: 'Aucun contrat disponible',
      addButton: 'Définir un contrat',
      register: 'Abonner un membre',
      titleInactive: 'Contrats archivés',
    },
    interval: {
      month: 'mois',
      month_plural: 'mois',
      year: 'année',
      year_plural: 'années',
      day: 'jour',
      day_plural: 'jours',
      week: 'semaine',
      week_plural: 'semaines',
    },
    frequency: {
      month: 'mensuelle',
      week: 'hebdomadaire',
    },
    form: {
      title: 'Formulaire contrat',
      general_info: {
        title: 'Informations générales',
      },
      name: {
        label: 'Nom du contrat',
      },
      error: {
        missingObject: 'Ce champ est obligatoire',
      },
      object_type: {
        label: "Type d'abonnement",
        privatePass: 'Carte RDV',
        paymentPack: 'Carte de cours',
        paymentCombo: 'Pack',
      },
      price: {
        title: 'Prix',
      },
      invoicing: {
        title: 'Facturation',
        invoice: 'facture',
        invoice_plural: 'factures',
        same_day_as_subscription: {
          label: "Facturer le même jour que la date d'achat de la souscription",
          explain:
            "Le jour de facturation dépendra du jour d'achat de l'abonnement.",
          recurrence_explain: {
            day: 'La souscription sera facturée tous les jours sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            day_plural:
              'La souscription sera facturée tous les {{ recurrence_basis }} jours sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            week: 'La souscription sera facturée toutes les semaines sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            week_plural:
              'La souscription sera facturée toutes les {{ recurrence_basis }} semaines sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            month:
              'La souscription sera facturée tous les mois sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            month_plural:
              'La souscription sera facturée tous les {{ recurrence_basis }} mois sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            year: 'La souscription sera facturée tous les ans sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
            year_plural:
              'La souscription sera facturée tous les {{ recurrence_basis }} ans sur une durée totale de {{ total_subscription_duration }} {{ time_unit }} et génèrera {{ nb_interval }} {{ invoice }}. Le client pourra choisir la date de début de son abonnement.',
          },
        },
        fixed_day: {
          label: 'Facturer à un jour fixe',
          explain:
            'Chaque facture sera facturée au jour choisi. Le premier paiement est calculé au prorata si besoin.',
          recurrence_explain: {
            month:
              'La souscription sera facturée tous les {{ month_billing_day }} du mois sur une durée totale de {{ nb_interval }} mois et génèrera {{ nb_interval }} {{ invoice }}. Le premier paiement est calculé au prorata si besoin.',
          },
          end_of_month_explain:
            'Si un mois ne comporte pas de {{ month_billing_day }}, la facture sera éditée le dernier jour du mois.',
          modification_not_apply_to_past:
            'Vous êtes sur le point de modifier le jour de facturation de votre souscription. Seules les nouvelles souscriptions créées seront impactées. Les souscriptions en cours et les souscriptions avec renouvellement déjà existantes ne changeront pas (même après renouvellement)',
        },
        invoicing_type_readonly:
          'Il est impossible de changer le type de facturation',
      },
      month_billing_day: {
        label1: 'Facturer tous les',
        label2: 'du mois.',
      },
      nb_interval: {
        label: 'Nombre de facturations',
        error: 'Le nombre de facturations ne doit pas dépasser 90',
        errorForFixedBillingDay:
          'Le nombre de facturations ne doit pas dépasser 12',
      },
      interval: {
        label: 'Récurrence',
        helperText: 'Fréquence de génération des factures / cartes',
      },
      recurrence: {
        section: 'Récurrence',
        explain:
          'La souscription sera facturée tous les {{ recurrence_basis }} {{ interval }} sur une durée totale de {{ total_interval_duration }} {{ interval }} et génèrera {{ nb_interval }} factures',
      },
      recurrence_basis: {
        label: 'Répéter tous les',
        helperText: '',
        intervalName: {
          year: 'an',
          year_plural: 'ans',
          month: 'mois',
          month_plural: 'mois',
          day: 'jour',
          day_plural: 'jours',
          week: 'semaine',
          week_plural: 'semaines',
        },
      },
      recurrent_price: {
        label: 'Paiement récurrent',
        infoBox:
          'Vous êtes sur le point de modifier le prix de votre souscription. Seul le prix des nouvelles souscriptions créées sera impacté. Le prix des souscriptions en cours et des souscriptions avec renouvellement déjà existantes ne changera pas (même après renouvellement).',
      },
      description: {
        placeholder: 'Nouvelle offre exclusive limitée',
        label: 'Description',
      },
      settings: {
        title: 'Paramètres',
      },
      managerOnly: {
        label: 'Invisible pour les clients',
      },
      autoRenewal: {
        label: 'Renouvellement tacite',
      },
      unusableByStaff: {
        label: 'Invisible pour le staff',
      },
      flat_fee: {
        label: "Frais d'engagement/dossier",
        helperText: 'Ce frais sera ajouté à la première facture',
      },
      contract: {
        placeholder:
          'Entrez ici toutes les mentions légales nécessaires notamment concernant les procédures de remboursement.',
        label: 'Mentions légales',
      },
    },
    deleteForm: {
      title: 'Suppression contrat',
      content: 'Voulez-vous vraiment supprimer ce contrat ?',
      actions: {
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
    },
  },
  recap: {
    willBecharged: ' sera facturé ',
    every: ' chaque ',
    month: 'mois ',
    times: ' fois ',
    forObject: ' pour ',
    from: 'A partir du ',
    to: " jusqu'au ",
    forATotalOf: 'Pour un total de ',
    includingFreeTrialOf1: ' dont ',
    includingFreeTrialOf2: ' non-facturés ',
  },
  form: {
    check: 'Vérifier',
    submit: 'Facturer',
    title: 'Nouveau paiement récurrent',
    cancel: 'Annuler',
    note: {
      label: 'Note',
    },
  },
  plannedInvoiceStatus: {
    pending: 'En attente',
    canceled: 'Annulé',
    processing: 'Paiement en cours de transfert',
    failed: 'Paiement refusé',
    succeeded: 'Encaissé',
    reverted: 'Annulé',
  },
  subscriptionStatus: {
    pending: 'En cours de facturation',
    canceledOn: 'Stoppée le ',
    hasEnded: 'Facturation terminée',
    isPaused: 'En pause',
  },
  scheduledStop: {
    label: 'Arrêt programmé',
    unscheduleStop: "Déprogrammer l'arrêt",
  },
  action: {
    stop: 'Arrêter',
    planStop: "Programmer l'arrêt de la souscription",
    revertCurrentExplain:
      'Annuler la dernière facture enregistrée et bloquer la carte de cours',
    revertCurrentExplainHelper:
      'Si le paiement est valide, un crédit sera créé, vous pouvez le rembourser au client en entrant dans la facture et en cliquant "Rembourser". Si le paiement avait échoué, la dette sera annulée.',
    stopExplain:
      'Les prochains paiements seront annulés et les factures correspondantes seront supprimées. Si une réservation a été enregistrée avec un abonnement dont la facture a été annulée, elle sera également annulée.',
  },
  parameters: {
    note: 'Note',
    autoRenew: 'Renouvellement automatique',
    parameters: 'Paramètres',
    payment_method: {
      label: 'Moyen de paiement',
      [BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT]: 'A crédit',
      [BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB]: 'Carte',
      [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]: 'Virement SEPA',
    },
    payment_method_group: {
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: 'Carte',
      14: 'Credit',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: 'SEPA',
    },
    status: 'Statut',
    subscribeAgain: 'Souscrire à nouveau',
    voucher: 'Offre spéciale',
    trial_nb: 'Nombre de facturations offertes',
    recurrent_voucher: 'Réduction sur chaque facture',
    name: 'Nom',
    member: 'Membre',
    dateCreated: 'Date de création',
    nbInterval: "Nombre d'encaissements",
    recurrent_price: 'Paiement récurrent',
    flat_fee: 'Frais de dossier',
    paymentPack: 'Carte de cours',
    privatePass: 'Carte RDV',
    paymentCombo: 'Pack',
    nbMonths: "Nombre d'encaissements",
    dateStart: 'Première facturation',
    firstBilling: 'Premier encaissement',
    payment_pack: 'Carte de cours',
    private_pass: 'Carte RDV',
    payment_combo: 'Pack',
    contractTermsAccepted:
      'Les <0>mentions légales</0> ont été acceptées le {{- dateAccepted}}.',
  },
  schedule: {
    provisionalTitle: 'Echéancier prévisionnel',
    paymentMethodTitle: 'Méthode de débit',
  },
  paymentMethod: {
    sepa: 'Prélèvement SEPA',
    card: 'Carte',
    bsportCredit: 'Acompte client',
    credit: {
      explain:
        "Le membre sera facturé sur son acompte interne chaque facture. Utilisez cette méthode de paiement si vous n'avez pas (encore) accès à une méthode facturation telle que la carte ou le virement IBAN. Vous pourrez mettre à jour le paiement à posteriori.",
    },
  },
  mandate: {
    name: 'Nom et prénom du titulaire',
    email: 'Email du titulaire',
    content:
      "En donnant votre IBAN et en confirmant votre paiement, vous autorisez bsport et Stripe, notre système de paiement, à envoyer les instructions de débit à votre banque en accord avec l'échéancier de paiement. Vous pouvez demander un remboursement à votre banque selon les termes de votre contrat avec cette dernière. Un remboursement doit être demandé dans les 8 semaines après le premier débit.",
  },
  associatedSubscriptions: 'Souscriptions associées à ce contrat',
  noAssociatedSubscription: 'Aucune souscription enregistrée',
  listItem: {
    subscribedOn: 'Souscription débutée le {{- date}}',
    canceled: 'Stoppée',
    expired: 'Expirée',
    paused: 'En pause',
    valid: 'Valide',
  },
  copyLink: 'Copier le lien vers la page de paiement',
  pauseV2: {
    common: {
      actions: {
        cancel: 'Annuler',
        confirm: 'Confirmer',
        pause: 'Mettre en pause',
        verify: 'Vérifier',
        previous: 'Précédent',
        goBack: 'Retour',
        save: 'Enregistrer',
        continue: 'Continuer',
      },
      form: {
        reasonPlaceholder: 'Raison *',
        duration: {
          title: 'Durée de la pause',
          start: 'Date de début (incluse)',
          end: 'Date de fin (incluse)',
          warning:
            'La date de fin ne peut pas être inférieure à la date de début',
        },
      },
      deleteDialog: {
        title: 'Déprogrammer la pause',
      },
      listItem: {
        fromToUntil: 'Du {{- fromDate}} au {{- untilDate}}',
        createdAtBy: 'Créée le {{- dateCreation}} par {{staffName}}',
        createdAt: 'Créée le {{- dateCreation}}',
        deletedAtBy: 'Déprogrammée le {{- dateDeletion}} par {{staffName}}',
        deletedAt: 'Déprogrammée le {{- dateDeletion}}',
        pausedAt: '{{ days }} jours - Le {{- date}}',
        label: 'Pause du {{- fromDate}} au {{- untilDate}}',
        isUpdated: 'Pause éditée',
      },
      menu: {
        delete: 'Déprogrammer',
        change: 'Changer les dates',
        changeName: 'Changer la raison',
        changeContractForbidden:
          "Vous ne pouvez pas éditer une pause créée à l'échelle du contrat.",
        changeForbidden: 'Vous ne pouvez pas éditer une pause déjà finie.',
        cancelForbidden:
          'Vous ne pouvez pas annuler une pause dont la date de début est déjà passée.',
      },
    },
    contractPause: {
      title: 'Pauses globales',
      form: {
        firstStep: {
          titleCreation: 'Mise en pause globale',
          titleUpdate: 'Modifier la mise en pause globale',
          information1:
            'Les abonnements seront mis en pause du {{- fromDate}} au {{- untilDate}} inclus. Leur prochaine facturation sera décalée de {{count}} jour, de même pour toutes les facturations et cartes futures.',
          information1_plural:
            'Les abonnements seront mis en pause du {{- fromDate}} au {{- untilDate}} inclus. Leur prochaine facturation sera décalée de {{count}} jours, de même pour toutes les facturations et cartes futures.',
          information2:
            "La date d'expiration de la carte sera repoussée du nombre de jour de la pause et la carte restera valide pendant celle-ci.",
        },
        secondStep: {
          title: 'Vérification',
          sectionSuccess: 'Souscriptions mises en pause',
          sectionFailure: 'Échec de mise en pause ',
          noCompatibleSubscriptions:
            'Aucune souscription ne peut être mise en pause.',
          incompatibleSubscriptions:
            "Les souscriptions suivantes n'ont pas pu être mises en pause pour une des raisons suivantes : un paiement compris dans l'intervalle de pause est prévu dans les 24h, un paiement d'une facture future est en cours, la période choisie chevauche une autre pause déjà prévue, l'abonnement n'a pas encore commencé.",
        },
        thirdStep: {
          title: "Mise en pause globale de l'abonnement",
          successExplanation:
            '{{ count }} abonnement a bien été mis en pause du {{- fromDate}} au {{- untilDate}} inclus.',
          successExplanation_plural:
            '{{ count }} abonnements ont bien été mis en pause du {{- fromDate}} au {{- untilDate}} inclus.',
        },
      },
      deleteDialogContent:
        "Êtes-vous sûr de vouloir déprogrammer cette pause pour l'ensemble des souscriptions ?",
      updateNameDialogTitle: 'Modification de la raison de la pause',
      sections: {
        success: '{{count}} souscription mise en pause',
        success_plural: '{{count}} souscriptions mises en pause',
        error:
          "{{count}} souscription n'a pas pu être mise en pause automatiquement",
        error_plural:
          "{{count}} souscriptions n'ont pas pu être mises en pause automatiquement",
      },
    },
    subscriptionPause: {
      form: {
        initStep: {
          titleCreation: 'Mise en pause',
          titleUpdate: 'Modifier la mise en pause',
          information1:
            "L'abonnement sera mis en pause du {{- fromDate}} au {{- untilDate}} inclus. La prochaine facturation suite à la pause sera décalée de {{count}} jour, de même pour toutes les facturations futures.",
          information1_plural:
            "L'abonnement sera mis en pause du {{- fromDate}} au {{- untilDate}} inclus. La prochaine facturation suite à la pause sera sera décalée de {{count}} jours, de même pour toutes les facturations futures.",
          information2:
            "La date d'expiration de la carte sera repoussée du nombre de jours de la pause et la carte restera valide pendant celle-ci.",
        },
        successStep: {
          title: "Mise en pause de l'abonnement",
          content:
            "L'abonnement {{- subscriptionName}} de {{subscriberName}} a bien été mis en pause du {{- fromDate}} au {{- untilDate}} inclus.",
        },
        failureStep: {
          title: 'Échec de mise en pause',
          contentIncomingBill:
            "L'abonnement {{- subscriptionName}} de {{subscriberName}} n'a pas pu être mis en pause car une facture dans l'interval de pause va être facturée dans les 24h, ou une facture future est en cours de paiment. Merci de changer la date de début de la pause.",
          contentOverlapPause:
            "L'abonnement {{- subscriptionName}} de {{subscriberName}} n'a pas pu être mis en pause car une pause est déjà prévue du {{- fromDate}} au {{- untilDate}}.",
          contentInvalidTimedelta: 'La pause doit au moins durer une journée.',
          contentCanNotCancelPause:
            'La pause ayant déjà commencé ou étant déjà passée, elle ne peut pas être annulée.',
          contentSubscriptionWillEndBeforePause:
            "La subscription ne peut être mise en pause sur cette période car celle-ci aura pris fin avant ou son renouvellement n'a pas encore été exécuté à l'heure actuelle.",
          contentCanNotEditPauseStartWhenHasStarted:
            'La date de début de la pause ne peut être changée dès lors que celle-ci a commencé.',
          contentCanNotEditPauseEndBeforeToday:
            "La nouvelle date de début de la pause ne peut être placée avant aujourd'hui.",
          contentCanNotCreateAPauseInThePast:
            'La pause ne peut commencer dans le passé.',
          contentSubscriptionHasNotStarted:
            "La mise en pause n'a pas été effectuée car l'intervalle de dates de la pause se situe avant le début de la souscription.",
          contentUnknownError:
            'Une erreur imprévue est survenue. Veuillez nous excuser pour la gêne occasionnée.',
        },
      },
      deleteDialogContent:
        'Êtes-vous sûr de vouloir déprogrammer cette pause ?',
      eventItems: {
        pauseCreatedThenDeleted: 'Cette pause a été supprimée ou modifiée.',
        pauseDeleted: "Raison de l'ancienne pause : {{pause_name}}",
      },
    },
  },
  alreadySubscribed: {
    dialog: {
      validate: 'Ok',
      content:
        "Vous avez déjà acheté cet abonnement récemment. Si vous ne le voyez pas encore, veuillez attendre quelques minutes. Toutefois, si vous souhaitez l'acheter à nouveau, attendez quelques minutes et réessayez.",
      title: 'Déjà abonné',
    },
  },
};
