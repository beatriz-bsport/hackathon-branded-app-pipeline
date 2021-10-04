exports.default = {
  search: 'Rechercher un pack',
  pageTitle: {
    list: 'Packs',
  },
  link: {
    copied: 'Lien copié',
    copyLink: 'Copier le lien vers la page de paiement',
  },
  list: {
    section: {
      unavailableOnline: 'Non disponible à la vente',
      availableOnline: 'Disponible à la vente',
    },
    explainIfEmpty:
      'Créer ici des packs achetables par les élèves pouvant contenir des cartes de cours, des objets du magasin, etc...',
    buttons: {
      add: 'Créer un pack',
    },
  },
  form: {
    title: 'Formulaire pack',
    maxPurchasePerMember: {
      label: 'Achat maximum par membre',
      helperText: 'Laisser vide pour ne pas imposer de limite',
    },
    name: {
      label: 'Nom',
    },
    description: {
      label: 'Description',
    },
    price: {
      label: 'Prix',
    },
    tax: {
      label: 'TVA',
    },
    manager_only: {
      label: 'Invisible pour les clients',
    },
    new_member_only: {
      label: 'Uniquement pour les nouveaux clients',
    },
    actions: {
      submit: 'Enregistrer',
      cancel: 'Annuler',
    },
    content: 'Contenu',
    selectorPlaceholder: {
      privatePass: 'Carte RDV',
      paymentPack: 'Carte cours collectif',
      shopitem: 'Magasin',
    },
    available_payment_method_identifiers: {
      label: 'Moyens de paiement autorisés',
      helperText:
        'Sélectionnez au moins un moyen de paiement. Si le panier du membre contient des éléments dont les moyens de paiements sont incompatibles, le paiement CB sera proposé.',
    },
  },
  detail: {
    containsNProducts: 'Contient {{ n }} produits',
    description: 'Description',
    content: 'Contenu',
    purchases: 'Ventes',
    emptyContent: 'Ce pack ne contient rien !',
  },
  edit: 'Modifier',
  delete: {
    title: 'Suppression du pack',
    content:
      'Voulez-vous vraiment supprimer ce pack ? Cette opération est irréversible, les achats déjà effectués et les paniers en cours ne seront pas affectés.',
    cancel: 'Annuler',
    submit: 'Supprimer',
  },
};
