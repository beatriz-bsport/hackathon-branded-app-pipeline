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

exports.default = {
  creditAccountBalance: { current: 'Acompte actuel' },
  invoice: {
    title: 'Facture {{ uuid }}',
    editor: {
      title: 'Edition de la facture',
    },
    header: {
      date: 'Date : {{ date }}',
      author: 'Créé par : {{ name }}',
      clientAuthor: 'Client',
      source: {
        label: 'Canal : {{ source }}',
        [SOURCE_APP]: 'App',
        [SOURCE_WEB]: 'Web',
        [SOURCE_SAAS]: 'Backoffice',
        [SOURCE_OTHER]: 'Autre',
      },
    },
},
invoiceInfoDialog: {
explain: "Un ou plusieurs paiements ne sont pas passés correctement, l'acompte du membre reflète l'echec du paiement",
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
      isEmpty: 'Aucun achat',
      total: 'Total achat',
    },
    paymentList: {
      title: 'Moyens de paiement',
      isEmpty: 'Aucun moyen de paiement enregistré',
      total: 'Total paiement',
    },
  },
};
