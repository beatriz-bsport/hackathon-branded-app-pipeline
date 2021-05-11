const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_CREDIT,
} = require('@bsport/common/lib/master-data/buyable-items');
const {
  INVOICE_TYPE_MIGRATION,
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
} = require('@bsport/common/lib/master-data/invoice-type');
const {
  SOURCE_APP,
  SOURCE_WEB,
  SOURCE_SAAS,
  SOURCE_OTHER,
} = require('@bsport/common/lib/master-data/source-device');
const {
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CHECK,
  PAYMENT_GROUP_METHOD_IDENTIFIER_HOLIDAY_CHECK,
  PAYMENT_GROUP_METHOD_IDENTIFIER_AMEX,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TRANSFER,
  PAYMENT_GROUP_METHOD_IDENTIFIER_OTHER,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_BSPORT,
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
} = require('@bsport/common/lib/master-data/payment-group');

exports.default = {
  paymentGroup: {
    validateRequiresAction: 'Confirmer le moyen de paiement',
    requiresAction: "La banque n'a pas authentifié le paiement (3DSecure)",
  },
  invoiceInfo: {
    [INVOICE_TYPE_MIGRATION]:
      "Cette facture est issue d'une migration. Nous ne sommes pas en mesure de fournir un PDF ni de l'annuler pour des raisons légales.",
    [INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER]:
      "Ce reçu de paiement représente l'ajustement de solde de votre membre.",
  },
  invoiceType: {
    regular: 'Facture',
    migration: 'Migration',
    credit_payment: 'Reçu (régul. solde)',
    return: 'Facture de retour',
    reversed: 'Facture (annulée)',
  },
  creditAccountBalance: { current: 'Solde actuel' },
  mandate: {
    name: 'Nom et prénom du titulaire',
    email: 'Email du titulaire',
    content:
      "En donnant votre IBAN et en confirmant votre paiement, vous autorisez bsport et Stripe, notre système de paiement, à envoyer les instructions de débit à votre banque en accord avec l'échéancier de paiement. Vous pouvez demander un remboursement à votre banque selon les termes de votre contrat avec cette dernière. Un remboursement doit être demandé dans les 8 semaines après le premier débit.",
  },
  invoice: {
    title: 'Facture {{ uuid }}',
    titleRevert: 'Avoir {{ uuid }}',
    titleReverted: 'Facture (annulée) {{ uuid }}',
    titleReceipt: 'Reçu {{ uuid }}',
    editor: {
      title: 'Edition de la facture',
      sumup: 'Récapitulatif',
      save: 'Émettre la facture',
    },
    header: {
      date: 'Date : {{ date }}',
      author: 'Créé par : {{ name }}',
      clientAuthor: 'Client',
      sourceInvoice: 'Annule la facture',
      reverseInvoice: 'Remboursé via ',
      source: {
        label: 'Canal : {{ source }}',
        [SOURCE_APP]: 'App',
        [SOURCE_WEB]: 'Web',
        [SOURCE_SAAS]: 'Backoffice',
        [SOURCE_OTHER]: 'Autre',
      },
    },
  },
  paymentEngine: {
    label: {
      [PAYMENT_ENGINE_STRIPE]: 'Paiement en ligne',
      [PAYMENT_ENGINE_BSPORT]: 'Paiement manuel',
    },
  },
  paymentMethod: {
    title: 'Moyen de paiement',
    edit: 'Modifier',
    add: 'Ajouter',
    none: 'Aucun moyen de paiment sauvergardé',
    isInternalExplain:
      'Acompte client (manuel): tous les mois une dette est automatiquement créée dans le compte du membre.',
    select: {
      label: 'Moyen de paiement',
    },
    label: {
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: 'Carte bleue',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL]: 'Carte bleue (manuel)',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CHECK]: 'Chèque',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_HOLIDAY_CHECK]: 'Chèque vacances',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CASH]: 'Espèces',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_AMEX]: 'AMEX',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_MOBILEPAY]: 'Acompte client (dette)',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE]: 'Litige',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_TRANSFER]: 'Virement',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_OTHER]: 'Divers',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: 'SEPA',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: 'Bancontact',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: 'iDEAL',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: 'Sofort',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: 'EPS',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: 'Giropay',
    },
  },
  plannedPaymentEvent: {
    actions: {
      registerNow: 'Encaisser maintenant',
      delete: 'Annuler',
      edit: 'Modifier',
    },
    nextRetryDate: 'Le paiement sera retenté le {{ d }}',
  },
  paymentPanel: {
    amountRemaining: 'Reste à payer: {{ amount }}',
    errorSecretExplain1: 'Ce mode de paiement est indisponible pour le moment',
    errorSecretExplain2:
      'Si le problème persiste, contactez dev+payment-intent@bsport.io',
    billingMoreThanNeeded:
      'En encaissant plus que le montant de la facture, le solde du membre sera augmenté de la différence',
    amount: {
      label: 'Montant à encaisser',
    },
    paymentNote: {
      label: 'Note',
      helperText: "(optionnel) numéro du chèque, date d'encaissement...",
    },
    date: {
      label: "Date d'encaissement",
    },
    sumup: {
      title: 'Récapitulatif',
      amountDue: 'Total dû',
      amountPaid: 'Encaissement',
      amountRemaining: 'Reste à payer',
    },
    actions: {
      bill: 'Encaisser',
      pay: 'Régler cette facture',
      revert: 'Annuler',
      cancel: 'Annuler',
      payAll: 'Régler la dette client',
      confirmPayment: 'Confirmer le paiement',
      showInvoice: 'Voir la facture',
      saveForLater: 'Sauvegarder ce moyen de paiement',
      saveForLaterAsSEPA: 'Le mandat sera enregistré en tant que "SEPA"',
    },
    paymentList: {
      title: 'Paiements',
      titleReverse: 'Remboursement',
      isEmpty: 'Aucun paiement',
    },
    plannedPaymentEvent: {
      title: 'Paiement planifié',
      title_plural: 'Paiements planifiés',
    },
    fields: {
      accountHolderName: {
        label: 'Titulaire du compte',
        placeholder: 'Marie Dupont',
      },
      email: {
        label: 'Email du titulaire du compte',
        placeholder: 'marie@dupont.fr',
      },
      country: {
        label: 'Pays du compte bancaire',
        placeholder: 'France',
      },
    },
  },
  invoiceInfoDialog: {
    explain:
      "Un ou plusieurs paiements ne sont pas passés correctement, l'acompte du membre reflète l'echec du paiement",
    actions: {
      show: 'Voir la facture',
      close: 'Fermer',
    },
  },
  uneditableMessage: {
    invoiceRevertedThusNotEditable:
      "La facture a été annulée et n'est plus modifiable",
    invoiceFromSubscriptionThusNotEditable:
      "Cette facture fait partie d'une souscription et n'est donc pas éditable, veuillez modifier directement la souscription",
    invoiceFinalizedThusNotEditable:
      "La facture a été finalisée et n'est donc plus modifiable",
  },
  balance: {
    updaterDialog: {
      title: 'Ajustement de solde',
      typeLabel: "Type d'ajustement",
      balanceValueLabel: 'Montant',
      withoutPaymentNote: {
        label: 'Ne pas générer de reçu',
        warning:
          'Attention: nous ne garderons aucune trace de cette opération. À utiliser uniquement pour des ajustements exceptionnels.',
      },
      explainDecaissement:
        'Un décaissement de {{ amount }} {{ currencyDisplay }} sera enregistré.',
      explainTopup:
        'Une augmentation de {{ amount }} € sera enregistré au solde du membre.',
      debt: 'Décaissement',
      topup: 'Encaissement',
      actions: {
        submit: 'Suivant',
        cancel: 'Annuler',
      },
    },
  },
  actions: {
    invoiceReverted: 'Facture annulée',
    revert: 'Annuler',
    addFooter: 'Modifier la note de bas de facture',
    goToSubscription: 'Voir la souscription',
    goToPaymentEditor: 'Paiement',
    backToInvoiceItemEditor: 'Achat',
    save: 'Enregistrer',
    addInvoiceItem: 'Ajouter à la facture',
    equilibrate: 'Equilibrer (acompte)',
    download: 'Télécharger PDF',
    explainPdfDraft:
      "La facture est encore à l'état de brouillon, le pdf n'est pas disponible.",
    finalize: 'Finaliser (PDF)',
    consumeBalance: 'Payer via solde',
  },
  returnPayment: {
    modal: {
      title: 'Remboursement client',
      content:
        'Le paiement sera reversé sur le compte BANCAIRE du client, un acompte du même montant sera ajoutée à la facture pour symboliser le paiement.',
      cancel: 'Annuler',
      confirm: 'Rembourser',
    },
  },
  configuration: {
    stripe_footer: 'Bas de page facture',
    subscription: {
      title: 'Souscription',
      forms: {
        activateSmartRetries: {
          label: 'Activer Smart Retries sur les échecs de paiement',
          helperText:
            'bsport réessaiera automatiquement les paiements échoués des souscriptions, au meilleur moment.',
        },
        nbRetriesSubscriptionPayments: {
          label: 'Nombres de tentatives après un échec de paiement',
          helperText: 'Entre 0 et 5 tentatives',
        },
      },
    },
    explainStripeFooter:
      'Ce texte apparaitra en bas de vos factures éditées en PDF, ajoutez toute mention légale nécessaire.',
    submit_stripe_footer: 'Mettre à jour',
    forms: {
      stripe_footer_placeholder: 'Aucune mention supplémentaire',
    },
    nf525: 'Certification',
    nf525Explain:
      'Bsport suit les procédures de mise en confiormité NF525, vous pouvez ici télécharger notre attestation officielle.',
    nf525Button: 'Télécharger',
  },
  invoiceItem: {
    buyableItemIdentifier: {
      [BUYABLE_ITEM_PASS]: 'Carte de cours',
      [BUYABLE_ITEM_SHOP_ITEM]: 'Magasin',
      [BUYABLE_ITEM_PRIVATE_PASS]: 'Carte RDV',
      [BUYABLE_ITEM_COMBO_ITEM]: 'Pack',
      [BUYABLE_ITEM_CREDIT]: 'Crédit',
    },
    credit: {
      label: 'Crédit',
    },
    quantity: 'Quantité',
    voucher: 'Réduction: {{ voucher }} €',
  },
  section: {
    invoiceItemList: {
      title: 'Achats',
      titleReverse: 'Retour achat',
      isEmpty: 'Aucun achat',
      total: 'Total achat',
    },
    paymentList: {
      title: 'Moyens de paiement',
      isEmpty: 'Aucun moyen de paiement enregistré',
      total: 'Total paiement',
    },
  },
  table: {
    actions: {
      goToInvoice: 'Voir la facture',
    },
    header: {
      member: 'Membre',
      id: 'Identifiant',
      date: 'Date de facturation',
      amount: 'Montant dû',
      missing: 'Restant dû',
      invoiceType: 'Type',
      pdf: 'PDF',
    },
    nested: {
      invoiceItem: {
        title: 'Achats',
        isEmpty: 'Aucun achat',
        header: {
          product: 'Nom',
          price: 'Montant TTC',
          priceExcTax: 'Montant HT',
          voucher: 'Dont réduction',
        },
      },
      payment: {
        title: 'Paiement',
        isEmpty: 'Aucun paiement',
        header: {
          paymentMethod: 'Méthode de paiement',
          price: 'Montant',
          date: 'Date',
          paymentReceived: 'Status',
        },
      },
    },
  },
  revert: {
    dialog: {
      actions: {
        cancel: 'Annuler',
        confirm: 'Rembourser',
      },
      title: 'Annulation facture',
    },
    content: {
      label: {
        [REVERSE_ON_PAYMENT_METHOD]: 'Remboursement direct',
        [REVERSE_ON_DEBT]: 'Remboursement en avoir (solde)',
        [REVERSE_ON_NEW_PAYMENT_METHOD]: 'Remboursement manuel',
      },
      explainEmptyPayment: 'Êtes vous sûr de vouloir annuler cette facture ?',
      explain: {
        [REVERSE_ON_PAYMENT_METHOD]:
          'Les paiements carte bleue / SEPA / etc... seront reversé directement sur le compte du client. Utilisez cette méthode pour opérer un remboursement direct suite à une erreur.',
        [REVERSE_ON_DEBT]:
          "Un avoir sera généré et incrémentera d'autant le solde client. Utilisez cette méthode pour générer un avoir.",
        [REVERSE_ON_NEW_PAYMENT_METHOD]:
          'Choisissez vous-même le moyen de remboursement. Utilisez cette méthode pour un remboursement chèque / virement manuel / espèces.',
      },
    },
  },
};
