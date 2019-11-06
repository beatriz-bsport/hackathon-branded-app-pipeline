export default {
  pageTitle: {
    list: 'Packs',
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
    actions: {
      submit: 'Enregistrer',
      cancel: 'Annuler',
    },
    content: 'Contenu',
    selectorPlaceholder: {
      privatePass: 'Carte cours privé',
      paymentPack: 'Carte cours collectif',
      shopitem: 'Magasin',
    },
  },
  detail: {
    containsNProducts: 'Contient {{ n }} produits',
    description: 'Description',
    content: 'Contenu',
    purchases: 'Ventes',
    emptyContent: 'Ce pack ne contient rien !',
  },
  delete: {
    title: 'Suppression du pack',
    content:
      'Voulez-vous vraiment supprimer ce pack ? Cette opération est irréversible, les achats déjà effectués et les paniers en cours ne seront pas affectés.',
    cancel: 'Annuler',
    submit: 'Supprimer',
  },
};
