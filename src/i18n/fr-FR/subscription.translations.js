const PAYMENT_METHOD = require('@bsport/common/lib/master-data/subscription-payment-methods');

const {
  BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} = PAYMENT_METHOD;

const {
  BILLING_PLAN_EVENTS,
} = require('@bsport/common/lib/master-data/events');

exports.default = {
  events: {
    list: {
      title: 'Derniers évènements',
    },
    [BILLING_PLAN_EVENTS.pause]: 'Pause',
    [BILLING_PLAN_EVENTS.create]: 'Création',
    [BILLING_PLAN_EVENTS.stop]: 'Arrêt',
    [BILLING_PLAN_EVENTS.renew]: 'Renouvellement',
    [BILLING_PLAN_EVENTS.payment_dispute]: 'Litige',
    [BILLING_PLAN_EVENTS.payment_success]: 'Paiement réussi',
    [BILLING_PLAN_EVENTS.payment_failure]: 'Paiement refusé',
    [BILLING_PLAN_EVENTS.update_payment_method]: 'Méthode de paiement modifiée',
    [BILLING_PLAN_EVENTS.update_payment_pack]: 'Carte de cours modifiée',
  },
  cancel: 'annuler',
  save: 'valider',
  table: {
    noContent: 'Aucune souscription enregistrée',
  },
  noContracts:
    'Les contrats vous permettront de facturer régulièrement (mensuellement) vos membres pour une carte de cours recréditée tous les mois.',
  subscription: {
    list: {
      title: 'Souscription en cours',
    },
    actionSection: 'Gérer',
    invoicesSection: 'Factures',
    pauseSection: 'Pauses',
    switchPack: {
      form: {
        title: 'Changement de carte de cours',
        explain:
          "Cette carte de cours sera facturée à la place de l'ancienne sur toutes les prochaines factures. Les séances réservées avec l'ancienne carte seront transférés sur la nouvelle même si celle-ci n'est pas censée être compatible.",
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
        explain:
          "Le prochain paiement sera retardé d'autant de jours, de même pour les cartes de cours futures",
        explainWarning: "Attention cette opération n'est pas reversible !",
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
    },
    actions: {
      freeze: 'Mettre en pause',
      switchPack: 'Modifier la carte de cours',
      switchPaymentMethod: 'Modifier la méthode paiement',
    },
  },
  pause: {
    pausedInterval: '{{start}} → {{ end }} : {{ days }} jours', // deprecated
    pausedAt: '{{ days }} jours - le {{ date }}',
  },
  plannedInvoice: {
    list: {
      titleNext: 'Prochains prélèvements',
    },
    priceUpdater: {
      title: 'Modification montant futur',
      price: 'Nouveau montant',
      explain: 'Seule cette future facture sera modifiée',
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
  },
  contract: {
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
    duration: '{{month}} mois',
    description: 'Description',
    legal: 'Mentions légales',
    actions: {
      create: 'Ajouter un contrat',
      iAcceptCondition: "J'accepte les conditions ci-dessus",
      iwanttostarton: 'Je souhaite débuter la facturation le : ',
      subscribe: "M'abonner",
    },
    list: {
      title: 'Contrats',
      titleCustomerAvailable: 'Contrats disponibles à la vente',
      titleManagerOnly: 'Contrats non-disponibles à la vente',
      isEmpty: 'Aucun contrat disponible',
      addButton: 'Définir un contrat',
      register: 'Abonner un membre',
    },
    form: {
      title: 'Formulaire contrat',
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
      },
      nb_interval: {
        label: 'Nombre de mois',
        helperText: 'Au minimum 2 mois',
      },
      recurrent_price: {
        label: 'Paiement mensuel',
      },
      description: {
        placeholder: 'Nouvelle offre exclusive limitée',
        label: 'Description',
      },
      managerOnly: {
        label: 'Invisible pour les clients',
      },
      autoRenewal: {
        label: 'Renouvellement tacite',
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
  },
  plannedInvoiceStatus: {
    pending: 'En attente',
    canceled: 'Annulé',
    processing: 'Paiement en cours de transfert',
    failed: 'Paiement refusé',
    succeeded: 'Encaissé',
  },
  subscriptionStatus: {
    pending: 'En cours de facturation',
    canceledOn: 'Stoppée le ',
    hasEnded: 'Facturation terminée',
    isPaused: 'En pause',
  },
  action: {
    stop: 'Arrêter',
    revertCurrentExplain:
      'Annuler la dernière facture enregistrée et bloquer la carte de cours',
    revertCurrentExplainHelper:
      'Si le paiement est valide, un crédit sera créé, vous pouvez le rembourser au client en entrant dans la facture et en cliquant "Rembourser". Si le paiement avait échoué, la dette sera annulée.',
    stopExplain:
      'Les prochains paiements seront annulés et les factures correspondantes seront supprimées. Si une réservation a été enregistrée avec un abonnement dont la facture a été annulée, elle sera également annulée.',
  },
  parameters: {
    autoRenew: 'Renouvellement automatique',
    parameters: 'Paramètres',
    payment_method: {
      label: 'Méthode de paiement',
      [BILLING_PLAN_PAYMENT_METHOD_BSPORT_CREDIT]: 'A crédit',
      [BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB]: 'Carte bleue',
      [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]: 'Virement SEPA',
    },
    status: 'Statut',
    subscribeAgain: 'Souscrire à nouveau',
    voucher: 'Offre spéciale',
    trial_nb: 'Nombre de mois offerts',
    recurrent_voucher: 'Réduction sur chaque facture',
    name: 'Nom',
    member: 'Membre',
    dateCreated: 'Date de création',
    nbInterval: 'Nombre de mois',
    recurrent_price: 'Paiement récurrent',
    flat_fee: 'Frais de dossier',
    paymentPack: 'Carte de cours',
    privatePass: 'Carte RDV',
    nbMonths: 'Nombre de mois',
    dateStart: 'Première facturation',
    firstBilling: 'Premier encaissement',
    payment_pack: 'Carte de cours',
  },
  schedule: {
    provisionalTitle: 'Echéancier prévisionnel',
    paymentMethodTitle: 'Méthode de débit',
  },
  paymentMethod: {
    sepa: 'Prélèvement SEPA',
    card: 'Carte bleue',
    bsportCredit: 'Accompte client',
    credit: {
      explain:
        "Le membre sera facturé sur son acompte interne chaque mois. Utilisez cette méthode de paiement si vous n'avez pas (encore) accès à une méthode facturation telle que la carte bleue ou le virement IBAN. Vous pourrez mettre à jour le paiement à posteriori.",
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
};
