export default {
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
    qty: 'Quantité',
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
};
