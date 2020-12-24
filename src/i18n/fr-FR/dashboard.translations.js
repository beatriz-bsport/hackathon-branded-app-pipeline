const BOOKING_SOURCES = require('@bsport/common/lib/master-data/booking_source');
const BUYABLE_ITEM = require('@bsport/common/lib/master-data/buyable-items');

const {
  BOOKING_SOURCE_APP,
  BOOKING_SOURCE_WEB,
  BOOKING_SOURCE_SAAS,
  BOOKING_SOURCE_OTHER,
  BOOKING_SOURCE_MIGRATION,
} = BOOKING_SOURCES;

const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_COMBO_ITEM,
} = BUYABLE_ITEM;

exports.default = {
  save: 'Sauvegarder',
  resetModal: {
    title: 'Réinitialiser les paramètres',
    content:
      'Les paramètres des différents graphes reviendront à leur valeur par défaut, voulez-vous continuer ?',
    cancel: 'Annuler',
    confirm: 'Continuer',
  },
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
    caption: 'Encaissements (€)',
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
  },
  plannedPayment: {
    title: 'Encaissements des souscriptions',
    caption: 'Encaissement (€)',
    popover: 'Somme de tous les paiements reçus concernant les souscriptions',
  },
  invoiceItems: {
    title: 'Ventes par type de produit',
  },
  bookingDropdown: {
    source: {
      [BOOKING_SOURCE_APP.id.toString()]: 'Application',
      [BOOKING_SOURCE_WEB.id.toString()]: 'Web',
      [BOOKING_SOURCE_SAAS.id.toString()]: 'Backoffice bsport',
      [BOOKING_SOURCE_OTHER.id.toString()]: 'Autre',
      [BOOKING_SOURCE_MIGRATION.id.toString()]: 'Migration de données',
    },
  },
  invoiceItemDropdown: {
    contentType: {
      [BUYABLE_ITEM_PASS]: 'Cartes de cours',
      [BUYABLE_ITEM_SHOP_ITEM]: 'Produits du magasin',
      [BUYABLE_ITEM_PRIVATE_PASS]: 'Carte de RDV',
      [BUYABLE_ITEM_FEE]: 'Frais de livraison',
      [BUYABLE_ITEM_COMBO_ITEM]: 'Packs',
      [BUYABLE_ITEM_COUPON]: 'Promotion',
    },
  },
  customChart: {
    addChart: 'Créer un graphe',
    noResource: 'Veuillez choisir un type de donnée.',
    form: {
      title: 'Graphe',
      cancel: 'Annuler',
      submit: 'Enregistrer',
      datatype: 'Type de graphe',
      graphComponent: 'Représentation souhaitée',
      selector: {
        object: {
          isEmpty: 'Aucune donnée sélectionnée',
          placeholder: 'Sélectionnez un type de donnée',
          helperText: 'Choisissez ce que vous souhaitez visualiser',
        },
        member: 'Nouveaux membres',
        booking: 'Réservations',
        payment: 'Paiements',
        invoice: 'Achats',
      },
      name: 'Titre du graphe',
      aggregate: 'Cumuler',
      aggregateHelper:
        "Ex: affiche l'évolution du nb total des membres, plutôt que le nb de nouveaux membres, chaque mois.",

      radio: {
        temporalMember: 'Évolution dans le temps',
        temporalTimeslotBooking: 'Fréquence journalières',
        temporalBooking: 'Évolution dans le temps',
        qualitativeBooking: 'Répartition',
        temporalPayment: 'Évolution dans le temps',
        temporalPlannedInvoice: 'Évolution dans le temps',
        qualitativeInvoiceItem: 'Répartition',
        bar: 'Histogramme',
        area: 'Graphique en aires',
        grid: 'Tableau des fréquences',
        pie: 'Diagramme circulaire',
      },
    },
  },
};
