exports.default = {
  products: {
    nbProducts: 'articles',
  },
  state: {
    0: 'En attente',
    700: 'Payé',
    1100: 'Annulé',
    1200: 'A récupérer sur place',
    9000: 'Expédié',
  },
  table: {
    name: 'Acheteur',
    state: 'Status',
    updated_at: 'Mis à jour le',
    created_at: 'Créée le',
    qty: 'Quantité',
  },
  form: {
    delivery: {
      first_name: 'Prénom',
      last_name: 'Nom de famille',
    },
  },
  actions: {
    flagAsCancelled: 'Annuler',
    flagAsOnSiteDelivery: 'A récupérer sur place',
    flagAsSent: 'Expédié',
  },
  detail: {
    section: {
      title: 'Status de la commande :',
      deliveryInfo: 'Addresse de livraison',
      productDetail: 'Détails du panier',
      invoice: 'Facture liée',
      member: 'Acheteur',
    },
  },
  deliveryFee: {
    name: 'Nom',
    fee: 'Frais de livraison',
    free_threshold: 'Offert à partir de',
    offeredAboveAmount: "Offert après {{ free_threshold, price }} d'achat",
    modal: {
      delete: {
        title: 'Supprimer un frais de livraison',
        content:
          'Attention cette opération est définitive, les anciennes commandes utilisant ce frais ne seront pas modifiées.',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
    },
    forms: {
      create: 'Ajouter un frais de livraison',
      title: 'Formulaire frais de livraison',
      feeLabel: 'Frais de livraison',
      nameLabel: 'Nom',
      freeThresholdLabel: 'Offert à partir de',
      freeThresholdHelper:
        'Si le montant de la commande dépasse ce montant, les frais de livraison sont offerts',
      onCancel: 'Annuler',
      onSubmit: 'Enregistrer',
    },
  },
  configuration: {
    deliveryFee: 'Frais de livraison',
    forms: {
      onSubmit: 'Enregistrer',
    },
    noDefaultDeliveryFee: 'Aucun frais de livraison',
    defaultDeliveryFee: 'Frais de livraison par défaut',
  },
};
