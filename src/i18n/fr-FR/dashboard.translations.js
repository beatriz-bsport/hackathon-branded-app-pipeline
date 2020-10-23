const BUYABLE_ITEM = require('@bsport/common/lib/master-data/buyable-items');

const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_COMBO_ITEM,
} = BUYABLE_ITEM;

exports.default = {
  current_day: 'Dernières 24 heures',
  current_week: 'Dernière semaine',
  current_month: 'Mois dernier',
  last_three_months: 'Trois derniers mois',
  current_year: 'Dernière année',
  thisWeek: 'Cette semaine',
  thisMonth: 'Ce mois',
  newMembers: 'Nouveaux membres',
  nbOffers: 'Séances',
  pageTitle: 'Tableau de bord',
  // eslint-disable-next-line
  turnover: {
    title: 'Encaissements',
    caption: "Chiffre d'affaire (€)",
    popover: 'Somme de tous les paiements reçus figurant sur les factures',
  },
  bookings: 'Réservations',
  dateRange: {
    start: 'Début',
    end: 'Fin',
  },
  filterByDateTitle: 'Filtrer par date',
  detailsGraphTitle: 'En détails',
  billedSubscriptions: {
    title: 'Nombre de souscriptions facturées',
    caption: 'Souscriptions',
    popover: 'Le nombre de factures liées à une souscription non annulée',
  },
  bookingsWeektimeSlot: {
    title: 'Effectif moyen',
    popover: 'Effectif moyen des séances par créneau horaire',
  },
  dateFilter: {
    customSelect: 'Sélectionner une plage de dates',
    quickSelect: 'Choix rapide',
  },
  noData: 'Aucune donnée à afficher',
  bookingSource: {
    title: 'Origine des réservations',
    app: 'Application',
    web: 'Web',
    saas: 'Backoffice bsport',
    other: 'Autre',
    migration: 'Migration de données',
  },
  plannedPayment: {
    title: 'Encaissements des souscriptions',
    caption: 'Encaissement (€)',
    popover: 'Somme de tous les paiements reçus concernant les souscriptions',
  },
  invoiceItems: {
    title: 'Ventes par type de produit',
    contentType: {
      [BUYABLE_ITEM_PASS]: 'Cartes de cours',
      [BUYABLE_ITEM_SHOP_ITEM]: 'Produits du magasin',
      [BUYABLE_ITEM_PRIVATE_PASS]: 'Carte de RDV',
      [BUYABLE_ITEM_FEE]: 'Frais de livraison',
      [BUYABLE_ITEM_COMBO_ITEM]: 'Packs',
      [BUYABLE_ITEM_COUPON]: 'Promotion',
    },
  },
};
