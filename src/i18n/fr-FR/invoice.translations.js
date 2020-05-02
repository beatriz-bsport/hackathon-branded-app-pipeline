exports.default = {
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
};
