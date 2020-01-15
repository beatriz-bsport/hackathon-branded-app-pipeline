import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  PAYMENT_PACK_NOT_BOUGHT_FILTER_IDENTIFIER,
  PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER,
  PAYMENT_PACK_EXPIRATION_IDENTIFIER,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  GT_COMPARATOR,
  TAG_FILTER_IDENTIFIER,
  E_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

export default {
  mails: 'Mails',
  multiSelector: {
    selectAll: 'Tout sélectionner',
    paymentPacks: {
      helperText: 'selectionner des cartes de cours',
      helperSelectedText: 'cartes de cours sélectionnées',
      textFieldPlaceholder: 'Rechercher une carte de cours',
    },
    metaActivities: {
      helperText: 'selectionner des activités',
      helperSelectedText: 'activités sélectionnées',
      textFieldPlaceholder: 'Rechercher une activité',
    },
  },
  selectToShowPreview: 'Sélectionnez un template',
  exportList: 'Exporter la liste',
  membersInList: 'Membres dans la liste:',
  modal: {
    delete: {
      title: 'Suppression liste',
      content:
        'Êtes-vous sûr de vouloir supprimer cette liste ? Cette opération est définitive',
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
  graphs: {
    bookings: 'Réservations',
    expensesSegments: {
      title: { first: 'Dépenses entre le', second: 'et le' },
      label: {
        0: 'Aucune dépense',
        1: 'Premier quartile',
        2: 'Moyenne',
        3: 'Dernier quartile',
      },
    },
    bookingsSegments: {
      title: 'Dernière réservation',
      label: {
        0: 'Dernier mois',
        1: 'Entre 1 et 12 mois',
        2: "Plus d'un an",
      },
    },
  },

  mail: {
    send: 'Envoyer',
    sendMailTitle: 'Envoyer un email',
    cancel: 'Annuler',
    sendMail: 'Envoyer un email',
    noMailAvailable: 'Pas de mail disponbile, pensez à en créer un',
    sendSuccess: "Mail en cours d'envoi",
    sendError: "Problème lors de l'envoi du mail",
  },
  detail: {
    tab: {
      member: 'Général',
      email: 'Emails',
    },
    statTitle: 'Statistiques',
  },
  smart_list: {
    actions: {
      configure: 'Configurer',
    },
    card: {
      description: 'Description',
    },
    list: { title: 'Listes intelligentes', detailTitle: 'Détail de la liste' },
    name: 'Nom',
    description: 'Description',
    submit: 'Enregistrer',
    cancel: 'Annuler',
    add: 'Ajouter une liste',
    detail: 'Détail de la liste',
    createTitle: 'Liste intelligente',
  },
  filterCategory: {
    [MEMBER_INFO]: 'Informations membre',
    [PAYMENT_PACK]: 'Abonnements',
    [BOOKING]: 'Réservations',
    [BUY]: 'Achats',
  },
  filters: {
    all: 'Tous',
    active_filters: 'Filtre(s) actif(s) sur la liste',
    add_filter: 'Ajouter un filtre',
    add: 'Ajouter',
    before: 'avant',
    after: 'après',
    classic_comparators: {
      [GTE_COMPARATOR]: 'supérieur (⩾)',
      [LTE_COMPARATOR]: 'inférieur (⩽)',
      [E_COMPARATOR]: 'égal',
      [LT_COMPARATOR]: 'strictement inférieur',
      [GT_COMPARATOR]: 'strictement supérieur',
    },
    durations_comparators: {
      [LTE_COMPARATOR]: 'moins de (⩽)',
      [GTE_COMPARATOR]: 'plus de (⩾)',
      [E_COMPARATOR]: 'exactement',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Accompte',
      first: "L'accompte du client est",
      second: ' à   ',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Date dernière séance réservée',
      first: 'La dernière séance réservée a eu lieu il y a plus de',
      second: 'jours',
    },
    [DATE_JOINED_FILTER_IDENTIFIER]: {
      name: "Date d'inscription",
      first: 'A rejoint le club   ',
      second: ' le   ',
      before: 'avant',
      after: 'après',
    },
    [PAYMENT_PACK_PURCHASED_FILTER_IDENTIFIER]: {
      name: 'Abonnement acheté',
      first: 'Membres',
      second: 'acheté un des cartes de cours',
      has_bought: 'ayant déjà',
      hasnt_bought: "n'ayant jamais",
    },
    [PAYMENT_PACK_NOT_BOUGHT_FILTER_IDENTIFIER]: {
      name: 'Carte de cours non achetée',
      first: "Membres n'ayant jamais acheté la carte de cours ",
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sexe',
      first: 'Selectionner uniquement les',
      men: 'hommes',
      women: 'femmes',
    },
    [PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER]: {
      name: "Date d'achat et crédits par carte de cours",
      infoIcon:
        'Les cartes de cours illimités ne sont pas filtrées sur le crédit',
      first: 'A acheté la carte de cours',
      second: 'entre le',
      third: 'et le',
      fourth: 'et possède',
      fifth: 'crédits dessus',
    },
    [PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER]: {
      name: 'Crédits par abonnement',
      first: 'Les crédits des cartes de cours',
      second: 'sont',
      third: 'à',
      infoIcon:
        'Ne concerne que les cartes de cours en cours de validité et non illimités',
    },
    [PAYMENT_PACK_EXPIRATION_IDENTIFIER]: {
      name: 'Expiration',
      first: "L' une des cartes de cours",
      second: 'expire dans',
      third: 'jours',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: 'Validité de la carte de cours',
      first: 'Possède une carte de cours',
      second: 'utilisable (avec des crédits ou illimité et non expiré)',
    },
    [WENT_TO_ACTIVITY_FILTER_IDENTIFIER]: {
      name: 'Par activité',
      first: 'A participé à une séance de',
      second: 'au cours des',
      third: 'derniers jours',
    },
    [BOOKING_ATTENDANCE_FILTER_IDENTIFIER]: {
      name: 'Nombre de cours suivis',
      first: 'A participé à ',
      second: 'cours ces',
      third: 'derniers jours',
    },
    [SENIORITY_FILTER_IDENTIFIER]: {
      name: 'Ancienneté',
      first: 'Membre depuis',
      second: 'jours',
    },
    [TAG_FILTER_IDENTIFIER]: {
      name: 'Tags',
      first: 'Filtrer sur les tags suivants',
    },
    [EXPENSES_FILTER_IDENTIFIER]: {
      shop: 'Magasin',
      pack: 'Carte de cours',
      combo: 'Pack',
      private_pass: 'Cours particulier',
      workshop: 'Abonnement spécial atelier',
      name: 'Dépenses',
      first: 'A dépensé',
      second: '€ entre le',
      third: 'et le',
      fourth: 'pour les produits',
      selector: 'Choisir les produits',
    },
  },
};
