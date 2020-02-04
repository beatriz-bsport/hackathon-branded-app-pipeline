export default {
  select: {
    placeholder: 'Article magasin',
  },
  link: {
    copyLink: 'Copier le lien vers la page de paiement',
    copied: 'Lien copié',
  },
  search: 'Chercher un produit',
  dialog: {
    delete: {
      title: 'Suppression de {{shopitem.name}}',
      cancel: 'Annuler',
      confirm: 'Supprimer',
      explain:
        "Êtes-vous sûr de vouloir supprimer cet élément du magasin ? Cette opération est irréversible, vous n'aurez plus accès à l'historique des stocks.",
    },
  },
  provision: {
    total_sales: "Nombre d'articles vendus :",
    current_stock: 'Stock actuel :',
    noProvisionHistory: 'Aucun historique de vente',
    form: {
      title: 'Modification du stock',
      quantityLabel: 'Unité(s)',
      quantityHelperText: 'Unité à ajouter/soustraire du stock',
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
    action: {
      update: 'Actualiser le stock',
    },
  },
  shopitem: {
    noDescription: 'Aucune description',
    selector: {
      placeholder: 'Rechercher par nom ou code-barre',
    },
    detail: {
      enabled: 'Oui',
      disabled: 'Non',
      title: 'Fiche produit',
      provisionHistory: 'Evolution du stock',
      parameters: 'Paramètres',
      supplier_price: 'Prix fournisseur',
      marketplace_enabled: 'Disponible marketplace Web',
      is_deliverable: 'Frais de livraison',
      onsite_payment_available: 'Paiement sur place',
    },
    action: {
      edit: 'Modifier',
      addToCard: 'Ajouter au panier',
      delete: 'Supprimer',
    },
  },
};
