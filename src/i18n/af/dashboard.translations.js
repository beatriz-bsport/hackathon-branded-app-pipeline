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

const MEMBER_GRAPH_IDENTIFIER = 'graph_members';
const BOOKING_GRAPH_IDENTIFIER = 'graph_bookings';
const PRIVATE_BOOKING_GRAPH_IDENTIFIER = 'graph_private_bookings';
const PAYMENT_GRAPH_IDENTIFIER = 'graph_payments';
const BILLING_PLAN_GRAPH_IDENTIFIER = 'graph_billing_plan';
const SUBSCRIPTION_GRAPH_IDENTIFIER = 'graph_subscriptions';
const DISPUTE_GRAPH_IDENTIFIER = 'graph_dispute';
const INVOICE_GRAPH_IDENTIFIER = 'graph_invoice_items';

exports.default = {
  save: 'Sauvegarder',
  resetModal: {
    title: 'Réinitialiser les paramètres',
    content:
      'Les paramètres des différents onglets reviendront à leur valeur par défaut, voulez-vous continuer ?',
    cancel: 'Annuler',
    confirm: 'Continuer',
  },
  tabNameDialog: {
    titleAdd: 'Ajouter un nouvel onglet',
    titleRename: "Renommer l'onglet",
    placeholder: 'Nom',
  },
  noGraphToDisplay:
    'Aucun graphe configuré dans cet onglet. Ajoutez-en un ici.',
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
    caption: 'Encaissements',
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
  booking: {
    title: 'Réservations',
    caption: 'Réservations enregistrées',
    popover:
      'Le nombre total de réservations enregistrées pour cette date. Vous pouvez filtrer les annulations / late-cancel / ...',
  },
  bookingsWeektimeSlot: {
    title: 'Effectif moyen',
    popover: 'Effectif moyen des séances par créneau horaire',
  },
  privateBooking: {
    title: 'Rendez-vous',
    caption: 'RDV enregistrés',
    popover:
      'Le nombre total de RDV enregistrés pour cette date. Vous pouvez filtrer les annulations / remboursements / ...',
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
    caption: 'Encaissement',
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
      title: 'Graphique',
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
        privateBooking: 'RDV',
      },
      name: 'Titre du graphe',
      aggregate: 'Cumuler',
      aggregateHelper:
        "Ex: affiche l'évolution du nb total des membres, plutôt que le nb de nouveaux membres, chaque mois.",

      radio: {
        temporalMember: 'Évolution dans le temps',
        temporalTimeslotBooking: 'Fréquences journalières et horaires',
        temporalBooking: 'Évolution dans le temps',
        temporalPrivateBooking: 'Évolution dans le temps',
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
  filterChipLabel: '{{count}} filtre',
  filterChipLabel_plural: '{{count}} filtres',
  addFilter: 'Ajouter un filtre',
  showMoreLegend: '+ {{count}} légende',
  showMoreLegend_plural: '+ {{count}} légendes',
  graphActions: {
    edit: 'Modifier',
    delete: 'Supprimer',
  },
  graphFormDrawer: {
    title: {
      create: "Création d'un graphique",
      edit: "Modification d'un graphique",
    },
    sectionTitles: {
      general: 'Informations générales',
      dashboardGraphIdentifier: 'Type de données',
      graphFamily: 'Graphique',
      graphParams: 'Données',
      timePeriod: 'Période',
      filterConfig: 'Filtres',
    },
    labels: {
      title: 'Nom',
      graphFamily: {
        temporal: 'Évolution dans le temps',
        qualitative: 'Répartition',
      },
      groupByField: 'Répartir sur',
      dateFilterField: 'Donnée pour la date',
      dataToDisplay: 'Donnée affichée',
      dividedBy: 'Divisée par',
      aggregationName: 'Agrégation',
    },
    placeholders: {
      dashboardGraphIdentifier: 'Choisir un type de données',
      aggregationSelector: 'Choisissez une opération',
    },
    chartComponents: {
      bar: 'Histogramme',
      qualitativeBar: 'Histogramme',
      area: 'Diagramme en aires',
      pie: 'Diagramme circulaire',
      timeslots: 'Fréquences journalières et horaires',
    },
    graphFamily: {
      temporal: 'Évolution dans le temps',
      qualitative: 'Répartition',
      week_timeslots: 'Fréquences journalières et horaires',
    },
    aggregation: {
      sum: 'Somme',
      avg: 'Moyenne',
      min: 'Minimum',
      max: 'Maximum',
    },
    dashboardGraphIdentifier: {
      [MEMBER_GRAPH_IDENTIFIER]: 'Nouveaux membres',
      [BOOKING_GRAPH_IDENTIFIER]: 'Réservations',
      [PRIVATE_BOOKING_GRAPH_IDENTIFIER]: 'RDV',
      [PAYMENT_GRAPH_IDENTIFIER]: 'Paiements',
      [SUBSCRIPTION_GRAPH_IDENTIFIER]: 'Factures souscriptions',
      [BILLING_PLAN_GRAPH_IDENTIFIER]: 'Souscriptions',
      [DISPUTE_GRAPH_IDENTIFIER]: 'Litiges',
      [INVOICE_GRAPH_IDENTIFIER]: 'Achats',
    },
    accumulate: {
      total: 'Accumuler',
    },
    helperText: {
      dateStart:
        'Les données seront représentées dans le temps en fonction de la date de début des séances.',
      dateCreated:
        'Les données seront représentées dans le temps en fonction de la date à laquelle les réservations ont été effectuées.',
      plannedInvoiceCount: 'Nombre de factures liées aux souscriptions.',
      subscriptionPrice: {
        sum: 'Somme de tous les paiements reçus liés aux souscriptions.',
        avg: 'Moyenne de tous les paiements reçus liés aux souscriptions.',
        min: 'Minimum de tous les paiements reçus liés aux souscriptions.',
        max: 'Maximum de tous les paiements reçus liés aux souscriptions.',
      },
      subscriptionCount: 'Nombre de factures liées aux souscriptions.',
      booking_effectif_timeslots:
        'Effectif moyen des séances par créneau horaire.',
      accumulateMembers: "Affiche l'évolution du nombre total de membres.",
    },
  },
  dataSourceIdentifiers: {
    plan_auto_renewal: 'Renouvellement tacite',
    billing_plan_payment_method: 'Moyen de paiement',
    contract_name: 'Abonnement',
    date_joined: "Date d'inscription",
    member_pk: 'Nombre de nouveaux membres',
    member_pk_accumulate: 'Nombre de membres',
    booking_pk: 'Nombre de réservations',
    is_recurrent_booking: 'Réservation récurrente',
    last_invoice_status: 'Statut du dernier paiement',
    source_device: 'Origine',
    franchisor_commission_amount_notax: 'Frais de commission franchisé HT',
    franchisor_commission_amount: 'Frais de commission franchisé TTC',
    staff_commission_amount: 'Frais de commission du staff TTC',
    staff_commission_amount_notax: 'Frais de commission du staff HT',
    total_price_notax: 'Montant facturé HT',
    total_price: 'Montant facturé TTC',
    invoice_date_created: "Date d'émission de la facture",
    author: 'Auteur',
    privatebooking_pk: 'Nombre de RDV',
    payment_pk: 'Nombre de paiements',
    plannedinvoice_pk: 'Nombre de factures',
    billingplan_pk: "Nombre d'abonnements",
    invoiceitem_pk: "Nombre d'objets facturés",
    booking_effectif_timeslots: 'Effectif moyen',
    activity_kind: 'Type de cours',
    is_workshop: 'Atelier',
    payment_engine: 'Type de paiement',
    attendance: 'Présent',
    date_start: 'Date de la séance',
    date_created: 'Date de la réservation',
    new_member_only: 'Offre nouveau membre',
    plan_date_end: 'Date de fin de facturation',
    plan_date_start: 'Date de première facturation',
    plan_flat_fee: 'Frais de dossier',
    plan_recurrent_price: 'Montant du paiement récurrent',
    plan_status: "Statut de l'abonnement",
    booking_status_code: 'Statut de la réservation',
    was_refunded: 'Remboursé',
    coach: 'Professeurs',
    establishment: 'Etablissement',
    billing_group: 'Groupe de facturation',
    billing_establishment: 'Localisation',
    gender: 'Sexe',
    accept_email: 'Accepte les emails',
    accept_sms: 'Accepte les SMS',
    payment_date: 'Date de paiement',
    payment_price: 'Prix TTC',
    payment_method: 'Méthode de paiement',
    date: 'Date de paiement',
    contract: 'Contrat',
    price: 'Prix TTC',
    private_service_name: 'Rendez-vous',
    margin_value: 'Apport marginal TTC',
    nb_planned_invoices: "Nombre d'encaissements total",
    activity: 'Activité',
    payment_pack: 'Carte de cours',
    private_pass: 'Carte de RDV',
    payout_date_created: 'Date du virement',
    payout_identifier: 'Virement',
    payout_status: 'Status du virement',
    total_discount: 'Réduction totale',
    total_payments_made: "Nombre d'encaissements effectués",
    is_unpaid: 'Impayé',
    dispute_status: 'Status de litige',
    is_no_show: 'Absent (no show)',
  },
  graphDefaultTitles: {
    paymentTemporal: 'Encaissements',
    bookingTimeslots: 'Effectif moyen',
    bookingQualitative: 'Origine des réservations',
    bookingTemporal: 'Réservations',
    subscriptionTemporalCount: 'Nombre de factures de souscription',
    subscriptionTemporalSum: 'Encaissement des souscriptions',
    billingPlanTemporal: 'Souscriptions',
    memberTemporal: 'Nouveaux membres',
    privateBookingTemporal: 'Rendez-vous',
    invoiceItemTemporal: 'Somme totale des objets facturés',
  },
  placeholderEmptyValues: {
    coach: 'Pas de professeur',
    establishment: "Pas d'établissement",
  },
};
