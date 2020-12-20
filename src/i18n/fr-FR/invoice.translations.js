const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_CREDIT,
} = require('@bsport/common/lib/master-data/buyable-items');
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
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_BSPORT,
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
} = require('@bsport/common/lib/master-data/payment-group');

exports.default = {
  creditAccountBalance: { current: 'Solde actuel' },
  invoice: {
    title: 'Facture {{ uuid }}',
    titleRevert: 'Avoir {{ uuid }}',
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
      explainDecaissement: 'Un décaissement de {{ amount }} € sera enregistré.',
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
    goToSubscription: 'Voir la souscription',
    goToPaymentEditor: 'Paiement',
    backToInvoiceItemEditor: 'Achat',
    save: 'Enregistrer',
    addInvoiceItem: 'Ajouter à la facture',
    equilibrate: 'Equilibrer (acompte)',
    download: 'Télécharger PDF',
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
